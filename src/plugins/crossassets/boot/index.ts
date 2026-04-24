// Boot logic will go here
import {PluginName, setupParameters} from "@crossassets-plugin/parameters";
import {setpath} from "@crossassets-plugin/shortcuts/env/logger";
import {join} from "@crossassets-plugin/shortcuts/env/path";
import {applyFullBoot, applyLiteBoot} from "@crossassets-plugin/boot/scene";
import {applyAssets} from "@crossassets-plugin/boot/assets";
import {isObject} from "@crossassets-plugin/shortcuts/validations";
import YDP_Core from "@core-plugin/types";
import {IllegalAccessError} from "@crossassets-plugin/shortcuts/exceptions";

/**
 * Applies the base plugin configuration.
 * Sets up logging, loads plugin parameters, and applies image handling.
 * @function
 * @returns {void}
 */
export function applyBasePlugin() {
  setpath(join("log", PluginName, "crossassets.log"));
  if (!isObject(YDP_Core.files))
    throw new IllegalAccessError("YDP_Core.files is not accessible. Ensure the version of YDP_Core is the lastest.");

  setupParameters();

  applyAssets();
}

/**
 * Applies the full plugin configuration including generation features.
 * Extends Scene_Boot to generate asset sources on startup.
 * @function
 * @returns {void}
 */
export function applyFullPlugin() {
  applyBasePlugin();

  applyFullBoot();
}

/**
 * Applies the lite plugin configuration without generation features.
 * Extends Scene_Boot for basic asset handling only.
 * @function
 * @returns {void}
 */
export function applyLitePlugin() {
  applyBasePlugin();

  applyLiteBoot();
}
