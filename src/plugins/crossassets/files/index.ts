import {Filepath, join} from "@crossassets-plugin/shortcuts/env/path";
import {parameters} from "@crossassets-plugin/parameters";
import {fs} from "@crossassets-plugin/shortcuts/env/fm";
import {FileManager} from "@core-plugin/modules/env/fs";
import {each} from "@crossassets-plugin/shortcuts/iterables";
import {concat, setobj} from "@crossassets-plugin/shortcuts/mappers";
import {indefinite} from "@jstls/core/utils/types";
import {KeyableObject} from "@jstls/types/core/objects";
import {files} from "@crossassets-plugin/shortcuts/files";
import {hasOwn} from "@jstls/core/polyfills/objects/es2022";

/**
 * Creates the directory for storing assets source JSON files.
 * Uses the folder path from plugin parameters.
 * @returns {void}
 */
export function generateAssetsSourceFolder() {
  (new Filepath(join(parameters.folder)))
    .mkdir({recursive: true, existsOk: true}, fs());
}

function loadAssets(
  fs: FileManager,
  manager: { list(folder: string, manager?: FileManager): string[] },
  all: boolean,
  base: "img" | "audio",
  folders: string[]
): string[] {
  let files: string[] = []
  if (all) {
    files = manager.list(base, fs);
  } else {
    each(folders, (folder) => {
      files = files.concat(manager.list(join(base, folder)));
    });
  }

  return files;
}

/**
 * Loads assets sources from the configured source folders.
 * Scans each folder defined in parameters and builds a mapping
 * of asset filenames to their source paths, utilizing a tokenized path dictionary.
 * @param {FileManager} manager - The file manager instance for reading directories.
 * @returns {KeyableObject} A mapping of asset filenames to their source paths.
 */
export function loadAssetsSource(manager: FileManager) {
  const result: KeyableObject = {
    $t: {}
  };

  const tokenMap: { [key: string]: string } = {};
  let tokenIdCounter = 0;

  const images = loadAssets(
      manager,
      files.images,
      parameters.allImageFolders,
      "img",
      parameters.imageFolders
    ),
    audios = loadAssets(
      manager,
      files.audios,
      parameters.allAudioFolders,
      "audio",
      parameters.audioFolders
    );

  each(concat(images, audios), (filepath) => {
    const path = new Filepath(filepath.toLowerCase()),
      parent = path.parent,
      parts = parent ? parent.parts : [],
      sourcePath = new Filepath(filepath),
      sourcePrefix = sourcePath.prefix;

    let sourceTarget: string;

    if (sourcePath.parent) {
      const folder = sourcePath.parent.toString();

      if (!hasOwn(tokenMap, folder)) {
        const tokenId = tokenIdCounter.toString(36);
        tokenMap[folder] = tokenId;
        result.$t[tokenId] = folder;
        tokenIdCounter++;
      }

      sourceTarget = tokenMap[folder] + ":" + sourcePrefix;
    } else {
      sourceTarget = sourcePrefix;
    }

    setobj.apply(indefinite, concat([result] as any, parts, [path.prefix, sourceTarget]));
  });

  return result;
}

/**
 * Generates the assets sources JSON file if needed.
 * Checks the generation mode and creates the JSON file containing path mappings.
 * Only runs in NW.js environment with test mode enabled and when generation is allowed.
 * @returns {void}
 */
export function generateAssetsSource() {
  if (!Utils.isNwjs() || !Utils.isOptionValid("test") || parameters.generationMode === "none")
    return;

  const manager = fs(),
    filename = join(parameters.folder, parameters.filename + ".json"),
    mode = parameters.generationMode;


  if (!(mode === "always" || (mode === "auto" && !manager.existsSync(filename))))
    return;

  const source = loadAssetsSource(manager);

  manager.writeFileSync(filename, JSON.stringify(source));
}