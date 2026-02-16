import {WithPrototype} from "@jstls/types/core/objects";
import {funclass, partialMethod} from "@languages-plugin/shortcuts/cls";
import {isObject} from "@languages-plugin/shortcuts/validations";
import {getprop, readonlys2} from "@languages-plugin/shortcuts/properties";
import {setTo, string} from "@languages-plugin/shortcuts/mappers";
import {join} from "@languages-plugin/shortcuts/env/path";
import {JsonSerializable} from "@languages-plugin/lib";

/**
 * Represents a language configuration option for the plugin.
 * Contains the code, display name, and label used in menus.
 */
export interface LanguageOption extends JsonSerializable {
  /** The unique code identifier for the language (e.g., "en", "es", "fr") */
  readonly code: string;

  /** The display name of the language (e.g., "English", "Español") */
  readonly name: string;

  /** The label used in the options menu (e.g., "Language", "Idioma") */
  readonly label: string;

  /**
   * Returns the language code as a primitive string value.
   * Allows using LanguageOption in string contexts.
   */
  valueOf(): string;

  /**
   * Returns the language code as a string.
   * Allows using LanguageOption in string contexts.
   */
  toString(): string;

  /**
   * Checks if this language is equal to another language option.
   * @param other - The LanguageOption to compare with
   * @returns true if both languages have the same code
   */
  equals(other: LanguageOption): boolean;
}

/**
 * Constructor interface for creating LanguageOption instances.
 */
export interface LanguageOptionConstructor extends WithPrototype<LanguageOption> {
  /**
   * Creates a new LanguageOption with the given parameters.
   * @param code - The language code (e.g., "en")
   * @param name - The display name (e.g., "English")
   * @param label - The menu label (e.g., "Language")
   */
  new(code?: string, name?: string, label?: string): LanguageOption;

  /**
   * Creates a new LanguageOption from an existing LanguageOption source.
   * @param source - An existing LanguageOption to copy from
   */
  new(source?: LanguageOption): LanguageOption
}

const getCode = partialMethod(getprop<LanguageOption>, "code");

/**
 * Generates the filename for a language's JSON file.
 * @param language - The LanguageOption to generate the filename for
 * @param folder - Optional folder path (defaults to parameters.folder)
 * @returns The full path to the language JSON file (e.g., "data/languages/en.json")
 */
export function jsonFilename(language: LanguageOption, folder?: string): string {
  return join(string(folder), language.code + ".json");
}

/**
 * LanguageOption class constructor for creating language configuration objects.
 * Implements a functional class pattern with readonly properties.
 */
export const LanguageOption: LanguageOptionConstructor = funclass({
  construct: function (code?: string | LanguageOption, name?: string, label?: string) {
    if (isObject(code)) {
      name = (code as LanguageOption).name;
      label = (code as LanguageOption).label;
      code = (code as LanguageOption).code
    }
    readonlys2(
      this,
      {
        code: string(code),
        name: string(name),
        label: string(label),
      }
    )
  },
  prototype: {
    valueOf: getCode,
    toString: getCode,
    equals(other): boolean {
      return this.code === other.code;
    },
    toJSON() {
      return setTo(this, ["code", "name", "label"], {})
    }
  }
})


/**
 * The default language option used when no translation is available.
 * Acts as the fallback/source language for the localization system.
 */
export const DefaultLanguage = new LanguageOption("default", "Default", "Default")
