import {describe, expect, it} from 'vitest';
import {DefaultLanguage, jsonFilename, LanguageOption} from '@languages-plugin/models/language-option';

describe('LanguageOption', () => {
  describe('constructor – positional args', () => {
    it('stores code, name and label', () => {
      const lang = new LanguageOption('en', 'English', 'Language');
      expect(lang.code).toBe('en');
      expect(lang.name).toBe('English');
      expect(lang.label).toBe('Language');
    });

    it('coerces undefined to empty string', () => {
      const lang = new LanguageOption();
      expect(lang.code).toBe('');
      expect(lang.name).toBe('');
      expect(lang.label).toBe('');
    });
  });

  describe('constructor – object source', () => {
    it('copies properties from another LanguageOption', () => {
      const source = new LanguageOption('fr', 'Français', 'Langue');
      const copy = new LanguageOption(source);
      expect(copy.code).toBe('fr');
      expect(copy.name).toBe('Français');
      expect(copy.label).toBe('Langue');
    });
  });

  describe('valueOf / toString', () => {
    it('returns the language code', () => {
      const lang = new LanguageOption('es', 'Español', 'Idioma');
      expect(lang.valueOf()).toBe('es');
      expect(lang.toString()).toBe('es');
      expect(`${lang}`).toBe('es');
    });
  });

  describe('equals', () => {
    it('returns true for same code', () => {
      const a = new LanguageOption('en', 'English', 'Language');
      const b = new LanguageOption('en', 'Different Name', 'Different Label');
      expect(a.equals(b)).toBe(true);
    });

    it('returns false for different code', () => {
      const a = new LanguageOption('en', 'English', 'Language');
      const b = new LanguageOption('es', 'Español', 'Idioma');
      expect(a.equals(b)).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('serialises to {code, name, label}', () => {
      const lang = new LanguageOption('de', 'Deutsch', 'Sprache');
      const json = JSON.parse(JSON.stringify(lang));
      expect(json).toEqual({ code: 'de', name: 'Deutsch', label: 'Sprache' });
    });
  });

  describe('DefaultLanguage', () => {
    it('has code "default"', () => {
      expect(DefaultLanguage.code).toBe('default');
    });

    it('equals itself', () => {
      expect(DefaultLanguage.equals(DefaultLanguage)).toBe(true);
    });
  });
});

describe('jsonFilename', () => {
  it('generates correct path with folder', () => {
    const lang = new LanguageOption('en', 'English', 'Language');
    const result = jsonFilename(lang, 'data/languages');
    expect(result).toContain('en.json');
    expect(result).toContain('data');
  });

  it('works with empty folder', () => {
    const lang = new LanguageOption('jp', 'Japanese', 'Language');
    const result = jsonFilename(lang, '');
    expect(result).toContain('jp.json');
  });
});
