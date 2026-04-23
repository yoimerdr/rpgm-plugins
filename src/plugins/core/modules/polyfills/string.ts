import {defines} from "../properties";
import {prototype} from "@jstls/core/shortcuts/object";
import {descriptor} from "@jstls/core/definer/shared";
import {endsWith, repeat, startsWith} from "@jstls/core/polyfills/string/es2015";

/**
 * The string polyfill.
 *
 * Provides polyfills for instance methods of the `String` object, such as `startsWith`, `endsWith`, and `repeat`.
 * These ensure consistent behavior across different environments.
 */
export interface StringPolyfill {
  startsWith(searchString: string, position?: number): boolean;

  endsWith(searchString: string, endPosition?: number): boolean;

  repeat(count: number): string;
}

/**
 * Applies polyfills for instance methods of the `String` object.
 *
 * This function ensures that modern String methods like `startsWith`, `endsWith`, and `repeat` are available
 * across different environments by defining them on the String prototype if they are missing.
 * It should be called during plugin initialization to guarantee consistent behavior
 * regardless of the target environment's JavaScript support.
 */
export function applyStringPolyfills() {
  defines(
    prototype(String),
    {
      endsWith: descriptor(endsWith, true, true),
      startsWith: descriptor(startsWith, true, true),
      repeats: descriptor(repeat, true, true),
    }
  )
}
