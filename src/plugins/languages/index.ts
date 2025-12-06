import {applyExtensions} from "@languages-plugin/extensions";
import {applyFullPlugin} from "@languages-plugin/boot";
import {handler, PluginHandler} from "@languages-plugin/handler";
import {KeyableObject} from "@jstls/types/core/objects";

declare const exports: KeyableObject;

applyExtensions()
applyFullPlugin();

export interface YDPLanguages {
  handler: PluginHandler;
}

export {
  handler,
}
