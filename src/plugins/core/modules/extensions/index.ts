import {applyNumberExtensions} from "./number";
import {applyStringExtensions} from "./string";
import {applyArrayExtensions} from "./array";

export function applyExtensions() {
  applyNumberExtensions();
  applyStringExtensions();
  applyArrayExtensions();
}
