import {defines, descriptor, getPrototype} from "@languages-plugin/shortcuts/properties";
import {TextCode} from "@languages-plugin/models/text-code";

export interface LanguageNumberExtensions {
  isTextCode(): boolean;

  isShowTextCode(): boolean;
}

export function applyNumberExtensions() {
  defines(
    getPrototype(Number,),
    {
      isTextCode: descriptor(
        function (this: Number) {
          return [
            TextCode.TEXT,
            TextCode.CHOICE,
            TextCode.SCROLLING_TEXT
          ].contains(this.valueOf());
        },
        true, true
      ),
      isShowTextCode: descriptor(
        function (this: Number) {
          return this.valueOf() === TextCode.TEXT;
        }
      )
    }
  )
}
