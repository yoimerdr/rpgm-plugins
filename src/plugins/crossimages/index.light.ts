import {applyLitePlugin} from "./boot";
import {KeyableObject} from "@jstls/types/core/objects";

declare const exports: KeyableObject;

/**
 * Applies the lite CrossImages plugin configuration.
 * Initializes the plugin with minimal functionality without image source generation.
 * @returns {void}
 */
applyLitePlugin();

export {
}
