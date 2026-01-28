import {assign} from "./shortcuts/properties";
import {concat, get2, set2} from "./shortcuts/mappers";
import {each, keach} from "./shortcuts/iterables";
import {getIf, isString, returns} from "./shortcuts/validations";
import {isArray} from "@jstls/core/shortcuts/array";
import {LanguageOption} from "./models/language-option";
import {join} from "@languages-plugin/shortcuts/env/path";
import {bool} from "@languages-plugin/shortcuts/parameters";
import {freeze} from "@jstls/core/shortcuts/object";

export type GenerateLanguageMode = "auto" | "always" | "none";
export type CustomTextsTarget = "all" | "no-default";

export interface CustomTexts {
  readonly option: string[];
  readonly status: string[];
  readonly text: string[];
}

export interface Parameters {
  languages: readonly LanguageOption[]
  generationMode: GenerateLanguageMode;
  loadMode: "full" | "lang";
  folder: string;

  joinShowText: boolean;
  joinSeparator: string;
  joinSeparatorType: "strict" | "unescaped";

  enableImages: boolean;
  imageMode: "all" | "lang",

  enableCustom: boolean;
  customTarget: CustomTextsTarget;
  customTexts: CustomTexts;
}

export const PluginName = "YDP_Languages",
  parameters: Parameters = {} as Parameters;

export function setupParameters() {
  // load the plugin parameters
  const params = PluginManager.parameters(PluginName) || {
    languages: [] as readonly LanguageOption[],
    generationMode: "auto",
    loadMode: "full",
    folder: join("data", "languages"),

    joinShowText: true,
    joinSeparator: "\n",
    joinSeparatorType: "unescaped",

    enableImages: true,
    imageMode: "lang",

    enableCustom: true,
    customTexts: {},
    customTarget: "no-default",
  } as Parameters;

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
      set2(texts, key, isString(value) ? JSON.parse(value as string) : value);
    });

    set2(
      parameters,
      "customTexts",
      freeze(texts),
    );
  } catch (e) {
    console.error(e);
  }


  // maps the boolean parameters
  each([
    "joinShowText",
    "enableImages",
    "enableCustom"
  ], function (key,) {
    set2(
      parameters,
      key,
      bool(get2(params, key) || "true")
    )
  })

}
