import {
  getter,
  getters,
  prop,
  readonly,
  readonly2,
  readonlys,
  readonlys2,
  writeable,
  writeable2,
  writeables
} from "@jstls/core/definer";
import {assign, assign2, deepAssign} from "@jstls/core/objects/factory";
import {Keys} from "@jstls/types/core";
import {DefinePropertyDescriptor, DefinePropertyDescriptors} from "@jstls/types/core/objects/definer";
import {isDefined} from "@jstls/core/objects/types";
import {bind} from "@jstls/core/functions/bind";
import {descriptor, descriptor2, multiple} from "@jstls/core/definer/shared";
import {indefinite} from "@jstls/core/utils/types";
import {KeyableObject} from "@jstls/types/core/objects";
import {property} from "@jstls/core/objects/handlers/builder";
import {keys, prototype} from "@jstls/core/shortcuts/object";
import {name} from "@jstls/core/functions";
import {uid} from "@jstls/core/polyfills/symbol";
import {simple} from "@jstls/core/definer/getters/builders";

/**
 * Defines a property on an object.
 *
 * @param target The object to define the property on.
 * @param key The property key.
 * @param descriptor The property descriptor.
 */
export function define<T, K extends Keys<T> | PropertyKey = PropertyKey>(target: T, key: K, descriptor: DefinePropertyDescriptor<T, K>) {
  if (isDefined((target as any)[key]))
    return
  prop(target, key, descriptor)
}

/**
 * Defines multiple properties on an object.
 *
 * @param target The object to define properties on.
 * @param descriptors A map of property keys to descriptors.
 */
export const defines = bind(multiple, indefinite, define) as {
  <T>(target: T, descriptors: DefinePropertyDescriptors<T>): void;
  <T>(target: T, descriptors: KeyableObject<PropertyDescriptor>): void;
}

/**
 * The core properties module.
 *
 * Provides a comprehensive suite of tools for defining and managing object properties.
 * It includes utilities for creating read-only properties, defining multiple properties at once,
 * assigning values (shallow and deep), and inspecting property descriptors.
 */
export interface CoreProperties {
  define: typeof define,
  defines: typeof defines,
  readonly: typeof readonly,
  readonlys: typeof readonlys,
  readonly2: typeof readonly2,
  readonlys2: typeof readonlys2,
  assign: typeof assign2,
  deepAssign: typeof deepAssign,

  getPropertyOf: typeof property,
  getPrototype: typeof prototype,
  getKeys: typeof keys

  descriptor: typeof descriptor,
  descriptor2: typeof descriptor2,

  writeable: typeof writeable,
  writeable2: typeof writeable2,

  writeables: typeof writeables,

  getter: typeof getter,
  getters: typeof getters,

  funname: typeof name,

  uid: typeof uid,

  getprop: typeof simple
}

/**
 * The core properties module instance.
 */
export const properties: CoreProperties = {
  define: define,
  defines: defines,
  readonly2,
  readonlys2,
  readonly,
  readonlys,
  assign,
  deepAssign,
  getPropertyOf: property,
  getPrototype: prototype,
  getKeys: keys,
  descriptor,
  descriptor2,
  writeable,
  writeable2,
  writeables,
  getter,
  getters,
  funname: name,
  uid,
  getprop: simple
}
