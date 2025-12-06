import {DefaultLanguage, jsonFilename, LanguageOption} from "@languages-plugin/models/language-option";
import {assign, getprop, getters, uid, writeable} from "@languages-plugin/shortcuts/properties";
import {parameters, PluginName} from "@languages-plugin/parameters";
import {concat, get, get2, set2, string} from "@languages-plugin/shortcuts/mappers";
import {each, each2} from "@languages-plugin/shortcuts/iterables";
import {fetchJson} from "@languages-plugin/shortcuts/requests";
import {append} from "@languages-plugin/shortcuts/env/logger";
import {isDefined} from "@languages-plugin/shortcuts/validations";
import {actorFromTransform} from "@languages-plugin/mappers/actor";
import {itemFromTransform} from "@languages-plugin/mappers/item";
import {skillFromTransform} from "@languages-plugin/mappers/skill";
import {stateFromTransform} from "@languages-plugin/mappers/state";
import {troopFromTransform} from "@languages-plugin/mappers/troop";
import {assignCommandToEvent} from "@languages-plugin/mappers/event";
import {Filepath} from "@languages-plugin/shortcuts/env/path";
import {KeyableObject} from "@jstls/types/core/objects";
import {Maybe} from "@jstls/types/core";
import {mapFromTransform} from "@languages-plugin/mappers/map";
import {LanguageSource, MapSource} from "@languages-plugin/models/source";
import {partialMethod} from "@languages-plugin/shortcuts/cls";

export interface PluginHandler {
  readonly language: LanguageOption
  readonly index: number;

  readonly name: string;

  readonly label: string;

  readonly code: string;

  setup(): void;

  update(): void;

  load(index: number): boolean;

  getCustom(key: string, name: string): string;

  getImage(folder: string, filename: string): string;

  getMap(id: number): Maybe<MapSource>;
}

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

export function update($this: PluginHandler) {
  const language = get2($this, languageKey),
    files = get2($this, filesKey);
  if (!isDefined(language))
    return;

  const file = get2(files, language.code) as LanguageSource;

  if (!isDefined(files))
    return;

  $dataSystem.gameTitle = file.title;
  $dataSystem.terms = file.terms;
  $dataSystem.weaponTypes = file.weaponTypes;
  $dataSystem.equipTypes = file.equipTypes;
  $dataSystem.skillTypes = file.skillTypes;

  // assign actors
  each2(file.actors, function (actor, index) {
    assign($dataActors[index], actorFromTransform(actor))
  });
  // assign armors
  each2(file.armors, function (armor, index) {
    assign($dataArmors[index], itemFromTransform(armor))
  });
  // assign classes
  each2(file.classes, function (cls, index) {
    $dataClasses[index].name = cls;
  });
  // assign enemies
  each2(file.enemies, function (enemy, index) {
    $dataEnemies[index].battlerName = enemy;
  });
  // assign items
  each2(file.items, function (item, index) {
    assign($dataItems[index], itemFromTransform(item))
  });
  // assign skills
  each2(file.skills, function (skill, index) {
    assign($dataSkills[index], skillFromTransform(skill))
  });
  // assign states
  each2(file.states, function (state, index) {
    assign($dataStates[index], stateFromTransform(state))
  });
  // assign troops
  each2(file.troops, function (troop, index) {
    troop = troopFromTransform(troop);
    const source = $dataTroops[index];
    source.name = troop.name;
    assignCommandToEvent(troop.messages, $dataTroops);
  });
  // assign weapons
  each2(file.weapons, function (weapon, index) {
    assign($dataWeapons[index], itemFromTransform(weapon))
  });

  // assign language commands
  assignCommandToEvent(file.commonEvents.messages, [
    <MapEvent>{
      id: 0,
      name: "",
      pages: $dataCommonEvents as any
    }
  ])

  // assign custom values
  set2($this, customsKey, file.custom)
  set2($this, imagesKey, file.images)
  set2($this, mapsKey, file.maps);
}

export function changeIndex(total: number, index: number): number {
  index = (string(index).toInt() || 0);

  if (index >= total)
    index = 0;
  else if (index < 0)
    index = total - 1;

  return index;
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
  // set the methods
  handler = <PluginHandler>{
    setup() {
      loadLanguageFiles();
    },
    load: function (index) {
      const $this = this,
        {languages} = parameters,
        total = languages.length,
        target = changeIndex(total, index),
        language = languages[target];

      if (target === $this.index)
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
      if (!parameters.enableCustom || this.language.equals(DefaultLanguage))
        return name;

      return get(
        get2(this, customsKey),
        key,
        name
      ) || name;
    },
    getImage(folder, filename) {
      const $this = this,
        images = get2($this, imagesKey) as KeyableObject;

      if (!parameters.enableImages || !isDefined(images))
        return filename;

      const folderpath = new Filepath(folder),
        filepath = new Filepath(filename),
        parts = folderpath.parts.concat(filepath.parts);

      return get.apply(
        null,
        concat(
          [images],
          parts
        ) as any
      ) || parts.last();
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
// set the getters
getters(handler, {
  name: partialMethod(getprop, nameKey),
  label: partialMethod(getprop, labelKey),
  code: partialMethod(getprop, codeKey),
  language: partialMethod(getprop, languageKey),
  index: partialMethod(getprop, indexKey),
})


export {handler}
