import {DefaultLanguage, jsonFilename, LanguageOption} from "@languages-plugin/models/language-option";
import {assign, getprop, getters, uid, writeable} from "@languages-plugin/shortcuts/properties";
import {parameters, PluginName} from "@languages-plugin/parameters";
import {concat, flattenobj, get, get2, set2, string} from "@languages-plugin/shortcuts/mappers";
import {each, each2} from "@languages-plugin/shortcuts/iterables";
import {fetchJson} from "@languages-plugin/shortcuts/requests";
import {append} from "@languages-plugin/shortcuts/env/logger";
import {isDefined, isObject, isString} from "@languages-plugin/shortcuts/validations";
import {actorFromTransform} from "@languages-plugin/mappers/actor";
import {itemFromTransform} from "@languages-plugin/mappers/item";
import {skillFromTransform} from "@languages-plugin/mappers/skill";
import {stateFromTransform} from "@languages-plugin/mappers/state";
import {troopFromTransform} from "@languages-plugin/mappers/troop";
import {assignCommandToEvent} from "@languages-plugin/mappers/event";
import {join, sep} from "@languages-plugin/shortcuts/env/path";
import {KeyableObject} from "@jstls/types/core/objects";
import {Maybe} from "@jstls/types/core";
import {mapFromTransform} from "@languages-plugin/mappers/map";
import {LanguageSource, MapSource} from "@languages-plugin/models/source";
import {partialMethod} from "@languages-plugin/shortcuts/cls";
import {extractFromSuffix, suffixTo} from "@languages-plugin/models/helpers";
import {keys} from "@jstls/core/objects/handlers/properties";

/**
 * Main plugin handler interface that provides access to language management functionality.
 * Use this to programmatically interact with the localization system.
 *
 * @example
 * // Change language by index
 * YDP_Languages.handler.load(1);
 *
 * // Get custom text
 * const text = YDP_Languages.handler.getCustom("text", "my_key");
 *
 * // Get localized image
 * const image = YDP_Languages.handler.getImage("img/pictures", "my_image");
 */
export interface PluginHandler {
  /** The currently active language configuration object */
  readonly language: LanguageOption

  /** The zero-based index of the currently selected language in the languages array */
  readonly index: number;

  /** The display name of the current language (e.g., "English", "Español") */
  readonly name: string;

  /** The label used in the options menu for this language */
  readonly label: string;

  /** The unique code identifier for this language (e.g., "en", "es") */
  readonly code: string;

  /**
   * Initializes the handler by loading language files and applying the default language.
   * Called automatically during plugin initialization.
   */
  setup(): void;

  /**
   * Updates the game data with the current language's translations.
   * Use this after changing the language to refresh all translated content.
   */
  update(): void;

  /**
   * Changes the active language to the language at the specified index.
   * @param index - The zero-based index of the language to activate
   * @returns true if the language was changed, false if the same language is already active
   */
  load(index: number): boolean;

  /**
   * Retrieves a custom text value for the given key.
   * Custom texts allow translating strings that aren't in the standard RPG Maker database.
   * @param key - The type of custom text ("option", "status", or "text")
   * @param name - The key identifying the custom text entry
   * @returns The translated text, or the original name if no translation exists
   */
  getCustom(key: "option" | "status" | "text", name: string): string;

  /**
   * Resolves the appropriate image filename for the current language.
   * Supports language-specific image variants and automatic fallback.
   * @param folder - The folder path where the image is located (e.g., "img/pictures")
   * @param filename - The base filename of the image
   * @returns The resolved filename, which may include language suffix if a localized version exists
   */
  getImage(folder: string, filename: string): string;

  /**
   * Retrieves translated map data for the specified map ID.
   * @param id - The database ID of the map
   * @returns The translated MapSource object, or undefined if not found
   */
  getMap(id: number): Maybe<MapSource>;
}

/**
 * Loads the JSON language file for the specified language from the languages folder.
 * The file is fetched asynchronously and cached in the handler's files storage.
 * @param language - The LanguageOption object representing the language to load
 * @returns A promise that resolves to the LanguageSource data, or null if not found/empty
 */
export function loadLanguageFile(language: LanguageOption) {
  return fetchJson(jsonFilename(language, parameters.folder))
    .then((data: LanguageSource) => {
      if (!isDefined(data))
        return null;

      set2(get2(handler, filesKey), language.code, data);

      language.equals(get2(handler, languageKey)) && update(handler);

      return data;
    }).catch(append)
}

/**
 * Loads all configured language files based on the loadMode parameter.
 * If loadMode is "lang", only loads the current language.
 * If loadMode is "full", loads all languages into memory.
 */
export function loadLanguageFiles() {
  if (parameters.loadMode === "lang") {
    loadLanguageFile(get2(handler, languageKey));
    return;
  }
  each(
    parameters.languages,
    loadLanguageFile
  )
}

/**
 * Applies the current language's translations to the game data.
 * This function updates all translatable game data including:
 * - System data (title, terms, weapon/equip/skill types)
 * - Actors, items, skills, states, classes, enemies, troops, weapons, armors
 * - Common events text commands
 * - Custom texts and image mappings
 * - Map data
 * @param $this - The PluginHandler instance to update
 */
export function update($this: PluginHandler) {
  const language = get2($this, languageKey),
    files = get2($this, filesKey);
  if (!isDefined(language) || !isDefined(files))
    return;

  const file = get2(files, language.code) as LanguageSource;

  if (!isDefined(file))
    return;

  $dataSystem.gameTitle = file.title;
  $dataSystem.terms = file.terms;
  $dataSystem.weaponTypes = file.weaponTypes;
  $dataSystem.equipTypes = file.equipTypes;
  $dataSystem.skillTypes = file.skillTypes;

  // assign actors
  if (file.actors) {
    each2(file.actors, function (actor, index) {
      assign($dataActors[index], actorFromTransform(actor))
    });
  }
  // assign armors
  if (file.armors) {
    each2(file.armors, function (armor, index) {
      assign($dataArmors[index], itemFromTransform(armor))
    });
  }
  // assign classes
  if (file.classes) {
    each2(file.classes, function (cls, index) {
      $dataClasses[index].name = cls;
    });
  }
  // assign enemies
  if (file.enemies) {
    each2(file.enemies, function (enemy, index) {
      $dataEnemies[index].battlerName = enemy;
    });
  }
  // assign items
  if (file.items) {
    each2(file.items, function (item, index) {
      assign($dataItems[index], itemFromTransform(item))
    });
  }
  // assign skills
  if (file.skills) {
    each2(file.skills, function (skill, index) {
      assign($dataSkills[index], skillFromTransform(skill))
    });
  }
  // assign states
  if (file.states) {
    each2(file.states, function (state, index) {
      assign($dataStates[index], stateFromTransform(state))
    });
  }
  // assign troops
  if (file.troops) {
    each2(file.troops, function (troop, index) {
      troop = troopFromTransform(troop);
      const source = $dataTroops[index];
      if (source) {
        source.name = troop.name;
        assignCommandToEvent(troop.messages, $dataTroops);
      }
    });
  }
  // assign weapons
  if (file.weapons) {
    each2(file.weapons, function (weapon, index) {
      assign($dataWeapons[index], itemFromTransform(weapon))
    });
  }

  // assign language commands
  if (file.commonEvents && file.commonEvents.messages) {
    assignCommandToEvent(file.commonEvents.messages, [
      <MapEvent>{
        id: 0,
        name: "",
        pages: $dataCommonEvents as any
      }
    ])
  }

  // assign custom values
  set2($this, customsKey, file.custom)
  set2($this, imagesKey, flattenobj(file.images, sep))
  set2($this, mapsKey, file.maps);
}

/**
 * Adjusts the language index to ensure it stays within valid bounds.
 * If index is negative, wraps to the last language. If greater than total, wraps to first.
 * @param total - The total number of available languages
 * @param index - The desired language index
 * @returns The adjusted index within valid bounds
 */
export function changeIndex(total: number, index: number): number {
  index = (string(index).toInt() || 0);

  if (index >= total)
    index = 0;
  else if (index < 0)
    index = total - 1;

  return index;
}

/**
 * Resolves a localized image filename from the images cache.
 * Returns the original filename if image localization is disabled or no localized version exists.
 * @param images - The cached images object from the language file
 * @param folder - The folder path (e.g., "img/pictures")
 * @param filename - The original filename to resolve
 * @returns An object containing the resolved filename and success status
 */
export function getImage(images: KeyableObject, folder: string, filename: string): {
  filename: string,
  success: boolean
} {
  if (!parameters.enableImages || !isDefined(images))
    return {filename, success: !parameters.enableImages};

  const filepath = join(folder, filename),
    result = get2(images, filepath);

  if (isString(result))
    return {filename: result, success: true};

  return {filename, success: false};
}

export function getCustomText($this: PluginHandler, key: string, query: string): string {
  const customTexts = get2($this, customsKey);
  let res: string = get(customTexts, key, query) as string;
  if ((!res || res === query) && parameters.customFallbacks) {
    const fallbacks = ["text", "option", "status"];
    for (let i = 0; i < fallbacks.length; i++) {
      const fb = fallbacks[i];
      if (fb !== key) {
        res = get(customTexts, fb, query) as string;
        if (res && res !== query) break;
      }
    }
  }
  return res;
}

/**
 * Resolves translation tags embedded in text strings.
 *
 * Supports two tag modes:
 * - **Escape tags**: `\x1bL[KEY]` — looks up KEY in the active language's custom texts.
 * - **Wrapping tags**: `{L}Text{/L}` (or square/angle variants) — looks up Text as a key.
 *
 * Both modes are independently toggleable via plugin parameters.
 *
 * @param $this  - The PluginHandler instance for custom-text lookups.
 * @param key    - The custom-text category ("option" | "status" | "text").
 * @param text   - The raw text that may contain translation tags.
 * @returns The text with all recognised tags replaced by their translations.
 */
function processTags($this: PluginHandler, key: string, text: string): string {
  if (!isString(text)) return text;

  let processed = false;

  // --- Escape tags: \x1b<KEY>[ID] ---
  if (parameters.enableEscapeTag) {
    const ek = parameters.escapeTagKey;
    const escapeRe = new RegExp('\\x1b' + ek + '\\[([^\\]]+)\\]', 'gi');
    text = text.replace(escapeRe, function (_match: string, id: string) {
      const resolved = getCustomText($this, key, id);
      processed = true;
      return (resolved && resolved !== id) ? resolved : id;
    });
  }

  // --- Wrapping tags: {L}Text{/L}  |  [L]Text[/L]  |  <L>Text</L> ---
  if (parameters.enableWrappingTag) {
    const wk = parameters.wrappingTagKey;
    let wrapRe: RegExp;
    switch (parameters.wrappingTagFormat) {
      case "square":
        wrapRe = new RegExp('\\[' + wk + '\\]([\\s\\S]*?)\\[\\/' + wk + '\\]', 'gi');
        break;
      case "angle":
        wrapRe = new RegExp('<' + wk + '>([\\s\\S]*?)<\\/' + wk + '>', 'gi');
        break;
      default: // curly
        wrapRe = new RegExp('\\{' + wk + '\\}([\\s\\S]*?)\\{\\/' + wk + '\\}', 'gi');
        break;
    }
    text = text.replace(wrapRe, function (_match: string, source: string) {
      const resolved = getCustomText($this, key, source);
      processed = true;
      return (resolved && resolved !== source) ? resolved : source;
    });
  }

  if (processed) {
    return processTags($this, key, text);
  }

  return text;
}

// instance the uids for properties
const indexKey = uid("i"),
  languageKey = uid("l"),
  nameKey = uid("n"),
  labelKey = uid("l"),
  codeKey = uid("c"),
  filesKey = uid("f"),
  customsKey = uid("c"),
  imagesKey = uid("i"),
  mapsKey = uid("m"),
  setupKey = uid("s"),
  // set the methods
  handler = <PluginHandler>{
    setup() {
      loadLanguageFiles();
      const $this = this;
      $this.load($this.index);
      set2($this, setupKey, true);
    },
    load: function (index) {
      const $this = this,
        {languages} = parameters,
        total = languages.length;

      if (total === 0)
        return false;

      const target = changeIndex(total, index),
        language = languages[target];

      if (!isObject(language))
        return false;

      if (target === $this.index && get2($this, setupKey))
        return false;

      set2($this, indexKey, target);
      set2($this, languageKey, language);

      set2($this, nameKey, language.name);
      set2($this, labelKey, language.label);

      return true;
    },
    update() {
      if (parameters.loadMode === "lang") {
        const $this = this,
          language = get2($this, languageKey) as LanguageOption;
        loadLanguageFile(language)
          .then(data => {
            data && set2(get2($this, filesKey), language.code, null);
          });
        return;
      }
      update(this);
    },
    getCustom(key, name): string {
      if (!parameters.enableCustom)
        return name;
      if (this.language.equals(DefaultLanguage)) {
        if (parameters.enableWrappingTag) {
          return processTags(this, key, name);
        }
        return name;
      }

      if(!isString(name)) {
        console.warn("[Languages Plugin] Custom text query must be a string. Received: ", name);
        return name;
      }

      let result = getCustomText(this, key, name);
      if (result && result !== name) {
        return processTags(this, key, result);
      }

      const trimmer = get2(parameters.customTrimmers, key) as RegExp;
      if (trimmer && isString(name)) {
        const lookup = name.replace(trimmer, '');
        if (lookup !== name) {
          result = getCustomText(this, key, lookup);
          if (result && result !== lookup) {
            const translated = name.indexOf(lookup) !== -1 ? name.replace(lookup, result) : result;
            return processTags(this, key, translated);
          }
        }
      }

      // Even when no custom-text match was found, process inline tags.
      return processTags(this, key, name);
    },
    getImage(folder, filename) {
      const $this = this,
        images = get2($this, imagesKey) as KeyableObject;

      filename = string(filename)
      const {filename: result, success} = getImage(images, folder, filename);

      if (success)
        return result || filename;

      for (let i = 0; i < parameters.languages.length; i++) {
        const language = parameters.languages[i],
          result = extractFromSuffix(filename);

        if (
          keys(result).length &&
          (!isDefined(result.code) || language.code === result.code) &&
          (!isDefined(result.name) || language.name === result.name) &&
          (!isDefined(result.label) || language.label === result.label)
        ) {
          const languageSuffix = suffixTo(language, ""),
            fixedName = result.filename || filename.replace(languageSuffix, "");

          if (!language.equals($this.language))
            filename = fixedName;

          return filename;
        }
      }

      return filename;
    },
    getMap(id) {
      const maps = get2(this, mapsKey) as KeyableObject<MapSource>;
      if (!maps)
        return undefined;
      return mapFromTransform(get2(maps, id)!);
    }
  };

// set the defaults values
writeable(handler, indexKey, 0);
writeable(handler, codeKey, concat(PluginName, "#Index"));
writeable(handler, labelKey, "Language");
writeable(handler, nameKey, "Language");
writeable(handler, languageKey, DefaultLanguage);
writeable(handler, filesKey, {});
writeable(handler, customsKey, null);
writeable(handler, imagesKey, null)
writeable(handler, mapsKey, null)
writeable(handler, setupKey, false);
// set the getters
getters(handler, {
  name: partialMethod(getprop, nameKey),
  label: partialMethod(getprop, labelKey),
  code: partialMethod(getprop, codeKey),
  language: partialMethod(getprop, languageKey),
  index: partialMethod(getprop, indexKey),
})


export {handler}
