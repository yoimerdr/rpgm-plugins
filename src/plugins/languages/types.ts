import {LanguageNumberExtensions} from "@languages-plugin/extensions/number";
import {YDPLanguages} from "@languages-plugin/index";

declare global {
  interface Number extends LanguageNumberExtensions {
  }
}

declare const YDP_Languages: YDPLanguages

/**
 * The global instance of the Languages plugin.
 */
export default YDP_Languages;
