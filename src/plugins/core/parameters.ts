import {win} from "@jstls/components/shared/constants";
import {isDefined, isFunction} from "@jstls/core/objects/types";
import {get2, set2} from "@jstls/core/objects/handlers/getset";
import {boolParameter} from "@core-plugin/modules/parameters";
import {assign2} from "@jstls/core/objects/factory";
import {define} from "@core-plugin/modules/properties";
import {descriptor} from "@jstls/core/definer/shared";

/**
 * The polyfill inclusion mode.
 *
 * - `auto`: Automatically determine if the polyfill is needed.
 * - `include`: Force inclusion of the polyfill.
 * - `exclude`: Force exclusion of the polyfill.
 */
export type PolyfillMode = "auto" | "include" | "exclude";

/**
 * The plugin parameters.
 *
 * Defines the configuration options available for the plugin.
 * These parameters control various aspects of the plugin's behavior, such as polyfill inclusion.
 */
export interface Parameters {
  polyfills: boolean;
  promise: PolyfillMode;
  headers: PolyfillMode;
  response: PolyfillMode;
  fetch: PolyfillMode;
}

/**
 * The unique name of the plugin.
 */
export const PluginName = "YDP_Core",
  /**
   * The active parameters for the plugin.
   */
  parameters: Parameters = {} as Parameters;

/**
 * Sets a polyfill based on the provided mode and availability.
 *
 * @param mode The polyfill mode (`auto`, `include`, `exclude`).
 * @param name The name of the property to polyfill on the global object.
 * @param polyfill The polyfill implementation.
 */
export function setParameterPolyfill(mode: PolyfillMode, name: string, polyfill: any) {
  if (mode === "include" || (mode === "auto" && !isDefined(get2(win, name)))) {
    define(win, name, descriptor(polyfill, true, true, !isFunction(polyfill)))
  }
}

/** Set up the plugin parameters
 * */
export function setupParameters() {
  const params = PluginManager.parameters(PluginName) || {
    polyfills: true,
    response: "auto",
    fetch: "auto",
    headers: "auto",
    promise: "auto"
  } as Parameters;

  assign2(parameters, params);
  set2(
    parameters,
    "polyfills",
    boolParameter(params.polyfills || "true")
  )
}
