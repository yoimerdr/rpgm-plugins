import {assign} from "./shortcuts/properties";
import {join} from "@crossassets-plugin/shortcuts/env/path";
import {getIf, isObject, returns} from "@crossassets-plugin/shortcuts/validations";
import {bool} from "@crossassets-plugin/shortcuts/parameters";
import {isArray} from "@jstls/core/shortcuts/array";
import {KeyableObject} from "@jstls/types/core/objects";
import {freeze} from "@jstls/core/shortcuts/object";
import {each} from "@crossassets-plugin/shortcuts/iterables";
import {Keys} from "@jstls/types/core";
import {set2} from "@crossassets-plugin/shortcuts/mappers";

/**
 * Asset source generation mode.
 * - "auto": Automatically generate if file doesn't exist.
 * - "always": Always generate the file.
 * - "none": Never generate the file.
 */
export type GenerateSourceMode = "auto" | "always" | "none";

/**
 * Configuration parameters for the CrossAssets plugin.
 */
export interface Parameters {
  /** Name of the JSON file containing asset sources. */
  filename: string;
  /** Path to the folder where the JSON file is stored. */
  folder: string;
  /** If true, scans every folder under img/. */
  allImageFolders: boolean;
  /** Source folders to search for images. */
  imageFolders: string[];
  /** If true, scans every folder under audio/. */
  allAudioFolders: boolean;
  /** Source folders to search for audios. */
  audioFolders: string[];
  /** Mode for generating the source file. */
  generationMode: GenerateSourceMode;
}

/**
 * Plugin name used to retrieve configuration parameters from RPG Maker.
 */
export const PluginName = "YDP_CrossAssets",

  /**
   * Default configuration parameters for the CrossAssets plugin.
   * These can be overridden by the user in the plugin editor.
   */
  parameters: Parameters = {
    /** Scan every folder under img/ when enabled. */
    allImageFolders: true,
    /** Default source folders to search for images. */
    imageFolders: [],
    /** Scan every folder under audio/ when enabled. */
    allAudioFolders: true,
    /** Default source folders to search for audios. */
    audioFolders: [],
    /** Default generation mode. */
    generationMode: "auto",

    /** Default filename for the JSON file. */
    filename: "assets",
    /** Default folder path for the JSON file. */
    folder: join("data", "crossassets",),
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
    result.imageFolders = getIf(JSON.parse(result.imageFolders as any), isArray, returns([]));
  } catch (e) {
    console.error(e);
  }

  try {
    result.audioFolders = getIf(JSON.parse(result.audioFolders as any), isArray, returns([]));
  } catch (e) {
    console.error(e);
  }

  each(
    [
      "allImageFolders",
      "allAudioFolders",
    ] as Keys<Parameters>[],
    function (key) {
      set2(result, key, bool(result[key] as any));
    }
  )

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
