import {mapString, set2, setTo, string} from "@languages-plugin/shortcuts/mappers";
import {parameters} from "@languages-plugin/parameters";
import {LanguageOption} from "@languages-plugin/models/language-option";
import {KeyableObject} from "@jstls/types/core/objects";

/**
 * Generates a localized image filename suffix based on the language and image pattern.
 * Uses the imagePattern parameter to create filenames like "image.en.png" or "image_English.png".
 * @param language - The LanguageOption to generate the suffix for
 * @param filename - The base filename to apply the suffix to
 * @returns The filename with the language suffix applied
 */
export function suffixTo(language: LanguageOption, filename: string): string {
  const sources = setTo(language, ["code", "name", "label"], {filename});
  return mapString(parameters.imagePattern, sources);
}

/**
 * Extracts language properties from a filename suffix.
 * Parses a filename like "myImage.en" or "myImage.English" and extracts
 * the language code, name, or label based on the imagePattern.
 * @param suffix - The filename suffix to parse (e.g., ".en", ".English")
 * @returns A KeyableObject containing extracted properties (code, name, label, filename)
 */
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