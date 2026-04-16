import {beforeEach, describe, expect, it, vi} from 'vitest';

import {parameters} from '@languages-plugin/parameters';
import {DefaultLanguage, jsonFilename} from '@languages-plugin/models/language-option';
import {makeLanguage} from '@tests/unit/languages/helpers/factories';
import {resetLanguageTestParameters} from '@tests/unit/languages/helpers/language-test-state';
import {generateLanguageFiles, generateLanguagesFolder} from '@languages-plugin/files';

const mocks = vi.hoisted(() => {
  const manager = {
    existsSync: vi.fn(),
    mkdirSync: vi.fn(),
    readdirSync: vi.fn(),
    writeFileSync: vi.fn(),
    appendFileSync: vi.fn(),
    readFileSync: vi.fn(),
    statSync: vi.fn(),
  };

  return {
    manager,
    fsMock: vi.fn(() => manager),
    listMock: vi.fn(),
    loadMapFileMock: vi.fn(),
    loadMapCommandsMock: vi.fn(),
    createLanguageSourceMock: vi.fn(),
    createCustomTextsMock: vi.fn(),
    appendMock: vi.fn(),
  };
});

vi.mock('@languages-plugin/shortcuts/env/fm', () => ({
  fs: mocks.fsMock,
}));

vi.mock('@languages-plugin/shortcuts/images', () => ({
  list: mocks.listMock,
}));

vi.mock('@languages-plugin/files/map', () => ({
  loadMapFile: mocks.loadMapFileMock,
  loadMapCommands: mocks.loadMapCommandsMock,
}));

vi.mock('@languages-plugin/mappers/source', () => ({
  createLanguageSource: mocks.createLanguageSourceMock,
  createCustomTexts: mocks.createCustomTextsMock,
}));

vi.mock('@languages-plugin/shortcuts/env/logger', () => ({
  append: mocks.appendMock,
}));

const mkLang = makeLanguage;

function makeSource() {
  return {
    title: 'Base',
    terms: {},
    equipTypes: [],
    skillTypes: [],
    weaponTypes: [],
    classes: [],
    actors: [],
    enemies: [],
    troops: [],
    weapons: [],
    armors: [],
    items: [],
    skills: [],
    states: [],
    commonEvents: {messages: {}},
    maps: {},
    images: undefined,
    custom: undefined,
  } as any;
}

describe('languages/files/index', () => {
  const en = mkLang('en', 'English', 'Language');
  const es = mkLang('es', 'Espanol', 'Idioma');

  beforeEach(() => {
    vi.clearAllMocks();
    resetLanguageTestParameters();

    parameters.folder = 'data/languages';
    parameters.languages = [DefaultLanguage, en, es];
    parameters.generationMode = 'always';
    parameters.enableImages = true;
    parameters.imageMode = 'lang';
    parameters.enableCustom = true;
    parameters.customTarget = 'all';
    parameters.imagePattern = '${filename}.${code}';

    (globalThis as any).Utils = {
      isNwjs: vi.fn(() => true),
      isOptionValid: vi.fn((value: string) => value === 'test'),
    };

    mocks.manager.existsSync.mockReturnValue(false);
    mocks.manager.readdirSync.mockReturnValue([]);
    mocks.listMock.mockReturnValue([]);
    mocks.createLanguageSourceMock.mockImplementation(makeSource);
    mocks.createCustomTextsMock.mockReturnValue({text: {hello: 'hello'}});
    mocks.loadMapFileMock.mockReturnValue(undefined);
    mocks.loadMapCommandsMock.mockReturnValue({});
  });

  it('creates the languages folder using Filepath.mkdir', () => {
    generateLanguagesFolder();
    expect(mocks.fsMock).toHaveBeenCalled();
    expect(mocks.manager.mkdirSync).toHaveBeenCalledWith('data/languages');
  });

  it('skips generation when not running in NW.js', () => {
    (globalThis as any).Utils.isNwjs = vi.fn(() => false);
    generateLanguageFiles();
    expect(mocks.manager.writeFileSync).not.toHaveBeenCalled();
  });

  it('skips generation when test option is disabled', () => {
    (globalThis as any).Utils.isOptionValid = vi.fn(() => false);
    generateLanguageFiles();
    expect(mocks.manager.writeFileSync).not.toHaveBeenCalled();
  });

  it('skips generation when mode is none', () => {
    parameters.generationMode = 'none';
    generateLanguageFiles();
    expect(mocks.manager.writeFileSync).not.toHaveBeenCalled();
  });

  it('respects auto mode when default language file already exists', () => {
    parameters.generationMode = 'auto';
    const defaultFile = jsonFilename(DefaultLanguage, parameters.folder);
    mocks.manager.existsSync.mockImplementation((file: string) => file === defaultFile);
    generateLanguageFiles();
    expect(mocks.manager.writeFileSync).not.toHaveBeenCalled();
  });

  it('generates source, maps, images and custom texts for language files', () => {
    const map001 = {
      id: 1,
      displayName: 'Town',
      events: [],
    } as unknown as DataMap;
    const map002 = {
      id: 2,
      displayName: 'Forest',
      events: [],
    } as unknown as DataMap;

    mocks.manager.readdirSync.mockReturnValue([
      'Map001.json',
      'Map002.json',
      'MapABC.json',
      'MapInfo.json',
      'Actors.json',
    ]);

    mocks.loadMapFileMock.mockImplementation((filename: string) => {
      if (filename === 'Map001.json') return map001;
      if (filename === 'Map002.json') return map002;
      return undefined;
    });

    mocks.loadMapCommandsMock.mockImplementation((map: any) => {
      if (map === map001) {
        return {1: {0: {p: ['hello'], l: 1}}};
      }
      if (map === map002) {
        return {};
      }
      return {};
    });

    mocks.listMock.mockReturnValue([
      'img/pictures/plain.png',
      'img/pictures/bg.en.png',
    ]);

    generateLanguageFiles();

    expect(mocks.listMock).toHaveBeenCalledWith('img', mocks.manager);
    expect(mocks.createCustomTextsMock).toHaveBeenCalledTimes(1);
    expect(mocks.manager.writeFileSync).toHaveBeenCalledTimes(3);

    const firstPayload = mocks.manager.writeFileSync.mock.calls[0][1];
    const parsed = JSON.parse(firstPayload);
    expect(parsed.maps[1]).toBeDefined();

    const esPayload = mocks.manager.writeFileSync.mock.calls[2][1];
    const esParsed = JSON.parse(esPayload);
    expect(esParsed.images.img.pictures.bg).toBe('bg.en');
  });

  it('loads custom texts after writing default file when target is not all', () => {
    parameters.customTarget = 'no-default';
    generateLanguageFiles();
    expect(mocks.createCustomTextsMock).toHaveBeenCalledTimes(1);
    expect(mocks.manager.writeFileSync).toHaveBeenCalledTimes(3);
  });

  it('does not call image listing when image support is disabled', () => {
    parameters.enableImages = false;
    generateLanguageFiles();
    expect(mocks.listMock).not.toHaveBeenCalled();
  });

  it('supports imageMode all branch', () => {
    parameters.imageMode = 'all';
    mocks.listMock.mockReturnValue(['img/pictures/any.png']);
    generateLanguageFiles();

    const enPayload = mocks.manager.writeFileSync.mock.calls[1][1];
    const enParsed = JSON.parse(enPayload);
    expect(enParsed.images.img.pictures.any).toBe('any');
  });
});
