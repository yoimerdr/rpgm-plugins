import {assign} from "./shortcuts/properties";
import {join} from "@crossimages-plugin/shortcuts/env/path";
import {getIf, returns} from "@crossimages-plugin/shortcuts/validations";
import {isArray} from "@jstls/core/shortcuts/array";

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

/**
 * Configures the plugin parameters by extracting them from RPG Maker's PluginManager.
 * Reads the parameters defined in the plugin file and applies them to the global configuration.
 */
export function setupParameters() {
  const params = PluginManager.parameters(PluginName) as any as Parameters;
  if (!params)
    return

  try {
    params.sourceFolders = getIf(JSON.parse(params.sourceFolders as any), isArray, returns([]));
  } catch (e) {
    console.error(e);
  }

  assign(parameters, params);
}
