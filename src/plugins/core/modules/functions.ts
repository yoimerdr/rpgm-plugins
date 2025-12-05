import {noact} from "@jstls/core/utils";
import {apply} from "@jstls/core/functions/apply";
import {call} from "@jstls/core/functions/call";
import {bind, methodize} from "@jstls/core/functions/bind";

export interface CoreFunctions {
  noact: typeof noact;
  apply: typeof apply;
  call: typeof call;
  bind: typeof bind;
  methodize: typeof methodize;
}

export const functions: CoreFunctions = {
  noact,
  apply,
  call,
  bind,
  methodize
}
