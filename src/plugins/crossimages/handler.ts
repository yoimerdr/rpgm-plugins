import {uid, writeable} from "@crossimages-plugin/shortcuts/properties";
import {concat, get, get2, set, set2, string} from "@crossimages-plugin/shortcuts/mappers";
import {fetchJson} from "@crossimages-plugin/shortcuts/requests";
import {Filepath, join} from "@crossimages-plugin/shortcuts/env/path";
import {parameters} from "@crossimages-plugin/parameters";
import {KeyableObject} from "@jstls/types/core/objects";
import {keach} from "@crossimages-plugin/shortcuts/iterables";
import {isObject, isString} from "@crossimages-plugin/shortcuts/validations";
import {isArray} from "@jstls/core/shortcuts/array";
import {indefinite} from "@jstls/core/utils/types";

/**
 * Public interface for the CrossImages plugin handler.
 * Provides methods to configure and retrieve image sources.
 */
export interface PluginHandler {
  /**
   * Initializes the handler, loads image sources, and marks as configured.
   * @method setup
   * @returns {void}
   */
  setup(): void;

  /**
   * Loads image sources from the JSON file.
   * @method load
   * @returns {void}
   */
  load(): void;

  /**
   * Gets the original image path based on folder and filename.
   * @method getImage
   * @param {string} folder - Image folder (e.g., "img/pictures").
   * @param {string} filename - Image filename.
   * @returns {string} Original filename or remapped path.
   */
  getImage(folder: string, filename: string): string;
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
 * Updates the internal storage of image sources.
 * Flattens the source object if load mode is set to "flatten",
 * or leaves it unmodified if in "raw" mode.
 * @param {KeyableObject} source - Object with image sources loaded from JSON.
 * @returns {void}
 */
export function update(source: KeyableObject) {
  const result = parameters.loadMode == "raw" ?
    source : flatobj(
      source, "", {}
    );

  set(handler, imagesKey, result);
}


/**
 * Loads image sources from the configured JSON file.
 * Makes an HTTP request to get the configuration file
 * and updates the handler with the loaded sources.
 * @returns {Promise<void>} Promise that resolves when sources are loaded.
 */
export function loadImagesSources() {
  return fetchJson(join(string(parameters.folder,), string(parameters.filename) + ".json"))
    .then(update)
    .catch(console.error);
}


const imagesKey = uid("m"),
  setupKey = uid("m"),
  handler = <PluginHandler>{
    setup() {
      const $this = this;
      $this.load();
      set($this, setupKey, true);
    },
    load() {
      loadImagesSources();
    },
    getImage(folder, filename) {
      const $this = this,
        filepath = join(string(folder), string(filename)),
        source = string(filepath)
          .toLowerCase();

      if (!get2($this, setupKey))
        return filename;

      let result = filepath;
      if (parameters.loadMode === "raw") {
        const path = new Filepath(filepath);
        result = get.apply(
          indefinite,
          concat(
            [get2($this, imagesKey)],
            path.parts
          ) as any
        );
      } else {
        result = get(
          $this,
          imagesKey,
          source,
        );
      }

      if (isString(result)) {
        const path = new Filepath(result);

        return path.prefix;
      }

      return filename;
    }
  };


writeable(handler, imagesKey, {});

export {handler};
