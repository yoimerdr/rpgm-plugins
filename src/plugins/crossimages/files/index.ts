import {Filepath, join} from "@crossimages-plugin/shortcuts/env/path";
import {parameters} from "@crossimages-plugin/parameters";
import {fs} from "@crossimages-plugin/shortcuts/env/fm";
import {FileManager} from "@core-plugin/modules/env/fs";
import {each} from "@crossimages-plugin/shortcuts/iterables";
import {concat, setobj} from "@crossimages-plugin/shortcuts/mappers";
import {indefinite} from "@jstls/core/utils/types";
import {KeyableObject} from "@jstls/types/core/objects";
import {list} from "@crossimages-plugin/shortcuts/images";

/**
 * Creates the directory for storing image source JSON files.
 * Uses the folder path from plugin parameters.
 * @returns {void}
 */
export function generateImagesSourceFolder() {
  (new Filepath(join(parameters.folder)))
    .mkdir({recursive: true, existsOk: true}, fs());
}

/**
 * Loads image sources from the configured source folders.
 * Scans each folder defined in parameters.sourceFolders and builds a mapping
 * of image filenames to their source paths.
 * @param {FileManager} manager - The file manager instance for reading directories.
 * @returns {KeyableObject} A mapping of image filenames to their source paths.
 */
export function loadImagesSource(manager: FileManager) {
  const result: KeyableObject = {},
    files = parameters.allSourceFolders
      ? list("img", manager)
      : (() => {
        const result: string[] = [];

        each(parameters.sourceFolders, (folder) => {
          each(list(join("img", folder), manager), (filepath) => {
            result.push(filepath);
          });
        });

        return result;
      })();

  each(files, (filepath) => {
    const path = new Filepath(filepath.toLowerCase()),
      parent = path.parent,
      parts = parent ? parent.parts : [],
      sourcePath = new Filepath(filepath),
      sourcePrefix = sourcePath.prefix,
      sourceTarget = sourcePath.parent ? sourcePath.parent.join(sourcePrefix).toString() : sourcePrefix;

    setobj.apply(indefinite, concat([result] as any, parts, [path.prefix, sourceTarget]));
  });

  return result;
}

/**
 * Generates the image sources JSON file if needed.
 * Checks the generation mode and creates the JSON file containing image path mappings.
 * Only runs in NW.js environment with test mode enabled and when generation is allowed.
 * @returns {void}
 */
export function generateImagesSource() {
  if (!Utils.isNwjs() || !Utils.isOptionValid("test") || parameters.generationMode === "none")
    return;

  const manager = fs(),
    filename = join(parameters.folder, parameters.filename + ".json"),
    mode = parameters.generationMode;


  if (!(mode === "always" || (mode === "auto" && !manager.existsSync(filename))))
    return;

  const source = loadImagesSource(manager);

  manager.writeFileSync(filename, JSON.stringify(source));

}
