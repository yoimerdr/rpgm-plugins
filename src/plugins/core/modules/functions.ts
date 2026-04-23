import {noact} from "@jstls/core/utils";
import {apply} from "@jstls/core/functions/apply";
import {call} from "@jstls/core/functions/call";
import {bind, methodize} from "@jstls/core/functions/bind";

/**
 * Core functions utilities.
 *
 * This interface defines the set of core function utilities available in the plugin.
 */
export interface CoreFunctions {
  noact: typeof noact;
  apply: typeof apply;
  call: typeof call;
  bind: typeof bind;
  methodize: typeof methodize;
}

/**
 * The core functions module instance.
 */
export const functions: CoreFunctions = {
  noact,
  apply,
  call,
  bind,
  methodize
}
