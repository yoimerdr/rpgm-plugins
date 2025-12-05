import {applyStringPolyfills} from "./string";
import {applyArrayPolyfills} from "./array";
import {isDefined, isFunction} from "@jstls/core/objects/types";
import {get2} from "@jstls/core/objects/handlers/getset";
import {win} from "@jstls/components/shared/constants";
import {descriptor} from "@jstls/core/definer/shared";
import {define} from "@core-plugin/modules/properties";

/**
 * The polyfill inclusion mode.
 *
 * - `auto`: Automatically determine if the polyfill is needed.
 * - `include`: Force inclusion of the polyfill.
 * - `exclude`: Force exclusion of the polyfill.
 */
export type PolyfillMode = "auto" | "include" | "exclude";

/**
 * Sets a polyfill on `window` object based on the provided mode and availability.
 *
 * @param mode The polyfill mode (`auto`, `include`, `exclude`).
 * @param name The name of the property to polyfill on the global object.
 * @param polyfill The polyfill implementation.
 */
export function setWindowPolyfill(mode: PolyfillMode, name: string, polyfill: any) {
  if (mode === "include" || (mode === "auto" && !isDefined(get2(win, name)))) {
    define(win, name, descriptor(polyfill, true, true, !isFunction(polyfill)))
  }
}

export function applyPolyfills() {
  applyStringPolyfills();
  applyArrayPolyfills();
}
