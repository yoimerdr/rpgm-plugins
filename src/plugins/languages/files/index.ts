import {parameters} from "@languages-plugin/parameters";
import {Filepath} from "@languages-plugin/shortcuts/env/path";
import {FileManager} from "@core-plugin/modules/env/fs";
import {fs} from "@languages-plugin/shortcuts/env/fm";
import {
  DefaultLanguage,
  jsonFilename,
  LanguageOption,
} from "@languages-plugin/models/language-option";
import {createCustomTexts, createLanguageSource} from "@languages-plugin/mappers/source";
import {each} from "@languages-plugin/shortcuts/iterables";
import {isNumber} from "@languages-plugin/shortcuts/validations";
import {indefinite} from "@jstls/core/utils/types";
import {loadMapCommands, loadMapFile} from "@languages-plugin/files/map";
import {mapToTransform} from "@languages-plugin/mappers/map";
import {concat, set2, setobj} from "@languages-plugin/shortcuts/mappers";
import {list} from "@languages-plugin/shortcuts/images";
import {LanguageSource, MapSource} from "@languages-plugin/models/source";
import {extractFromSuffix, suffixTo} from "@languages-plugin/models/helpers";
import {keys} from "@jstls/core/objects/handlers/properties";
import {getKeys} from "@languages-plugin/shortcuts/properties";

/**
 * Creates the languages folder in the project directory if it doesn't exist.
 * This folder will contain all generated language JSON files.
 */
export function generateLanguagesFolder() {
  (new Filepath(parameters.folder))
    .mkdir({recursive: true, existsOk: true}, fs());
}

/**
 * Loads all map data files from the data folder and extracts their text commands.
 * Scans for Map001.json, Map002.json, etc. and extracts Show Text commands from events.
 * @param manager - The FileManager instance for reading files
 * @param source - The LanguageSource object to populate with map data
 * @returns The populated LanguageSource with map translations
 */
function loadDataFiles(manager: FileManager, source: LanguageSource): LanguageSource {
  each(
    manager.readdirSync("data"),
    function (value,) {
      if (
        !value.endsWith(".json") ||
        !value.startsWith("Map") ||
        value.startsWith("MapInfo")
      )
        return;

      const id = value.substring(3, 6)
        .toInt();

      if (!isNumber(id))
        return indefinite;

      const file = loadMapFile(value, manager);
      if (!file)
        return;

      let commands = loadMapCommands(file);
      if (getKeys(commands).isEmpty())
        return;

      set2(file, 'messages', commands)
      source.maps[id!] = mapToTransform(file as MapSource)
    }
  )

  return source;
}

/**
 * Processes and indexes image files for language-specific localization.
 * Filters images based on imageMode and extracts language information from filenames.
 * @param source - The LanguageSource object to populate with image mappings
 * @param language - The language option being processed
 * @param images - Array of all image file paths in the project
 */
function loadLanguageImages(source: LanguageSource, language: LanguageOption, images: string[],) {
  const langImages = parameters.imageMode === "all" ? images :
    images.filter(value => {
      const filepath = new Filepath(value),
        prefix = filepath.prefix,
        result = extractFromSuffix(prefix);

      return keys(result).length > 0;
    });

  if (langImages.isNotEmpty()) {
    source.images = {};

    each(langImages, function (image) {
      const filepath = new Filepath(image),
        name = filepath.prefix,
        parent = filepath.parent,
        parts = parent ? parent.parts : [],
        patterns = extractFromSuffix(name);

      setobj.apply(
        undefined, <any>concat
        ([source.images],
          parts,
          [patterns.filename || name.replace(suffixTo(language, ""), ""), name]
        ));
    })
  }
}

/**
 * Generates language JSON files for all configured languages.
 * This function is called during development to extract translatable content.
 * It only runs in desktop environments (NW.js) with the "test" option enabled.
 * The generation mode (auto/always/none) controls when files are regenerated.
 */
export function generateLanguageFiles() {
  if (!Utils.isNwjs() || !Utils.isOptionValid("test") || parameters.generationMode === "none")
    return;

  const manager = fs(),
    images: string[] = [],
    filename = jsonFilename(DefaultLanguage, parameters.folder);

  if (!(parameters.generationMode === "always" || (parameters.generationMode === "auto" && !manager.existsSync(filename))))
    return;

  const source = loadDataFiles(manager, createLanguageSource());

  if (parameters.enableImages)
    images.extends(list("img", manager)) // load the project images

  if (parameters.enableCustom && parameters.customTarget == "all")
    source.custom = createCustomTexts()!;

  manager.writeFileSync(filename, JSON.stringify(source));

  if (parameters.enableCustom && parameters.customTarget != "all")
    source.custom = createCustomTexts()!;

  each(
    parameters.languages,
    function (language) {
      const filename = jsonFilename(language, parameters.folder);
      if (language.equals(DefaultLanguage))
        return;

      loadLanguageImages(source, language, images)

      manager.writeFileSync(filename, JSON.stringify(source));
    }
  )
}
