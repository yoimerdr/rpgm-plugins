import {applyStringPolyfills} from "./string";
import {applyArrayPolyfills} from "./array";

/**
 * Applies all available polyfills for the plugin environment.
 *
 * This function ensures that modern JavaScript methods are available
 * across different environments by applying polyfills for arrays and strings.
 * It should be called during plugin initialization to guarantee consistent
 * behavior regardless of the target environment's JavaScript support.
 */
export function applyPolyfills() {
  applyStringPolyfills();
  applyArrayPolyfills();
}
