import {assign} from "./shortcuts/properties";
import {join} from "@crossimages-plugin/shortcuts/env/path";
import {getIf, isObject, returns} from "@crossimages-plugin/shortcuts/validations";
import {bool} from "@crossimages-plugin/shortcuts/parameters";
import {isArray} from "@jstls/core/shortcuts/array";
import {KeyableObject} from "@jstls/types/core/objects";
import {freeze} from "@jstls/core/shortcuts/object";

/**
 * Image source generation mode.
 * - "auto": Automatically generate if file doesn't exist.
 * - "always": Always generate the file.
 * - "none": Never generate the file.
 */
export type GenerateSourceMode = "auto" | "always" | "none";

/**
 * Configuration parameters for the CrossImages plugin.
 */
export interface Parameters {
  /** Name of the JSON file containing image sources. */
  filename: string;
  /** Path to the folder where the JSON file is stored. */
  folder: string;
  /** If true, scans every folder under img/. */
  allSourceFolders: boolean;
  /** Source folders to search for images. */
  sourceFolders: string[];
  /** Mode for generating the source file. */
  generationMode: GenerateSourceMode;
  /** Mode for loading image sources. */
  loadMode: "flatten" | "raw";
}

/**
 * Plugin name used to retrieve configuration parameters from RPG Maker.
 */
export const PluginName = "YDP_CrossImages",

  /**
   * Default configuration parameters for the CrossImages plugin.
   * These can be overridden by the user in the plugin editor.
   */
  parameters: Parameters = {
    /** Scan every folder under img/ when enabled. */
    allSourceFolders: false,
    /** Default source folders to search for images. */
    sourceFolders: [
      "system", "pictures",
      "titles1", "titles2"
    ],
    /** Default generation mode. */
    generationMode: "auto",

    /** Default filename for the JSON file. */
    filename: "images",
    /** Default folder path for the JSON file. */
    folder: join("data", "crossimages",),
    /** Default load mode for image sources. */
    loadMode: "flatten",
  } as Parameters;

/*
* Parse the plugin parameters from RPG Maker's PluginManager.
*
* @param parameters - The raw parameters object retrieved from PluginManager.
* @returns A structured Parameters object with the appropriate types and defaults applied.
* */
export function parseParameters(parameters: KeyableObject): Parameters {
  if (!isObject(parameters))
    return assign({}, parameters) as Parameters;


  let result: Parameters = {} as Parameters;
  assign(result, parameters as Parameters);


  try {
    result.sourceFolders = getIf(JSON.parse(result.sourceFolders as any), isArray, returns([]));
  } catch (e) {
    console.error(e);
  }

  result.allSourceFolders = bool(result.allSourceFolders as any);

  return result;
}

/**
 * Configures the plugin parameters by extracting them from RPG Maker's PluginManager.
 * Reads the parameters defined in the plugin file and applies them to the global configuration.
 */
export function setupParameters() {
  const params = parseParameters(PluginManager.parameters(PluginName));

  assign(parameters, params);

  freeze(parameters);
}
