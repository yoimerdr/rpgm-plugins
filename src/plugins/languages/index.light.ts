import {applyExtensions} from "@languages-plugin/extensions";
import {handler} from "./handler";
import {applyLitePlugin} from "@languages-plugin/boot";
import {KeyableObject} from "@jstls/types/core/objects";

declare const exports: KeyableObject;


applyExtensions();
applyLitePlugin();

export {
  handler,
}
