import {assign} from "./shortcuts/properties";
import {concat, get2, set2} from "./shortcuts/mappers";
import {boolParameter} from "@core-plugin/modules/parameters";
import {each} from "./shortcuts/iterables";
import {getIf, returns} from "./shortcuts/validations";
import {isArray} from "@jstls/core/shortcuts/array";
import {LanguageOption} from "./models/language-option";
import {join} from "@languages-plugin/shortcuts/env/path";

export type GenerateLanguageMode = "auto" | "always" | "none";

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

    enableCustom: true
  } as Parameters;

  assign(parameters, params);
  // validates the separator type for the join.
  parameters.joinSeparatorType === "unescaped" &&
  set2(parameters, "joinSeparator", JSON.parse(concat("\"", parameters.joinSeparator, "\"")));

  // maps the languages parameter
  set2(
    parameters,
    "languages",
    (getIf(JSON.parse(params.languages), isArray, returns([])))
      .map(function (value: string) {
        return new LanguageOption(JSON.parse(value));
      })
  );

  // maps the boolean parameters
  each([
    "joinShowText",
    "enableImages",
    "enableCustom"
  ], function (key,) {
    set2(
      parameters,
      key,
      boolParameter(get2(params, key) || "true")
    )
  })

}
