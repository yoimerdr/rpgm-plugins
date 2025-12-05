import {defines} from "../properties";
import {descriptor} from "@jstls/core/definer/shared";
import {is} from "@jstls/core/polyfills/objects/es2015";
import {KeyableObject} from "@jstls/types/core/objects";
import {assign} from "@jstls/core/objects/factory";

/**
 * The object constructor polyfill.
 *
 * Provides polyfills for static methods of the `Object` constructor, such as `assign` and `is`.
 * These ensure consistent behavior across different environments.
 */
export interface ObjectConstructorPolyfill {
  assign<Ty extends KeyableObject, U extends KeyableObject>(target: Ty, source: U): Ty & U

  is(value1: any, value2: any): boolean
}

export function applyObjectPolyfills() {
  defines(
    Object,
    {
      is: descriptor(is, true, true),
      assign: descriptor(assign, true, true)
    }
  )
}
