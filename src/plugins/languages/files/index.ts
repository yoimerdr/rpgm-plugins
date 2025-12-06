import {parameters} from "@languages-plugin/parameters";
import {Filepath} from "@languages-plugin/shortcuts/env/path";
import {FileManager} from "@core-plugin/modules/env/fs";
import {fs} from "@languages-plugin/shortcuts/env/fm";
import {
  DefaultLanguage,
  imageExtensions,
  jsonFilename,
  LanguageOption,
  suffixTo
} from "@languages-plugin/models/language-option";
import {createLanguageSource} from "@languages-plugin/mappers/source";
import {each} from "@languages-plugin/shortcuts/iterables";
import {isNumber, isObject} from "@languages-plugin/shortcuts/validations";
import {indefinite} from "@jstls/core/utils/types";
import {loadMapCommands, loadMapFile} from "@languages-plugin/files/map";
import {mapToTransform} from "@languages-plugin/mappers/map";
import {append} from "@languages-plugin/shortcuts/env/logger";
import {concat, set2, setobj, string} from "@languages-plugin/shortcuts/mappers";
import {list} from "@languages-plugin/shortcuts/images";
import {LanguageSource, MapSource} from "@languages-plugin/models/source";

export function generateLanguagesFolder() {
  (new Filepath(parameters.folder))
    .mkdir({recursive: true, existsOk: true}, fs());
}

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
      set2(file, 'messages', loadMapCommands(file))
      source.maps[id!] = mapToTransform(file as MapSource)
    }
  )

  return source;
}

function loadLanguageImages(source: LanguageSource, language: LanguageOption, images: string[],) {
  const ext = imageExtensions(language),
    langImages = parameters.imageMode === "all" ? images :
      images.filter(value => ext.some(it => value.endsWith(it)));

  if (langImages.isNotEmpty()) {
    source.images = {};

    each(langImages, function (image) {
      const filepath = new Filepath(image),
        name = filepath.prefix,
        parent = filepath.parent,
        parts = parent ? parent.parts : [];

      setobj.apply(
        undefined, <any>concat
        ([source.images],
          parts,
          [name.replace(suffixTo(language), ""), name]
        ));
    })
  }
}

function loadLanguageCustom(source: LanguageSource, filename: string, manager: FileManager) {
  let file: LanguageSource = <LanguageSource>{};

  try {
    file = JSON.parse(manager.readFileSync(filename));
  } catch (e) {
    append(string(e))
    return;
  }

  if (file && isObject(file.custom))
    source.custom = file.custom;
}

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

  manager.writeFileSync(filename, JSON.stringify(source));

  each(
    parameters.languages,
    function (language) {
      const filename = jsonFilename(language, parameters.folder);
      if (language.equals(DefaultLanguage))
        return;

      loadLanguageCustom(source, filename, manager)
      loadLanguageImages(source, language, images)

      manager.writeFileSync(filename, JSON.stringify(source));
    }
  )
}
