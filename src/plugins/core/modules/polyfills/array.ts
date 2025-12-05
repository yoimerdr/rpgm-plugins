import {defines} from "../properties";
import {descriptor} from "@jstls/core/definer/shared";
import {arrayFrom, arrayOf} from "@jstls/core/polyfills/array";

/**
 * The array constructor polyfill.
 *
 * Provides polyfills for static methods of the `Array` constructor, such as `from` and `of`.
 * These ensure consistent behavior across different environments where these methods might be missing.
 */
export interface ArrayConstructorPolyfill {
  from<T, U>(iterable: ArrayLike<T>, mapfn?: (v: T, k: number) => U, thisArg?: any): U[];

  of<T>(...items: T[]): T[];
}


export function applyArrayPolyfills() {
  defines(
    Array,
    {
      from: descriptor(arrayFrom, true, true),
      of: descriptor(arrayOf, true, true),
    }
  )
}
