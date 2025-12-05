import {each, keach, reach} from "@jstls/core/iterable/each";
import {ObjectEach} from "@jstls/types/core/iterable";
import {bind} from "@jstls/core/functions/bind";
import {isDefined} from "@jstls/core/objects/types";

/**
 * The core iterables module.
 *
 * Provides a set of utility functions for iterating over various data structures.
 * It unifies iteration logic for arrays, objects, and other iterable types, offering
 * methods for standard iteration, key-based iteration, and reverse iteration.
 */
export interface CoreIterables {
  each: typeof each;
  keach: typeof keach;
  reach: typeof reach;
  eachnxt: typeof reach;
  eachprv: typeof reach;
  each2: typeof each;
}

/**
 * The core iterables module instance.
 */
export const iterables: CoreIterables = {
  each: each,
  keach: keach,
  reach: reach,
  eachnxt: reach,
  eachprv: reach,
  each2: <any>function <T, R = void>(source: T, callback: ObjectEach<T, R>, thisArg?: R) {
    callback = bind(callback, thisArg!);

    each(source, function (value, index, arrayLike) {
      if (!isDefined(value))
        return;
      (callback as any)(value, index, arrayLike);
    }, thisArg)
  }
}
