import {uid, writeable} from "@crossassets-plugin/shortcuts/properties";
import {get, get2, set, string} from "@crossassets-plugin/shortcuts/mappers";
import {fetchJson} from "@crossassets-plugin/shortcuts/requests";
import {Filepath, join} from "@crossassets-plugin/shortcuts/env/path";
import {parameters} from "@crossassets-plugin/parameters";
import {KeyableObject} from "@jstls/types/core/objects";
import {each} from "@crossassets-plugin/shortcuts/iterables";
import {isString} from "@crossassets-plugin/shortcuts/validations";
import {Maybe} from "@jstls/types/core";
import {files} from "@crossassets-plugin/shortcuts/files";
import {create} from "@jstls/core/shortcuts/object";


export interface AssetResolution {
  path: string;
  resolved: boolean;
}

/**
 * Public interface for the CrossAssets plugin handler.
 * Provides methods to configure and retrieve asset sources.
 */
export interface PluginHandler {
  /**
   * Initializes the handler, loads image sources, and marks as configured.
   * @method setup
   * @returns {void}
   */
  setup(): void;

  /**
   * Loads asset sources from the JSON file.
   * @method load
   * @returns {void}
   */
  load(): void;

  /**
   * Gets the original asset path based on the full filepath.
   * @method getAsset
   * @param {string} filepath - The full filepath.
   * @returns {AssetResolution} Resolution object containing the remapped path and whether it was found.
   */
  getAsset(filepath: string): AssetResolution;

  /**
   * Gets the original asset path based on folder and filename.
   * @method getAsset
   * @param {string} folder - Asset folder (e.g., "img/pictures" or "audio/bgm").
   * @param {string} filename - Asset filename.
   * @returns {AssetResolution} Resolution object containing the remapped path and whether it was found.
   */
  getAsset(folder: string, filename: string): AssetResolution;
}


/**
 * Updates the internal storage of asset sources.
 *
 * @param source - Object with asset sources loaded from JSON.
 */
export function update(source: KeyableObject) {
  const dirs = source.$d || [],
    filesGroups = source.$f || [];

  const result = create(null);
  each(filesGroups, (group: Array<any>) => {
    const index = group[0],
      names = group[1],
      folder = dirs[index] || "",
      lowerFolder = folder.toLowerCase(),
      files = create(null) as KeyableObject;

    files[":d"] = folder;

    each(names, (name: string) => {
      files[name.toLowerCase()] = name
    });

    result[lowerFolder] = files;
  })


  set(handler, assetsKey, result);
}


/**
 * Loads asset sources from the configured JSON file.
 * Makes an HTTP request to get the configuration file
 * and updates the handler with the loaded sources.
 * @returns {Promise<void>} Promise that resolves when sources are loaded.
 */
export function loadAssetsSources() {
  return fetchJson(join(string(parameters.folder,), string(parameters.filename) + ".json"))
    .then(update)
    .catch(console.error);
}


function resolveSource($this: PluginHandler, source: string): Maybe<AssetResolution> {
  const filepath = new Filepath(source),
    parent = filepath.parent,
    folder = parent ? string(parent).toLowerCase() : "",
    filename = filepath.prefix.toLowerCase(),
    files = get($this, assetsKey, folder);

  if (files) {
    source = files[filename];
    if (source) {
      source = files[":d"] ? files[":d"] + "/" + source : source;
    } else source = null!;
  } else source = null!;


  if (isString(source)) {
    return {path: source, resolved: true};
  }
  return null;
}


const assetsKey = uid("m"),
  allExtensions = files.images.extensions
    .concat(files.audios.extensions),
  setupKey = uid("m"),
  handler = <PluginHandler>{
    setup() {
      const $this = this;
      $this.load();
      set($this, setupKey, true);
    },
    load() {
      loadAssetsSources();
    },
    getAsset(folder: string, filename?: string): AssetResolution {
      const $this = this,
        isPath = arguments.length === 1,
        folderStr = string(folder),
        nameStr = isPath ? "" : string(filename),
        inputPath = isPath ? folderStr : join(folderStr, nameStr);

      if (!get2($this, setupKey))
        return {path: inputPath, resolved: false};

      const extMatch = allExtensions.find(ext => inputPath.toLowerCase().endsWith(ext)),
        cleanPath = extMatch ? inputPath.slice(0, -extMatch.length) : inputPath;

      let resolved = resolveSource($this, cleanPath);

      if (resolved) {
        resolved.path += extMatch || "";
        return resolved;
      }

      let decodedPath = cleanPath;
      try {
        decodedPath = decodeURIComponent(cleanPath);
      } catch (e) {
      }

      if (decodedPath !== cleanPath) {
        resolved = resolveSource($this, decodedPath);
        if (resolved) {
          resolved.path = (encodeURIComponent(resolved.path)
            .replace(/%2F/g, "/")) + (extMatch || "");

          return resolved;
        }
      }

      return {path: isPath ? inputPath : string(filename), resolved: false};
    }
  };


writeable(handler, assetsKey, {});

export {handler};
