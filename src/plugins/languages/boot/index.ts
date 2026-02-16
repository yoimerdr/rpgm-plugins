import {PluginName, setupParameters} from "@languages-plugin/parameters";
import {setpath} from "@languages-plugin/shortcuts/env/logger";
import {join} from "@languages-plugin/shortcuts/env/path";
import {applyConfig} from "@languages-plugin/boot/config";
import {applyOptions} from "@languages-plugin/boot/options";
import {applyImages} from "@languages-plugin/boot/images";
import {applyWindow} from "@languages-plugin/boot/window";
import {applyMap} from "@languages-plugin/boot/map";
import {applyFullBoot, applyLiteBoot} from "@languages-plugin/boot/scene";

/**
 * Applies the base plugin initialization that is common to both full and lite versions.
 * Sets up logging, loads parameters, and applies core functionality extensions.
 */
function applyBasePlugin() {
  setpath(join("log", PluginName, "languages.log"));

  // setup parameters
  setupParameters();

  applyConfig();

  applyWindow();

  applyOptions();

  applyImages();

  applyMap();
}

/**
 * Applies the full plugin initialization including file generation capabilities.
 * Use this version during development for generating language JSON files.
 */
export function applyFullPlugin() {

  applyBasePlugin();

  applyFullBoot();
}


/**
 * Applies the lite plugin initialization without file generation.
 * Use this version in production builds where language files are pre-generated.
 */
export function applyLitePlugin() {
  applyBasePlugin();

  applyLiteBoot();
}
