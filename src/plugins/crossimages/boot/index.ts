// Boot logic will go here
import {PluginName, setupParameters} from "@crossimages-plugin/parameters";
import {setpath} from "@crossimages-plugin/shortcuts/env/logger";
import {join} from "@crossimages-plugin/shortcuts/env/path";
import {applyFullBoot, applyLiteBoot} from "@crossimages-plugin/boot/scene";
import {applyImages} from "@crossimages-plugin/boot/images";

export function applyBasePlugin() {
    setpath(join("log", PluginName, "crossimages.log"));

    setupParameters();

    applyImages();
}

export function applyFullPlugin() {
    applyBasePlugin();

    applyFullBoot();
}

export function applyLitePlugin() {
    applyBasePlugin();

    applyLiteBoot();
}
