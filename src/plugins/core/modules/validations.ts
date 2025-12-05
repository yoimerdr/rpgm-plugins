import {
  isBoolean,
  isDefined,
  isFunction,
  isNumber,
  isObject,
  isPlainObject,
  isString,
  typeIs
} from "@jstls/core/objects/types";
import {
  getDefined,
  getIf,
  requireDefined,
  requiredWithType,
  requireFunction,
  requireIf,
  requireObject
} from "@jstls/core/objects/validators";
import {returns} from "@jstls/core/utils";

/**
 * The core validations module.
 *
 * Offers a robust set of validation functions to ensure data integrity and type correctness.
 * It includes checks for primitive types (string, number, boolean), object structures,
 * and existence (defined/undefined). It also provides "require" functions that throw errors
 * if validation fails, useful for defensive programming.
 */
export interface CoreValidations {
  isType: typeof typeIs;
  isObject: typeof isObject;
  isPlainObject: typeof isPlainObject;
  isDefined: typeof isDefined;
  isFunction: typeof isFunction;
  isString: typeof isString;
  isBoolean: typeof isBoolean;
  isNumber: typeof isNumber;

  requireIf: typeof requireIf;
  requireWithType: typeof requiredWithType
  requireFunction: typeof requireFunction;
  requireObject: typeof requireObject;
  requireDefined: typeof requireDefined

  getIf: typeof getIf;
  getDefined: typeof getDefined;

  returns: typeof returns
}

/**
 * The core validations module instance.
 */
export const validations: CoreValidations = {
  isType: typeIs,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isDefined: isDefined,
  isFunction: isFunction,
  isString: isString,
  isBoolean: isBoolean,
  isNumber: isNumber,

  requireIf: requireIf,
  requireWithType: requiredWithType,
  requireFunction: requireFunction,
  requireObject: requireObject,
  requireDefined: requireDefined,

  getIf: getIf,
  getDefined: getDefined,

  returns
}
