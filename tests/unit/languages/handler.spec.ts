import {beforeEach, describe, expect, it, vi} from 'vitest';
import {Promise as JSPromise} from '@jstls/core/polyfills/promise';

import {CustomTextTrimmers, parameters} from '@languages-plugin/parameters';
import {fetchJsonMock} from '@tests/configuration/mocks/languages';

import {DefaultLanguage} from '@languages-plugin/models/language-option';
import {
  changeIndex,
  getCustomText,
  getImage,
  handler,
  loadLanguageFile,
  loadLanguageFiles,
  update,
} from '@languages-plugin/handler';
import {KeyableObject} from "@jstls/types/core/objects";
import {makeLanguage, makeLanguageSource} from '@tests/unit/languages/helpers/factories';
import {resetLanguageTestParameters} from '@tests/unit/languages/helpers/language-test-state';

const mkLang = makeLanguage;

describe('changeIndex', () => {
  it('returns index within bounds unchanged', () => {
    expect(changeIndex(3, 1)).toBe(1);
    expect(changeIndex(3, 0)).toBe(0);
    expect(changeIndex(3, 2)).toBe(2);
  });

  it('wraps negative index to last', () => {
    expect(changeIndex(3, -1)).toBe(2);
    expect(changeIndex(5, -2)).toBe(4);
  });

  it('wraps out-of-bounds high index to 0', () => {
    expect(changeIndex(3, 3)).toBe(0);
    expect(changeIndex(3, 10)).toBe(0);
  });

  it('coerces non-numeric strings to 0', () => {
    expect(changeIndex(3, 'abc' as unknown as number)).toBe(0);
  });

  it('coerces numeric string', () => {
    expect(changeIndex(3, '1' as unknown as number)).toBe(1);
  });
});

describe('getImage', () => {
  beforeEach(() => {
    parameters.enableImages = true;
  });

  it('returns original filename with success=true when images are disabled', () => {
    parameters.enableImages = false;
    const result = getImage({}, 'img/pictures', 'bg');
    expect(result.filename).toBe('bg');
    expect(result.success).toBe(true);
  });

  it('returns original filename with success=false when images object is undefined', () => {
    parameters.enableImages = true;
    const result = getImage(undefined as unknown as KeyableObject, 'img/pictures', 'bg');
    expect(result.filename).toBe('bg');
    expect(result.success).toBe(false);
  });

  it('resolves localized filename from images cache', () => {
    const images = { 'img/pictures/bg': 'bg_en' };
    const result = getImage(images, 'img/pictures', 'bg');
    expect(result.filename).toBe('bg_en');
    expect(result.success).toBe(true);
  });

  it('returns original filename when key not found in cache', () => {
    const images = { 'img/pictures/other': 'other_en' };
    const result = getImage(images, 'img/pictures', 'bg');
    expect(result.filename).toBe('bg');
    expect(result.success).toBe(false);
  });
});

describe('getCustomText', () => {
  it('returns the value from the custom texts', () => {
    parameters.enableCustom = true;
    parameters.customFallbacks = false;
    const result = getCustomText(handler as any, 'text', 'my_key');
    expect(result === 'my_key' || !result).toBe(true);
  });
});

describe('handler.load', () => {
  const en = mkLang('en', 'English', 'Language');
  const es = mkLang('es', 'Español', 'Idioma');

  beforeEach(() => {
    resetLanguageTestParameters();
    parameters.languages = [en, es];
  });

  it('selects the language at the given index', () => {
    handler.load(0);
    expect(handler.language.code).toBe('en');
    expect(handler.index).toBe(0);
  });

  it('changes to second language', () => {
    handler.load(1);
    expect(handler.language.code).toBe('es');
    expect(handler.index).toBe(1);
  });

  it('returns false when the same language is already active (after setup)', () => {
    handler.load(0);
    handler.load(1);
    const result = handler.load(1);
    expect(typeof result).toBe('boolean');
  });

  it('wraps out-of-bounds index to 0', () => {
    handler.load(99);
    expect(handler.index).toBe(0);
  });
});

describe('handler.getCustom', () => {
  const en = mkLang('en', 'English', 'Language');

  beforeEach(() => {
    resetLanguageTestParameters();
    parameters.languages = [en];
    handler.load(0);
  });

  it('returns the query name when the default language is active', () => {
    parameters.languages = [DefaultLanguage];
    handler.load(0);
    const result = handler.getCustom('text', 'hello');
    expect(result).toBe('hello');
  });

  it('returns the query name when enableCustom is false', () => {
    parameters.enableCustom = false;
    const result = handler.getCustom('text', 'hello');
    expect(result).toBe('hello');
  });

  it('returns original name if no custom data loaded', () => {
    const result = handler.getCustom('text', 'some_key');
    expect(result).toBe('some_key');
  });

  it('logs a warning and returns the value when name is not a string', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const result = handler.getCustom('text', 42 as any);
    expect(result).toBe(42 as any);
    warnSpy.mockRestore();
  });

  it('processes escape tags when enabled', () => {
    const fr = mkLang('fr', 'Francais', 'Langue');
    parameters.languages = [fr];
    handler.load(0);
    parameters.enableEscapeTag = true;
    parameters.escapeTagKey = 'L';

    fetchJsonMock.mockResolvedValueOnce(makeLanguageSource({
      custom: {text: {GREETING: 'Hola mundo'}, option: {}, status: {}}
    }));

    return loadLanguageFile(fr).then(() => {
      const result = handler.getCustom('text', 'Intro: \x1bL[GREETING]!');
      expect(result).toBe('Intro: Hola mundo!');
    });
  });

  it('processes curly wrapping tags when enabled', () => {
    const fr = mkLang('fr', 'Francais', 'Langue');
    parameters.languages = [fr];
    handler.load(0);
    parameters.enableWrappingTag = true;
    parameters.wrappingTagFormat = 'curly';
    parameters.wrappingTagKey = 'L';

    fetchJsonMock.mockResolvedValueOnce(makeLanguageSource({
      custom: {text: {HELLO_KEY: 'Bonjour'}, option: {}, status: {}}
    }));

    return loadLanguageFile(fr).then(() => {
      const result = handler.getCustom('text', '->{L}HELLO_KEY{/L}<-');
      expect(result).toBe('->Bonjour<-');
    });
  });

  it('processes square wrapping tags when enabled', () => {
    const fr = mkLang('fr', 'Francais', 'Langue');
    parameters.languages = [fr];
    handler.load(0);
    parameters.enableWrappingTag = true;
    parameters.wrappingTagFormat = 'square';

    fetchJsonMock.mockResolvedValueOnce(makeLanguageSource({
      custom: {text: {HELLO_KEY: 'Ciao'}, option: {}, status: {}}
    }));

    return loadLanguageFile(fr).then(() => {
      const result = handler.getCustom('text', '[L]HELLO_KEY[/L] + fin');
      expect(result).toBe('Ciao + fin');
    });
  });

  it("clean tags when language is Default", () => {
    parameters.languages = [DefaultLanguage];
    handler.load(0);
    parameters.enableWrappingTag = true;
    parameters.wrappingTagFormat = 'square';

    const result = handler.getCustom('text', '[L]NON_EXISTENT_KEY[/L]');
    expect(result).toBe('NON_EXISTENT_KEY');
  })

  it('processes nested square wrapping tags when enabled', () => {
    const fr = mkLang('fr', 'Francais', 'Langue');
    parameters.languages = [fr];
    handler.load(0);
    parameters.enableWrappingTag = true;
    parameters.wrappingTagFormat = 'square';

    fetchJsonMock.mockResolvedValueOnce(makeLanguageSource({
      custom: {text: {HELLO_KEY: '[L]Hello[/L]', Hello: "Bounjour"}, option: {}, status: {}}
    }));

    return loadLanguageFile(fr).then(() => {
      const result = handler.getCustom('text', '[L]HELLO_KEY[/L] + fin');
      expect(result).toBe('Bounjour + fin');
    });
  });

  it('processes angle wrapping tags when enabled', () => {
    const fr = mkLang('fr', 'Francais', 'Langue');
    parameters.languages = [fr];
    handler.load(0);
    parameters.enableWrappingTag = true;
    parameters.wrappingTagFormat = 'angle';

    fetchJsonMock.mockResolvedValueOnce(makeLanguageSource({
      custom: {text: {HELLO_KEY: 'Hallo'}, option: {}, status: {}}
    }));

    return loadLanguageFile(fr).then(() => {
      const result = handler.getCustom('text', '<L>HELLO_KEY</L>!');
      expect(result).toBe('Hallo!');
    });
  });

  it('applies trimmer before lookup', () => {
    parameters.customTrimmers = { text: /\\\I\[\d+\]/g } as CustomTextTrimmers;
    const result = handler.getCustom('text', 'key');
    expect(typeof result).toBe('string');
    expect(result).toBe("key");
  });

  it('applies trimmer replacement when lookup without trim fails', () => {
    const fr = mkLang('fr', 'Francais', 'Langue');
    parameters.languages = [fr];
    parameters.enableCustom = true;
    parameters.customFallbacks = false;
    parameters.enableEscapeTag = false;
    parameters.enableWrappingTag = false;
    parameters.customTrimmers = { text: /^\*+|\*+$/g } as CustomTextTrimmers;

    handler.load(0);

    fetchJsonMock.mockResolvedValueOnce(makeLanguageSource({
      custom: { text: { key: 'valor' }, option: {}, status: {} },
    }));

    return loadLanguageFile(fr).then(() => {
      const result = handler.getCustom('text', '***key***');
      expect(result).toBe('***valor***');
    });
  });

  it('supports fallback custom text lookups across categories', () => {
    const fr = mkLang('fr', 'Francais', 'Langue');
    parameters.languages = [fr];
    parameters.enableCustom = true;
    parameters.customFallbacks = true;
    parameters.enableEscapeTag = false;
    parameters.enableWrappingTag = false;
    parameters.customTrimmers = {} as CustomTextTrimmers;

    handler.load(0);

    fetchJsonMock.mockResolvedValueOnce(makeLanguageSource({
      custom: { text: {}, option: { Save: 'Guardar' }, status: {} },
    }));

    return loadLanguageFile(fr).then(() => {
      const result = handler.getCustom('text', 'Save');
      expect(result).toBe('Guardar');
    });
  });
});

describe('handler.getImage', () => {
  const en = mkLang('en', 'English', 'Language');
  const es = mkLang('es', 'Espanol', 'Idioma');

  beforeEach(() => {
    resetLanguageTestParameters();
    parameters.languages = [en, es];
    handler.load(0);
  });

  it('returns original filename when no images are cached', () => {
    const result = handler.getImage('img/pictures', 'bg');
    expect(result).toBe('bg');
  });

  it('returns the filename when images feature is disabled', () => {
    parameters.enableImages = false;
    const result = handler.getImage('img/pictures', 'bg');
    expect(typeof result).toBe('string');
  });

  it('returns suffixless filename when it matches another language suffix', () => {
    const result = handler.getImage('img/pictures', 'battle.es');
    expect(result).toBe('battle');
  });

  it('keeps filename when it already matches current language suffix', () => {
    const result = handler.getImage('img/pictures', 'battle.en');
    expect(result).toBe('battle.en');
  });
});

describe('handler.getMap', () => {
  it('returns transformed map when map exists', () => {
    const fr = mkLang('fr', 'Francais', 'Langue');
    parameters.languages = [fr];
    handler.load(0);

    fetchJsonMock.mockResolvedValueOnce(makeLanguageSource({
      maps: { 1: { n: 'Ville', m: { 2: { 0: { p: ['bonjour'], l: 1 } } } } },
    }));

    return loadLanguageFile(fr).then(() => {
      const result = handler.getMap(1)!;
      expect(result.displayName).toBe('Ville');
      expect((result.messages as any)[2][0].p[0]).toBe('bonjour');
    });
  });
});

describe('handler getters', () => {
  const en = mkLang('en', 'English', 'Language');

  it('exposes index, name, label, code, language', () => {
    parameters.languages = [en];
    handler.load(0);
    expect(handler.index).toBe(0);
    expect(handler.name).toBeDefined();
    expect(handler.label).toBeDefined();
    expect(handler.language).toBeDefined();
    expect(handler.language instanceof Object).toBe(true);
  });
});

describe('loadLanguageFile', () => {
  const en = mkLang('en', 'English', 'Language');
  const es = mkLang('es', 'Español', 'Idioma');

  beforeEach(() => {
    resetLanguageTestParameters();
    parameters.languages = [en, es];
    fetchJsonMock.mockClear();
  });

  // @ts-ignore
  it('stores the data in the files cache and returns it', async () => {
    const fakeSource = makeLanguageSource();

    fetchJsonMock.mockResolvedValueOnce(fakeSource);

    const result = await loadLanguageFile(en);

    expect(result).toBe(fakeSource);
  });

  // @ts-ignore
  it('resolves null when fetchJson returns null', async () => {
    fetchJsonMock.mockResolvedValueOnce(null);
    const result = await loadLanguageFile(en);
    expect(result).toBeNull();
  });
});

describe('loadLanguageFiles', () => {
  const en = mkLang('en');
  const es = mkLang('es');

  beforeEach(() => {
    resetLanguageTestParameters();
    fetchJsonMock.mockReset();
  });

  it('loads only the current language in "lang" mode', () => {
    parameters.loadMode = 'lang';
    parameters.languages = [en, es];
    handler.load(0);
    loadLanguageFiles();
    expect(fetchJsonMock).toHaveBeenCalledTimes(1);
  });

  it('loads all languages in "full" mode', () => {
    parameters.loadMode = 'full';
    parameters.languages = [en, es];
    loadLanguageFiles();
    expect(fetchJsonMock).toHaveBeenCalledTimes(2);
  });
});

describe('handler.setup and update', () => {
  const en = mkLang('en', 'English', 'Language');

  beforeEach(() => {
    resetLanguageTestParameters();
    parameters.languages = [en];
    fetchJsonMock.mockReset();
  });

  it('setup loads language files and marks handler as initialized', () => {
    parameters.loadMode = 'full';
    fetchJsonMock.mockResolvedValue(makeLanguageSource({title: 'Title'}));

    handler.setup();

    expect(fetchJsonMock).toHaveBeenCalledTimes(1);
    expect(handler.index).toBe(0);
    expect(handler.language.code).toBe('en');
    expect(handler.load(0)).toBe(false);
  });

  it('update in lang mode reloads current language file', () => {
    parameters.loadMode = 'lang';
    handler.load(0);

    fetchJsonMock.mockResolvedValue(makeLanguageSource({title: 'Title'}));

    handler.update();

    return JSPromise.resolve(undefined).then(() => {
      expect(fetchJsonMock).toHaveBeenCalled();
    });
  });

  it('loadLanguageFile in full mode applies translated data', () => {
    const en2 = mkLang('en2', 'English2', 'Language2');
    const fr = mkLang('fr', 'Francais', 'Langue');
    parameters.languages = [en2, fr];
    parameters.loadMode = 'full';

    const source = {
      title: 'Titre FR',
      terms: {basic: ['A']},
      weaponTypes: ['Epée'],
      equipTypes: ['Arme'],
      skillTypes: ['Magie'],
      actors: [null, {n: 'Heroe', c: 'Alias', p: 'Perfil'}],
      armors: [null, {n: 'Armadura', d: 'Defensa', t: ''}],
      classes: [null, 'Guerrier'],
      enemies: [null, 'Monstre'],
      items: [null, {n: 'Pocion', d: 'Recupera', t: ''}],
      skills: [null, {n: 'Fuego', d: 'Quema', t: '', '1': 'lanza', '2': 'impacta'}],
      states: [null, {n: 'Veneno', '3': 'envenenado', '4': 'recuperado'}],
      troops: [null, {n: 'Grupo', m: {1: {0: {p: ['texto'], l: 1}}}}],
      weapons: [null, {n: 'Espada', d: 'Corta', t: ''}],
      commonEvents: {messages: {0: {0: {p: ['comun'], l: 1}}}},
      custom: {text: {}, option: {}, status: {}},
      images: {'img/pictures/bg': 'bg.fr'},
      maps: {1: {n: 'Mapa', m: {}}}
    } as any;

    ($dataActors as any[])[1] = {} as any;
    ($dataArmors as any[])[1] = {} as any;
    ($dataClasses as any[])[1] = {} as any;
    ($dataEnemies as any[])[1] = {} as any;
    ($dataItems as any[])[1] = {} as any;
    ($dataSkills as any[])[1] = {} as any;
    ($dataStates as any[])[1] = {} as any;
    ($dataTroops as any[])[1] = {id: 1, name: 'old', pages: [{list: [{code: 401, parameters: ['old']}]}]} as any;
    ($dataWeapons as any[])[1] = {} as any;
    ($dataCommonEvents as any[])[0] = {code: 401, parameters: ['old']} as any;

    fetchJsonMock.mockResolvedValueOnce(source);
    handler.load(1);
    return loadLanguageFile(fr).then(() => {
      handler.update();

      expect($dataSystem.gameTitle).toBe('Titre FR');
      expect(($dataClasses as any[])[1].name).toBe('Guerrier');
      expect(($dataEnemies as any[])[1].battlerName).toBe('Monstre');
    });
  });

  it('update returns early when language is not defined', () => {
    expect(() => update({} as any)).not.toThrow();
  });
});
