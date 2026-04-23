import {applyNumberExtensions} from "./number";
import {applyStringExtensions} from "./string";
import {applyArrayExtensions} from "./array";

/**
 * Applies all core extensions (number, string, array) to their respective global prototypes.
 * This function should be called once during application initialization to enable all extensions.
 */
export function applyExtensions() {
  applyNumberExtensions();
  applyStringExtensions();
  applyArrayExtensions();
}
