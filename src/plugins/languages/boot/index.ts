import {PluginName, setupParameters} from "@languages-plugin/parameters";
import {setpath} from "@languages-plugin/shortcuts/env/logger";
import {join} from "@languages-plugin/shortcuts/env/path";
import {applyConfig} from "@languages-plugin/boot/config";
import {applyOptions} from "@languages-plugin/boot/options";
import {applyImages} from "@languages-plugin/boot/images";
import {applyWindow} from "@languages-plugin/boot/window";
import {applyMap} from "@languages-plugin/boot/map";
import {applyFullBoot, applyLiteBoot} from "@languages-plugin/boot/scene";

function applyBasePlugin() {
  // setup parameters
  setupParameters();
  setpath(join("log", PluginName, "languages.log"));

  applyConfig();

  applyWindow();

  applyOptions();

  applyImages();

  applyMap();
}

export function applyFullPlugin() {

  applyBasePlugin();

  applyFullBoot();
}


export function applyLitePlugin() {
  applyBasePlugin();

  applyLiteBoot();
}
