import YDP_Core from "@core-plugin/types";
import {KeyableObject} from "@jstls/types/core/objects";
import {isArray} from "@jstls/core/shortcuts/array";
import {keach} from "./iterables";
import {MaybeString} from "@jstls/types/core";
import {isDefined, isObject} from "@languages-plugin/shortcuts/validations";

export const {
  set2,
  get2,
  string,
  setTo,
  setTransform,
  set,
  concat,
  setobj,
  get
} = YDP_Core.mappers;

export function flattenobj(obj: KeyableObject,): KeyableObject;
export function flattenobj(obj: KeyableObject, sep: string): KeyableObject;

export function flattenobj(obj: KeyableObject, sep?: MaybeString): KeyableObject {
  const result = {};
  if (!isObject(obj))
    return result;

  sep = string(sep);

  function flat(current: KeyableObject, prefix: string) {
    keach(current, (value, key) => {
      const property = string(key),
        newKey = prefix ? prefix + sep + property : property;
      if (isObject(value) && !isArray(value)) {
        flat(value, newKey);
      } else set2(result, newKey, value)
    })
  }

  flat(obj, "");
  return result;
}


export function mapString<T extends KeyableObject>(template: string, data: T): string {
  return template.replace(/\$\{(\w+)\}/g, (_, key) => {
    const value = get2(data, key);
    return isDefined(value) ? string(value) : "";
  });
}
