import {defines} from "../properties";
import {descriptor} from "@jstls/core/definer/shared";
import {arrayFrom, arrayOf, at, find, findIndex, findLastIndex} from "@jstls/core/polyfills/array";
import {prototype} from "@jstls/core/shortcuts/object";
import {findLast} from "@jstls/core/polyfills/indexable/es2023";
import {ArrayEach, ArrayLike, ArrayLikeEach} from "@jstls/types/core/array";
import {Maybe} from "@jstls/types/core";

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

export interface ArrayPolyfill<T> {
  find<V>(this: V[], predicate: ArrayEach<V, T, boolean>, thisArg?: T): Maybe<V>;

  findIndex<V>(this: V[], predicate: ArrayEach<V, T | void, boolean>, thisArg?: T): number;

  findLast<V>(this: ArrayLike<V>, predicate: ArrayLikeEach<V, T | void, ArrayLike<V>, boolean>, thisArg?: T): Maybe<V>;

  findLastIndex<V>(this: V[], predicate: ArrayEach<V, T | void, boolean>, thisArg?: T): number;

  at(index: number): T;
}


export function applyArrayPolyfills() {
  defines(
    Array,
    {
      from: descriptor(arrayFrom, true, true),
      of: descriptor(arrayOf, true, true),
    }
  )

  defines(
    prototype(Array),
    {
      find: descriptor(find, true, true),
      findIndex: descriptor(findIndex, true, true),
      findLast: descriptor(findLast, true, true),
      findLastIndex: descriptor(findLastIndex, true, true),
      at: descriptor(at, true, true)
    }
  )
}
