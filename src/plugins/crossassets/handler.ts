import {uid, writeable} from "@crossassets-plugin/shortcuts/properties";
import {concat, get, get2, set, set2, string} from "@crossassets-plugin/shortcuts/mappers";
import {fetchJson} from "@crossassets-plugin/shortcuts/requests";
import {Filepath, join} from "@crossassets-plugin/shortcuts/env/path";
import {parameters} from "@crossassets-plugin/parameters";
import {KeyableObject} from "@jstls/types/core/objects";
import {keach} from "@crossassets-plugin/shortcuts/iterables";
import {isObject, isString} from "@crossassets-plugin/shortcuts/validations";
import {isArray} from "@jstls/core/shortcuts/array";
import {indefinite} from "@jstls/core/utils/types";
import {Maybe} from "@jstls/types/core";
import {hasOwn} from "@jstls/core/polyfills/objects/es2022";
import {files} from "@crossassets-plugin/shortcuts/files";


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
 * Flattens a nested object into a flat object with concatenated keys.
 * Converts nested objects into path-style keys joined by prefix.
 * @param {KeyableObject} obj - Source object with nested properties.
 * @param {string} prefix - Prefix for resulting keys.
 * @param {KeyableObject} result - Result object with flattened properties.
 * @returns {KeyableObject} The flattened object.
 */
export function flatobj(obj: KeyableObject, prefix: string, result: KeyableObject) {
  keach(obj, (value, key) => {
    const newKey = prefix ? join(prefix, string(key)) : string(key);
    if (isObject(value) && !isArray(value)) {
      flatobj(value, newKey, result);
    } else set2(result, newKey, value);
  });
  return result;
}

/**
 * Resolves tokenized paths in the source object using the $t dictionary.
 * @param {KeyableObject} obj - The object containing tokenized values.
 * @param {KeyableObject} tokens - The dictionary of tokens.
 */
function resolveTokens(obj: KeyableObject, tokens: KeyableObject) {
  keach(obj, (value: string | KeyableObject, key) => {
    if (key === "$t") return;

    if (isObject(value) && !isArray(value)) {
      resolveTokens(value as KeyableObject, tokens);
    } else if (isString(value)) {
      const separatorIndex = value.indexOf(":");
      if (separatorIndex !== -1) {
        const tokenId = value.substring(0, separatorIndex);
        if (hasOwn(tokens, tokenId)) {
          const prefix = value.substring(separatorIndex + 1);
          set2(obj, key, join(tokens[tokenId], prefix));
        }
      }
    }
  });
}

/**
 * Updates the internal storage of asset sources.
 * Flattens the source object if load mode is set to "flatten",
 * or leaves it unmodified if in "raw" mode.
 * @param {KeyableObject} source - Object with asset sources loaded from JSON.
 * @returns {void}
 */
export function update(source: KeyableObject) {
  if (source.$t && isObject(source.$t)) {
    resolveTokens(source, source.$t);
    delete source.$t;
  }

  const result = parameters.loadMode == "raw" ?
    source : flatobj(
      source, "", {}
    );

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
  source = source.toLowerCase();
  if (parameters.loadMode === "raw") {
    const path = new Filepath(source);
    source = get.apply(indefinite, concat([get2($this, assetsKey)], path.parts) as any);
  }
  source = get($this, assetsKey, source);

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
