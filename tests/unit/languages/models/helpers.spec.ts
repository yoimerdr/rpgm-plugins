import {describe, expect, it} from 'vitest';

import {extractFromSuffix, suffixTo} from '@languages-plugin/models/helpers';
import {LanguageOption} from '@languages-plugin/models/language-option';

const en = new LanguageOption('en', 'English', 'Language');
const es = new LanguageOption('es', 'Español', 'Idioma');

describe('suffixTo', () => {
  it('generates filename with language code suffix', () => {
    const result = suffixTo(en, 'myImage');
    expect(result).toBe('myImage.en');
  });

  it('uses empty string as filename when passed empty', () => {
    const result = suffixTo(en, '');
    expect(result).toBe('.en');
  });

  it('works with different language codes', () => {
    expect(suffixTo(es, 'bg')).toBe('bg.es');
  });
});

describe('extractFromSuffix', () => {
  it('extracts code from a filename that matches the pattern', () => {
    const result = extractFromSuffix('myImage.en');
    expect(result.filename).toBe('myImage');
    expect(result.code).toBe('en');
  });

  it('returns empty object for non-matching string', () => {
    const result = extractFromSuffix('nope');
    expect(result).toEqual({});
  });

  it('returns empty object for empty string', () => {
    const result = extractFromSuffix('');
    expect(result).toEqual({});
  });
});