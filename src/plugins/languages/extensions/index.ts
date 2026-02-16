import {applyNumberExtensions} from "@languages-plugin/extensions/number";

/**
 * Applies all runtime extensions to JavaScript prototypes.
 * Currently extends Number with language-specific validation methods.
 */
export function applyExtensions() {
  applyNumberExtensions();
}
