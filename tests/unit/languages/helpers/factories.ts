import {LanguageOption} from '@languages-plugin/models/language-option';

export function makeLanguage(code: string, name = code, label = code) {
  return new LanguageOption(code, name, label);
}

export function makeLanguageSource(overrides: Record<string, any> = {}) {
  return {
    title: 'Test',
    terms: {},
    actors: [],
    armors: [],
    classes: [],
    commonEvents: {messages: {}},
    custom: {},
    enemies: [],
    equipTypes: [],
    images: {},
    items: [],
    maps: {},
    skillTypes: [],
    skills: [],
    states: [],
    troops: [],
    weaponTypes: [],
    weapons: [],
    ...overrides,
  } as any;
}
