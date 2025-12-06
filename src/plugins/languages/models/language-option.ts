import {WithPrototype} from "@jstls/types/core/objects";
import {funclass, partialMethod} from "@languages-plugin/shortcuts/cls";
import {isObject} from "@languages-plugin/shortcuts/validations";
import {getprop, readonlys2} from "@languages-plugin/shortcuts/properties";
import {concat, setTo, string} from "@languages-plugin/shortcuts/mappers";
import {join} from "@languages-plugin/shortcuts/env/path";
import {JsonSerializable} from "@languages-plugin/lib";
import {rawExtensions} from "@languages-plugin/shortcuts/images";

export interface LanguageOption extends JsonSerializable {
  readonly code: string;
  readonly name: string;
  readonly label: string;

  valueOf(): string;

  toString(): string;

  equals(other: LanguageOption): boolean;
}

export interface LanguageOptionConstructor extends WithPrototype<LanguageOption> {
  new(code?: string, name?: string, label?: string): LanguageOption;

  new(source?: LanguageOption): LanguageOption
}

const getCode = partialMethod(getprop<LanguageOption>, "code");

export function suffixTo(language: LanguageOption, text?: string): string {
  return concat(string(text), "_", language.code);
}

export function jsonFilename(language: LanguageOption, folder?: string): string {
  return join(string(folder), language.code + ".json");
}

export function imageExtensions(language: LanguageOption): string[] {
  return rawExtensions.map(function (ext) {
    return suffixTo(language) + ext;
  });
}

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


export const DefaultLanguage = new LanguageOption("default", "Default", "Default")
