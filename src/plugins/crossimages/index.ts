import {KeyableObject} from "@jstls/types/core/objects";
import {applyFullPlugin} from "@crossimages-plugin/boot";

declare const exports: KeyableObject;

/**
 * Applies the full CrossImages plugin configuration.
 * Initializes the plugin with full functionality including image source generation.
 * @returns {void}
 */
applyFullPlugin();

/**
 * Public interface for the CrossImages plugin.
 * Provides access to plugin functionality and configuration.
 */
export interface YDPCrossImages {
}

export {
}
