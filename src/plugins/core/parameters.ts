import {assign2} from "@jstls/core/objects/factory";

/**
 * The plugin parameters.
 *
 * Defines the configuration options available for the plugin.
 * These parameters control various aspects of the plugin's behavior.
 */
export interface Parameters {

}

/**
 * The unique name of the plugin.
 */
export const PluginName = "YDP_Core",
  /**
   * The active parameters for the plugin.
   */
  parameters: Parameters = {} as Parameters;


/** Set up the plugin parameters
 * */
export function setupParameters() {
  const params = PluginManager.parameters(PluginName) || {} as Parameters;

  assign2(parameters, params);
}
