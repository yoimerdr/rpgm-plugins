import {string} from "@jstls/core/objects/handlers";

export type BooleanParameter = "true" | "false" | "null" | "undefined";

/**
 * Converts a string parameter to a boolean.
 *
 * @param value The string value ("true", "false", etc.).
 * @returns `true` if the value is "true", `false` otherwise.
 */
export function boolParameter(value: BooleanParameter | string) {
  return string(value) === "true";
}

/**
 * The core parameters module.
 *
 * Handles the parsing and processing of plugin parameters.
 * It provides functions to convert raw parameter strings into typed values, such as booleans.
 */
export interface CoreParameters {
  bool: typeof boolParameter;
}

/**
 * The core parameters module instance.
 */
export const parameters: CoreParameters = {
  bool: boolParameter
}
