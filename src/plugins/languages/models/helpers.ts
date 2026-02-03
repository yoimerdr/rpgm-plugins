import {mapString, set2, setTo, string} from "@languages-plugin/shortcuts/mappers";
import {parameters} from "@languages-plugin/parameters";
import {LanguageOption} from "@languages-plugin/models/language-option";
import {KeyableObject} from "@jstls/types/core/objects";

export function suffixTo(language: LanguageOption, filename: string): string {
  const sources = setTo(language, ["code", "name", "label"], {filename});
  return mapString(parameters.imagePattern, sources);
}

export function extractFromSuffix(suffix: string): KeyableObject {
  const keys: string[] = [],
    escaped = parameters.imagePattern.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
    pattern = escaped.replace(/\\\$\\\{(\w+)\\\}/g, (_, key) => {
      keys.push(key);
      return "(.+?)";
    });

  suffix = string(suffix)

  const regex = new RegExp(`^${pattern}$`),
    match = suffix.match(regex);

  if (!match) return {};

  return keys.reduce((acc, key, index) => {
    set2(acc, key, match[index + 1]);
    return acc;
  }, {});
}