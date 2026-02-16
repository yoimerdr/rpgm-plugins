import {defines, descriptor, getPrototype} from "@languages-plugin/shortcuts/properties";
import {TextCode} from "@languages-plugin/models/text-code";

/**
 * Extended methods added to the Number prototype for event command code validation.
 * Used to check if a command code represents text-related commands.
 */
export interface LanguageNumberExtensions {
  /**
   * Checks if this number represents a text-related command code.
   * Text codes include: Show Text (401), Show Choices (102), Scroll Text (105).
   * @returns true if this is a text command code
   */
  isTextCode(): boolean;

  /**
   * Checks if this number represents a Show Text command code (401).
   * @returns true if this is specifically a Show Text command code
   */
  isShowTextCode(): boolean;
}

/**
 * Applies Number prototype extensions for event command code validation.
 * Adds isTextCode() and isShowTextCode() methods to Numbers.
 */
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
