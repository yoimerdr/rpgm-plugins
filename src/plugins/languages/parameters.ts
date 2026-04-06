import {assign} from "./shortcuts/properties";
import {concat, get2, set2} from "./shortcuts/mappers";
import {each, each2, keach} from "./shortcuts/iterables";
import {getIf, isString, returns} from "./shortcuts/validations";
import {isArray} from "@jstls/core/shortcuts/array";
import {LanguageOption} from "./models/language-option";
import {join} from "@languages-plugin/shortcuts/env/path";
import {bool} from "@languages-plugin/shortcuts/parameters";
import {freeze} from "@jstls/core/shortcuts/object";
import {Maybe} from "@jstls/types/core";

/**
 * Controls when the plugin generates or updates language JSON files.
 * - "auto": Generate files only if they don't exist
 * - "always": Regenerate files every time the game starts
 * - "none": Disable file generation completely
 */
export type GenerateLanguageMode = "auto" | "always" | "none";

/**
 * Controls which language files receive custom text entries.
 * - "all": Custom texts are added to all language files
 * - "no-default": Custom texts are NOT added to the default language file
 */
export type CustomTextsTarget = "all" | "no-default";

/**
 * Configuration for custom text entries that can be translated.
 * Custom texts allow translating strings that aren't in the standard RPG Maker database.
 */
export interface CustomTexts {
  /** Custom texts for menu options */
  readonly option: string[];

  /** Custom texts for status/boolean values */
  readonly status: string[];

  /** Custom texts for general text strings */
  readonly text: string[];
}


/**
 * Trimmers configurations for custom texts.
 * Allows developers to strip out specific patterns (like icons \I[9]) before translations.
 */
export interface CustomTextTrimmers {
  /** Regex pattern to remove from option texts */
  readonly option: Maybe<RegExp>;

  /** Regex pattern to remove from status texts */
  readonly status: Maybe<RegExp>;

  /** Regex pattern to remove from general texts */
  readonly text: Maybe<RegExp>;
}

/**
 * The complete set of plugin parameters configurable in RPG Maker.
 */
export interface Parameters {
  /** Array of LanguageOption objects defining available languages */
  languages: readonly LanguageOption[]

  /** Controls file generation mode (auto, always, none) */
  generationMode: GenerateLanguageMode;

  /** Memory loading strategy: "full" loads all languages, "lang" loads only active */
  loadMode: "full" | "lang";

  /** Relative folder path where language JSON files are stored */
  folder: string;

  /** Whether to join consecutive Show Text commands into single entries */
  joinShowText: boolean;

  /** Separator string used when joining multiple Show Text commands */
  joinSeparator: string;

  /** How to interpret the join separator: "strict" or "unescaped" */
  joinSeparatorType: "strict" | "unescaped";

  /** Whether to enable image localization feature */
  enableImages: boolean;

  /**
   * Image filtering mode:
   * - "all": All images in folders are candidates for localization
   * - "lang": Only images with explicit language suffix are processed
   */
  imageMode: "all" | "lang",

  /** Pattern template for localized image filenames (e.g., "${filename}.${code}") */
  imagePattern: string;

  /** Whether to enable custom text translations */
  enableCustom: boolean;

  /** Which language files receive custom text entries */
  customTarget: CustomTextsTarget;

  /** If true, failing to find a custom text in its target will search in others */
  customFallbacks: boolean;

  /** Configurations for trimming texts using Regex before translation keys lookup */
  customTrimmers: CustomTextTrimmers;

  /** The custom texts configuration from plugin parameters */
  customTexts: CustomTexts;
}

export const PluginName = "YDP_Languages",
  parameters: Parameters = {
    languages: [] as readonly LanguageOption[],
    generationMode: "auto",
    loadMode: "full",
    folder: join("data", "languages"),

    joinShowText: true,
    joinSeparator: "\n",
    joinSeparatorType: "unescaped",

    enableImages: true,
    imageMode: "lang",
    imagePattern: "${filename}.${code}",

    enableCustom: true,
    customFallbacks: false,
    customTrimmers: {
      option: undefined,
      status: undefined,
      text: undefined
    },
    customTexts: {},
    customTarget: "no-default",
  } as Parameters;

export function setupParameters() {
  // load the plugin parameters
  const params = PluginManager.parameters(PluginName) || {};

  assign(parameters, params);
  // validates the separator type for the join.
  parameters.joinSeparatorType === "unescaped" &&
  set2(parameters, "joinSeparator", JSON.parse(concat("\"", parameters.joinSeparator, "\"")));

  try {
    // maps the languages parameter
    set2(
      parameters,
      "languages",
      (getIf(JSON.parse(params.languages), isArray, returns([])))
        .map(function (value: string) {
          return new LanguageOption(JSON.parse(value));
        })
    );

    // maps the custom texts parameter
    let texts: string | CustomTexts = params.customTexts
    texts = isString(texts) ? JSON.parse(texts) as CustomTexts : texts as any as CustomTexts;

    keach(texts, (value: string[] | string, key) => {
      value = isString(value) ? JSON.parse(value as string) : value as string;

      // For texts, we need to remove the quotes if they are present, because the plugin parameters are marked as notes,
      // what wraps the text value with quotes for allow special characters like \n.
      if (key === "text" && isArray(value)) {
        each2(value as string[], function (value, index, arrayLike) {
          let size = value.length >> 0;
          if (size > 2 && value[0] === '"' && value[size - 1] === '"') {
            try {
              arrayLike[index] = JSON.parse(value); // Parse the value to remove the quotes and unescape the special characters.
            } catch (e) {
              console.error("Cannot parse the note value: " + e);
            }
          }
        });
      }

      set2(texts, key, value);
    });

    let trimmersParam = params.customTrimmers;
    let trimmersParsed = isString(trimmersParam) ? JSON.parse(trimmersParam) : { };
    let trimmers: Record<string, Maybe<RegExp>> = { };

    keach(trimmersParsed, (value: string, key) => {
      if (value) {
        try {
          trimmers[key as string] = new RegExp(value, 'g');
        } catch (e) {
          console.warn(`Invalid regex trimmer for custom text type '${key as string}': ${value}`);
        }
      }
    });

    set2(
      parameters,
      "customTrimmers",
      trimmers
    );

    set2(
      parameters,
      "customTexts",
      freeze(texts),
    );
  } catch (e) {
    console.error(e);
  }

  if (!parameters.imagePattern || parameters.imagePattern.trim() === "") {
    console.warn("No image pattern found. The default pattern will be used.");
    set2(parameters, "imagePattern", "${filename}.${code}");
  }


  // maps the boolean parameters
  each([
    "joinShowText",
    "enableImages",
    "enableCustom",
    "customFallbacks"
  ], function (key,) {
    set2(
      parameters,
      key,
      bool(get2(params, key) || "true")
    )
  })

  Object.freeze(parameters);
}
