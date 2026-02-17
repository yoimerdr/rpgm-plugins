// Boot logic will go here
import {PluginName, setupParameters} from "@crossimages-plugin/parameters";
import {setpath} from "@crossimages-plugin/shortcuts/env/logger";
import {join} from "@crossimages-plugin/shortcuts/env/path";
import {applyFullBoot, applyLiteBoot} from "@crossimages-plugin/boot/scene";
import {applyImages} from "@crossimages-plugin/boot/images";

/**
 * Applies the base plugin configuration.
 * Sets up logging, loads plugin parameters, and applies image handling.
 * @function
 * @returns {void}
 */
export function applyBasePlugin() {
  setpath(join("log", PluginName, "crossimages.log"));

  setupParameters();

  applyImages();
}

/**
 * Applies the full plugin configuration including generation features.
 * Extends Scene_Boot to generate image sources on startup.
 * @function
 * @returns {void}
 */
export function applyFullPlugin() {
  applyBasePlugin();

  applyFullBoot();
}

/**
 * Applies the lite plugin configuration without generation features.
 * Extends Scene_Boot for basic image handling only.
 * @function
 * @returns {void}
 */
export function applyLitePlugin() {
  applyBasePlugin();

  applyLiteBoot();
}
