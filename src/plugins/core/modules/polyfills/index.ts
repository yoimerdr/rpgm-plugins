import {applyStringPolyfills} from "./string";
import {applyArrayPolyfills} from "./array";

export function applyPolyfills() {
  applyStringPolyfills();
  applyArrayPolyfills();
}
