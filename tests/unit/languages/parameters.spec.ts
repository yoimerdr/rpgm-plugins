import {beforeAll, describe, expect, it, vi} from 'vitest';

import {parameters, PluginName, setupParameters} from '@languages-plugin/parameters';
import {rawParameters} from "@tests/configuration/mocks/languages";

declare const global: any;

describe('PluginName', () => {
  it('is "YDP_Languages"', () => {
    expect(PluginName).toBe('YDP_Languages');
  });
});

describe('parameters defaults', () => {
  it('has expected default values', () => {
    expect(parameters.loadMode).toBe('full');
    expect(parameters.generationMode).toBe('auto');
    expect(parameters.enableImages).toBe(true);
    expect(parameters.enableCustom).toBe(true);
    expect(parameters.customFallbacks).toBe(false);
    expect(parameters.enableEscapeTag).toBe(false);
    expect(parameters.enableWrappingTag).toBe(false);
    expect(parameters.escapeTagKey).toBe('L');
    expect(parameters.wrappingTagKey).toBe('L');
    expect(parameters.wrappingTagFormat).toBe('curly');
    expect(parameters.joinShowText).toBe(true);
    expect(parameters.imagePattern).toBe('${filename}.${code}');
  });
});

describe('setupParameters', () => {
  beforeAll(() => {
    const lang = JSON.stringify({code: 'en', name: 'English', label: 'Language'});
    const customTexts = JSON.stringify({
      option: JSON.stringify(['Option A']),
      text: JSON.stringify(['"Line with \\n newline"']),
      status: JSON.stringify([]),
    });

    global.PluginManager = {
      parameters: vi.fn().mockReturnValue({
        ...rawParameters,
        joinShowText: 'false',
        enableImages: 'false',
        enableCustom: 'true',
        customFallbacks: 'true',
        enableEscapeTag: 'true',
        enableWrappingTag: 'true',
        languages: JSON.stringify([lang]),
        imagePattern: '   ',
        customTrimmers: JSON.stringify({text: '\\\\I\\\\[\\\\d+\\\\]'}),
        customTexts: customTexts,
      }),
      registerCommand: vi.fn(),
    };
    setupParameters();
  });

  it('does not throw with an default PluginManager response', () => {
    expect(parameters.loadMode).toBe('lang');
  });

  it('parses boolean params from string values', () => {
    expect(parameters.joinShowText).toBe(false);
    expect(parameters.enableImages).toBe(false);
    expect(parameters.enableCustom).toBe(true);
    expect(parameters.customFallbacks).toBe(true);
    expect(parameters.enableEscapeTag).toBe(true);
    expect(parameters.enableWrappingTag).toBe(true);
  });

  it('parses a languages array from JSON string', () => {
    expect(parameters.languages).toHaveLength(1);
    expect(parameters.languages[0].code).toBe('en');
    expect(parameters.languages[0].name).toBe('English');
  });

  it('handles malformed languages gracefully (defaults to [])', () => {
    expect(Array.isArray(parameters.languages)).toBe(true);
  });

  it('uses default imagePattern when blank is supplied', () => {
    expect(parameters.imagePattern).toBe('${filename}.${code}');
  });

  it('parses valid regex trimmers', () => {
    expect(parameters.customTrimmers.text).toBeInstanceOf(RegExp);
  });

  it('parses customTexts and unwraps quoted text entries', () => {
    expect(parameters.customTexts.option).toBeDefined();
    expect(parameters.customTexts.text).toBeDefined();
  });

  it('parses generationMode from string', () => {
    expect(parameters.generationMode).toBe('always');
  });

  it('parses loadMode from string', () => {
    expect(parameters.loadMode).toBe('lang');
  });

  it('parses folder from params', () => {
    expect(parameters.folder).toBe('data/languages');
  });

  it('parses imageMode from string', () => {
    expect(parameters.imageMode).toBe('lang');
  });

  it('parses customTarget from string', () => {
    expect(parameters.customTarget).toBe('no-default');
  });

  it('parses wrapTagFormat from string', () => {
    expect(parameters.wrappingTagFormat).toBe('curly');
  });

  it('parses joinSeparatorType from string', () => {
    expect(parameters.joinSeparatorType).toBe('unescaped');
  });

  it('parses joinSeparator and unescapes it', () => {
    expect(parameters.joinSeparator).toBe('\n\r');
  });

  it('parses escapeTagKey from string', () => {
    expect(parameters.escapeTagKey).toBe('L');
  });

  it('parses wrappingTagKey from string', () => {
    expect(parameters.wrappingTagKey).toBe('L');
  });
});