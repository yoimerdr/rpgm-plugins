import {Keys} from "@jstls/types/core";
import {defineProperty} from "@jstls/core/shortcuts/object";
import {descriptor2} from "@jstls/core/definer/shared";

/**
 * Defines a readonly property on an object with the specified getter.
 * @param object - The object to define the property on.
 * @param property - The property key.
 * @param getter - The getter function for the property.
 */
export function defineReadonly<T>(
  object: T,
  property: PropertyKey | Keys<T>,
  getter: () => any,
) {
  defineProperty(
    object,
    property,
    descriptor2(
      getter,
      undefined,
      false,
      true
    )
  )
}
