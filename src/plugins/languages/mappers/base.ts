import {SetTransformDescriptor} from "@jstls/types/core/objects/getset";
import {set2, setTo, setTransform} from "@languages-plugin/shortcuts/mappers";
import {KeyableObject} from "@jstls/types/core/objects";
import {getKeys} from "@languages-plugin/shortcuts/properties";
import {JsonSerializable} from "@languages-plugin/lib";
import {keach} from "@languages-plugin/shortcuts/iterables";
import {isDefined, isObject, isString} from "@languages-plugin/shortcuts/validations";
import {isArray} from "@jstls/core/shortcuts/array";

export function toJsonTransform<T>(descriptor: SetTransformDescriptor<T>) {
  return function (this: T) {
    const source = setTransform(this, descriptor, {}),
      result = {} as T;

    keach(source, function (value, key) {
      let allow = false;
      if (isString(value) || isArray(value))
        allow = (value as string).isNotEmpty()
      else if (isObject(value))
        allow = getKeys(value).isNotEmpty();
      else if (isDefined(value))
        allow = true;

      allow && set2(result, key, value)
    })

    return result;
  }
}

export function toSourceTransform<T>(descriptor: SetTransformDescriptor<T>) {
  return function (source: T) {
    source = setTo(source as any, getKeys(descriptor), {}) as T;
    set2(source as JsonSerializable, "toJSON", toJsonTransform(descriptor))

    return source;
  }
}

export function fromSourceTransform<T>(descriptor: SetTransformDescriptor<T>) {
  return function (source: KeyableObject): T {
    return setTransform(source, descriptor, {}, true) as T;
  }
}
