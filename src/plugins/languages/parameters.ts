import {assign} from "./shortcuts/properties";
import {concat, get2, set2} from "./shortcuts/mappers";
import {each, each2, keach} from "./shortcuts/iterables";
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
  imagePattern: string;

  enableCustom: boolean;
  customTarget: CustomTextsTarget;
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
      if(key === "text" && isArray(value)) {
        each2(value as string[], function (value, index, arrayLike){
          let size = value.length >> 0;
          if(size > 2 && value[0] === '"' && value[size - 1] === '"') {
            arrayLike[index] = value.substring(1, size - 1);
          }
        });
      }



      set2(texts, key, value);
    });

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
    "enableCustom"
  ], function (key,) {
    set2(
      parameters,
      key,
      bool(get2(params, key) || "true")
    )
  })

}
