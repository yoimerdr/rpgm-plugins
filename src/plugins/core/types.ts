import {YDPCore} from "./index.js";
import {NumberExtensions} from "./modules/extensions/number";
import {StringExtensions} from "./modules/extensions/string";
import {ArrayExtensions} from "./modules/extensions/array";
import {StringPolyfill} from "./modules/polyfills/string";
import {ArrayConstructorPolyfill, ArrayPolyfill} from "./modules/polyfills/array";
import {ObjectConstructorPolyfill} from "./modules/polyfills/object";

declare const YDP_Core: YDPCore

// extensions
declare global {
  interface ArrayConstructor extends ArrayConstructorPolyfill {

  }

  interface ObjectConstructor extends ObjectConstructorPolyfill {

  }

  interface Array<T> extends ArrayExtensions<T>, ArrayPolyfill<T> {

  }

  interface Number extends NumberExtensions {

  }

  interface String extends StringExtensions, StringPolyfill {
  }
}


/**
 * The global instance of the Core plugin.
 */
export default YDP_Core
