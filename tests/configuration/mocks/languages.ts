import {vi} from 'vitest';
import {Promise} from "@jstls/core/polyfills/promise";
import {applyExtensions} from "@core-plugin/modules/extensions";

export const fetchJsonMock = vi.fn();

export const rawParameters = JSON.parse(
  '{"languages":"[\\"{\\\\\\"code\\\\\\":\\\\\\"default\\\\\\",\\\\\\"name\\\\\\":\\\\\\"English\\\\\\",\\\\\\"label\\\\\\":\\\\\\"Language\\\\\\"}\\",\\"{\\\\\\"code\\\\\\":\\\\\\"es\\\\\\",\\\\\\"name\\\\\\":\\\\\\"Español\\\\\\",\\\\\\"label\\\\\\":\\\\\\"Idioma\\\\\\"}\\"]","generationMode":"always","loadMode":"lang","folder":"data/languages","joinShowText":"true","joinSeparatorType":"unescaped","joinSeparator":"\\\\n\\\\r","enableImages":"true","imageMode":"lang","imagePattern":"${filename}.${code}","enableCustom":"false","customTexts":"{\\"option\\":\\"[\\\\\\"Save\\\\\\", \\\\\\"Load\\\\\\", \\\\\\"Cancel\\\\\\", \\\\\\"Delete\\\\\\", \\\\\\"Exit\\\\\\"]\\", \\"status\\":\\"[\\\\\\"On\\\\\\", \\\\\\"Off\\\\\\"]\\", \\"text\\":\\"[\\\\\\"Please select a file slot.\\\\\\", \\\\\\"Loads the data from the saved game.\\\\\\"]\\"}","customTrimmers":"{\\"option\\":\\"^(\\\\\\\\\\\\\\\\[A-Za-z]+\\\\\\\\[\\\\\\\\\\\\\\\\d+\\\\\\\\])+\\",\\"status\\":\\"^(\\\\\\\\\\\\\\\\[A-Za-z]+\\\\\\\\[\\\\\\\\\\\\\\\\d+\\\\\\\\])+\\",\\"text\\":\\"^(\\\\\\\\\\\\\\\\[A-Za-z]+\\\\\\\\[\\\\\\\\\\\\\\\\d+\\\\\\\\])+\\"}","customFallbacks":"false","customTargets":"no-default","enableEscapeTag":"false","escapeTagKey":"L","enableWrappingTag":"false","wrappingTagKey":"L","wrappingTagFormat":"curly"}'
)

vi.mock('@languages-plugin/shortcuts/requests', () => ({
  fetchJson: (...args: any[]) => Promise.resolve(fetchJsonMock(...args)),
  fetch: vi.fn(),
}));

vi.mock('@languages-plugin/shortcuts/env/logger', () => ({
  append: vi.fn(),
}));

export function setupLanguagesMocks() {
  applyExtensions();
}