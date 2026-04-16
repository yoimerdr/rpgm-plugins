import {vi} from 'vitest';

declare const global: any;

function makeArray<T>(length = 3): T[] {
  return Array.from({ length }, () => null as unknown as T);
}

export interface MockRpgMakerEnvOptions {
  mockGameSystem?: boolean;
  mockPluginManager?: boolean;
}

export interface MockRpgMakerDataOptions {
  dataActors?: number;
  dataClasses?: number;
  dataSkills?: number;
  dataItems?: number;
  dataWeapons?: number;
  dataArmors?: number;
  dataEnemies?: number;
  dataTroops?: number;
  dataStates?: number;
  dataAnimations?: number;
  dataTilesets?: number;
  dataCommonEvents?: number;
}

export interface MockRpgMakerGameOptions {
  gameVariables?: number;
  gameSwitches?: number;
}

export interface MockRpgMakerOptions {
  mockData?: boolean | MockRpgMakerDataOptions;
  mockGame?: boolean | MockRpgMakerGameOptions;
}

const defaultDataOptions: Required<MockRpgMakerDataOptions> = {
  dataActors: 3,
  dataClasses: 3,
  dataSkills: 3,
  dataItems: 3,
  dataWeapons: 3,
  dataArmors: 3,
  dataEnemies: 3,
  dataTroops: 3,
  dataStates: 3,
  dataAnimations: 3,
  dataTilesets: 3,
  dataCommonEvents: 3,
};

const defaultGameOptions: Required<MockRpgMakerGameOptions> = {
  gameVariables: 3,
  gameSwitches: 3,
};

/**
 * Mocks the RPG Maker PluginManager global.
 */
export function mockPluginManager() {
  const PluginManager = {
    parameters: vi.fn().mockReturnValue({}),
    registerCommand: vi.fn(),
    setup: vi.fn(),
  };

  if (typeof global !== 'undefined') {
    (global as any).PluginManager = PluginManager;
  }
  if (typeof window !== 'undefined') {
    (window as any).PluginManager = PluginManager;
  }

  return PluginManager;
}

/**
 * Sets up a mocked RPG Maker environment required by core plugins.
 *
 * @param options configuration options for what should be mocked.
 */
export function mockRpgMakerEnvironment(options: MockRpgMakerEnvOptions = {}) {
  const opts = {mockPluginManager: true, ...options};

  if (opts.mockPluginManager) {
    mockPluginManager();
  }

  // Basic window mock if needed by browser-specific logic when running in node
  if (typeof global !== 'undefined' && typeof window === 'undefined') {
    (global as any).window = global;
  }
  
  if (typeof global !== 'undefined' && typeof document === 'undefined') {
    (global as any).document = {
      body: {},
      documentElement: {},
      createElement: () => ({})
    };
  }

  if (typeof global !== 'undefined') {
    if (typeof location === 'undefined') {
      (global as any).location = { href: '', pathname: '', search: '', hash: '' };
    }
    if (typeof navigator === 'undefined') {
      try {
        (global as any).navigator = { userAgent: 'node.js' };
      } catch (e) {
         Object.defineProperty(global, 'navigator', { value: { userAgent: 'node.js' }, writable: true, configurable: true });
      }
    }
    if (typeof history === 'undefined') {
      (global as any).history = { pushState: () => {}, replaceState: () => {} };
    }
    if (typeof XMLHttpRequest === 'undefined') {
      (global as any).XMLHttpRequest = class MockXMLHttpRequest {
        status = 200;
        response = '{}';
        headers: any = {};
        onload() {}
        onerror() {}
        open() {}
        send() { setTimeout(() => this.onload(), 0); }
        setRequestHeader(k: string, v: string) { this.headers[k] = v; }
        overrideMimeType() {}
      };
    }
  }

  // @ts-ignore
  Array.prototype.contains = Array.prototype.includes;

  // @ts-ignore
  Array.prototype.clone = function (this: Array<an>) {
    return this.slice(0)
  };

  // @ts-ignore
  Array.prototype.equals = function (this: Array<an>, other: Array<an>) {
    if (this.length !== other.length) return false;
    for (let i = 0; i < this.length; i++) {
      if (this[i] !== other[i]) return false;
    }
    return true;
  }
}

export const createMockGameVariables = (count: number) => {
  const data = Array.from({ length: count + 1 }, () => 0) as number[];
  return {
    _data: data,
    _initialValue: 0,
    initialize: vi.fn(),
    clear: vi.fn(),
    value: vi.fn((variableId: number) => data[variableId] ?? 0),
    setValue: vi.fn((variableId: number, value: number) => {
      data[variableId] = value;
    }),
    increase: vi.fn((variableId: number, value: number) => {
      data[variableId] = (data[variableId] ?? 0) + value;
    }),
    callOnChange: vi.fn(),
  };
};

export const createMockGameSwitches = (count: number) => {
  const data = Array.from({ length: count + 1 }, () => false) as boolean[];
  return {
    _data: data,
    initialize: vi.fn(),
    clear: vi.fn(),
    value: vi.fn((switchId: number) => data[switchId] ?? false),
    setValue: vi.fn((switchId: number, value: boolean) => {
      data[switchId] = value;
    }),
    onChange: vi.fn(),
  };
};

export const createMockGameSystem = () => {
  const state = {
    savefileId: 0,
    versionId: 1,
    isSideView: false,
    canSave: true,
    canMenu: true,
    encounterEnabled: true,
    formationEnabled: true,
    saveCount: 0,
    battleCount: 0,
    winCount: 0,
    loseCount: 0,
  };
  return {
    _savefileId: state.savefileId,
    _versionId: state.versionId,
    _isSideView: state.isSideView,
    _hasPlaytested: false,
    _eventId: 1,
    _mapId: 1,
    _canSave: state.canSave,
    _canMenu: state.canMenu,
    _encounterEnabled: state.encounterEnabled,
    _formationEnabled: state.formationEnabled,
    _saveCount: state.saveCount,
    _titleScreenX: 0,
    _lastUsedSavefileId: 0,
    _battleCount: state.battleCount,
    _winCount: state.winCount,
    _loseCount: state.loseCount,
    getSavefileId: vi.fn(() => state.savefileId),
    setSavefileId: vi.fn((id: number) => { state.savefileId = id; }),
    isSideView: vi.fn(() => state.isSideView),
    isSaveEnabled: vi.fn(() => state.canSave),
    isMenuEnabled: vi.fn(() => state.canMenu),
    isEncounterEnabled: vi.fn(() => state.encounterEnabled),
    battleBgm: vi.fn(() => ({ name: '', volume: 90, pitch: 100, pan: 0 })),
    mainFontFace: vi.fn(() => 'rmg-main'),
    mainFontSize: vi.fn(() => 28),
    onBattleStart: vi.fn(),
    onBattleWin: vi.fn(),
    onBattleEscape: vi.fn(),
    saveBgm: vi.fn(),
    replayBgm: vi.fn(),
  };
};

export const createMockGameTemp = () => {
  const state = {
    isPlaytest: false,
    destinationX: null as number | null,
    destinationY: null as number | null,
    needsBattleRefresh: false,
    commonEventQueue: [] as number[],
    animationQueue: [] as unknown[],
    balloonQueue: [] as unknown[],
    lastActionData: [0, 0, 0, 0, 0, 0] as number[],
  };
  return {
    _isPlaytest: state.isPlaytest,
    _destinationX: state.destinationX,
    _destinationY: state.destinationY,
    _needsBattleRefresh: state.needsBattleRefresh,
    _commonEventQueue: state.commonEventQueue,
    _animationQueue: state.animationQueue,
    _balloonQueue: state.balloonQueue,
    _lastActionData: state.lastActionData,
    isPlaytest: vi.fn(() => state.isPlaytest),
    clearDestination: vi.fn(),
    setDestination: vi.fn((x: number, y: number) => {
      state.destinationX = x;
      state.destinationY = y;
    }),
    isDestinationValid: vi.fn(() => state.destinationX !== null),
    requestBattleRefresh: vi.fn(),
    clearBattleRefreshRequest: vi.fn(),
    reserveCommonEvent: vi.fn((id: number) => state.commonEventQueue.push(id)),
  };
};

export const createMockGameScreen = () => {
  return {
    _flashRed: 0,
    _flashGreen: 0,
    _flashBlue: 0,
    _flashAlpha: 0,
    _flashDuration: 0,
    _shake: 0,
    _shakeDuration: 0,
    _shakeSpeed: 0,
    _shakeDirection: 1,
    _shakeMax: 0,
    _fadeOutDuration: 0,
    _fadeInDuration: 0,
    _tone: [0, 0, 0, 0],
    _toneDuration: 0,
  };
};

export const createMockGameMessage = () => {
  return {
    _texts: [] as string[],
    _index: 0,
    _choiceState: '',
    _numInputVariableId: 0,
    _numInputDefault: 0,
    _numInputDigitsMax: 0,
    _itemChoiceVariableId: 0,
    _itemChoiceId: 0,
  };
};

export const createMockGameTimer = () => {
  return {
    _seconds: 0,
    _working: false,
    _duration: 0,
  };
};

export function mockRpgMakerData(options?: MockRpgMakerDataOptions | true) {
  const opts = options === true ? defaultDataOptions : { ...defaultDataOptions, ...(options || {}) };

  global.$dataActors = makeArray(opts.dataActors);
  global.$dataClasses = makeArray(opts.dataClasses);
  global.$dataSkills = makeArray(opts.dataSkills);
  global.$dataItems = makeArray(opts.dataItems);
  global.$dataWeapons = makeArray(opts.dataWeapons);
  global.$dataArmors = makeArray(opts.dataArmors);
  global.$dataEnemies = makeArray(opts.dataEnemies);
  global.$dataTroops = makeArray(opts.dataTroops);
  global.$dataStates = makeArray(opts.dataStates);
  global.$dataAnimations = makeArray(opts.dataAnimations);
  global.$dataTilesets = makeArray(opts.dataTilesets);
  global.$dataCommonEvents = makeArray(opts.dataCommonEvents);

  global.$dataSystem = {
    gameTitle: 'Test Game',
    versionId: 1,
    terms: {
      basic: [],
      skills: [],
      items: [],
      equipTypes: [],
      skillTypes: [],
    },
    weaponTypes: [],
    equipTypes: [],
    skillTypes: [],
    magicSkills: [],
    partyMembers: [1],
    currencyUnit: 'G',
    currencyIconIndex: 0,
    expBase: 0,
    expPlus: 0,
    paramBase: [],
    paramPlus: [],
    paramMax: [],
    paramMin: [],
  };

  global.$dataMap = {
    tilesetId: 1,
    data: [],
    events: [],
  };

  global.$dataMapInfos = makeArray();

  return {
    $dataActors: global.$dataActors,
    $dataClasses: global.$dataClasses,
    $dataSkills: global.$dataSkills,
    $dataItems: global.$dataItems,
    $dataWeapons: global.$dataWeapons,
    $dataArmors: global.$dataArmors,
    $dataEnemies: global.$dataEnemies,
    $dataTroops: global.$dataTroops,
    $dataStates: global.$dataStates,
    $dataAnimations: global.$dataAnimations,
    $dataTilesets: global.$dataTilesets,
    $dataCommonEvents: global.$dataCommonEvents,
    $dataSystem: global.$dataSystem,
    $dataMap: global.$dataMap,
    $dataMapInfos: global.$dataMapInfos,
  };
}

export function mockRpgMakerGame(options?: MockRpgMakerGameOptions | true) {
  const opts = options === true ? defaultGameOptions : { ...defaultGameOptions, ...(options || {}) };

  global.$gameVariables = createMockGameVariables(opts.gameVariables);
  global.$gameSwitches = createMockGameSwitches(opts.gameSwitches);
  global.$gameSystem = createMockGameSystem();
  global.$gameTemp = createMockGameTemp();
  global.$gameScreen = createMockGameScreen();
  global.$gameMessage = createMockGameMessage();
  global.$gameTimer = createMockGameTimer();

  global.$gameMap = {
    _mapId: 1,
    _tilesetId: 1,
    _events: [] as unknown[],
    _displayX: 0,
    _displayY: 0,
    isValid: vi.fn(() => true),
    mapId() { return this._mapId; },
  };

  global.$gamePlayer = {
    _x: 0,
    _y: 0,
    _direction: 2,
    _isMoveDiagonal: false,
    _x2: 0,
    _y2: 0,
  };

  const partyState = { gold: 0, steps: 0 };
  global.$gameParty = {
    _actors: [] as unknown[],
    _gold: partyState.gold,
    _steps: partyState.steps,
    _lastPackageFood: 0,
    _food: 0,
    _maxFood: 50,
    members: vi.fn(() => []),
    gold() { return partyState.gold; },
    steps() { return partyState.steps; },
  };

  global.$gameTroop = {
    _enemies: [] as unknown[],
    _troopId: 0,
    _turnCount: 0,
    _names: [] as string[],
    _interpreter: null,
  };

  global.$gameActors = {
    _data: [] as unknown[],
  };

  global.$gameSelfSwitches = {
    _data: {} as Record<string, unknown>,
  };

  return {
    $gameVariables: global.$gameVariables,
    $gameSwitches: global.$gameSwitches,
    $gameSystem: global.$gameSystem,
    $gameTemp: global.$gameTemp,
    $gameScreen: global.$gameScreen,
    $gameMessage: global.$gameMessage,
    $gameTimer: global.$gameTimer,
    $gameMap: global.$gameMap,
    $gamePlayer: global.$gamePlayer,
    $gameParty: global.$gameParty,
    $gameTroop: global.$gameTroop,
    $gameActors: global.$gameActors,
    $gameSelfSwitches: global.$gameSelfSwitches,
  };
}

export function mockRpgMakerGlobals(options: MockRpgMakerOptions = {}) {
  const opts = { mockData: true, mockGame: true, ...options };

  if (opts.mockData) {
    mockRpgMakerData(opts.mockData ? undefined : opts.mockData);
  }

  if (opts.mockGame) {
    mockRpgMakerGame(opts.mockGame ? undefined : opts.mockGame);
  }

  global.$plugins = [];

  return {
    data: { $dataActors: global.$dataActors, $dataSystem: global.$dataSystem },
    game: { $gameVariables: global.$gameVariables, $gameSwitches: global.$gameSwitches },
  };
}
