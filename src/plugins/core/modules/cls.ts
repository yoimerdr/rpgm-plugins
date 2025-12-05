import {funclass2} from "@jstls/core/definer/classes/funclass";
import {method, methods} from "@jstls/core/extender";
import {partial} from "@jstls/core/functions/partial";

/**
 * The core classes module.
 *
 * This module provides a collection of utilities for working with classes and functions.
 * It includes tools for creating functional classes (`funclass`), extending methods with
 * `before` and `after` advice, and partial application of methods.
 */
export interface CoreClasses {
  funclass: typeof funclass2,
  extendMethod: typeof method,
  extendMethods: typeof methods,
  partialMethod: typeof partial
}


/**
 * The core classes module instance.
 */
export const cls: CoreClasses = {
  funclass: funclass2,
  extendMethod: method,
  extendMethods: methods,
  partialMethod: partial
}


