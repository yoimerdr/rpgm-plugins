import {applyArrayExtensions as applyCoreExtensions} from "@jstls/core/extensions/array";
import {ArrayExtensions as ArrayCoreExtensions} from "@jstls/types/core/extensions/array";
import {ArrayEach} from "@jstls/types/core/array";
import {readonly} from "@jstls/core/definer";
import {prototype} from "@jstls/core/shortcuts/object";
import {getIf, requireFunction} from "@jstls/core/objects/validators";
import {isDefined, isFunction} from "@jstls/core/objects/types";
import {returns} from "@jstls/core/utils";
import {bind} from "@jstls/core/functions/bind";
import {len} from "@jstls/core/shortcuts/indexable";
import {each} from "@jstls/core/iterable/each";
import {set2} from "@jstls/core/objects/handlers/getset";

export interface ArrayExtensions<T> extends ArrayCoreExtensions<T> {
  /**
   * Apply a converter callback to each element of the array (similar to map) if it meets the condition.
   *
   * @param converter A callback that accepts two parameters, the element and its index, and returns a value.
   * The mapIf method will call the converter callback if the condition callback returns true for the element.
   * @param [condition] A callback that accepts two parameters, the element and its index, and returns true or false.
   * If this parameter is null or undefined, Object.isValidType will be used as its value.
   * @param thisArg The `this` reference for the converter function.
   */
  mapIf<R, This = any>(converter: ArrayEach<T, This, R>, condition?: ArrayEach<T, This, boolean>, thisArg?: This): R[];
}

export function applyArrayExtensions() {
  applyCoreExtensions();

  readonly(prototype(Array), "mapIf", function (converter, condition, thisArg) {
    converter = requireFunction(converter, "converter")
    condition = getIf(condition, isFunction, returns(isDefined));
    condition = bind(condition, thisArg);
    converter = bind(converter, thisArg)

    const out = new Array(len(this));
    each(this, function (value, index, arrayLike) {
      condition(value, index, arrayLike) && set2(out, index, converter(value, index, arrayLike))
    }, out)

    return out;
  })
}
