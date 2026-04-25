import {KeyableObject} from "@jstls/types/core/objects";
import {applyFullPlugin} from "@crossassets-plugin/boot";
import {handler, PluginHandler} from "./handler";

declare const exports: KeyableObject;

/**
 * Applies the full CrossAssets plugin configuration.
 * Initializes the plugin with full functionality including asset source generation.
 * @returns {void}
 */
applyFullPlugin();

/**
 * Public interface for the CrossAssets plugin.
 * Provides access to plugin functionality and configuration.
 */
export interface YDPCrossAssets {
  /**
   * The plugin handler instance that provides methods to configure and retrieve asset sources.
   * */
  handler: PluginHandler;
}

export {
  handler
}
