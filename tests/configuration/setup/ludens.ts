import {beforeEach} from 'vitest';
import {mockRpgMakerEnvironment, mockRpgMakerGlobals} from '../index';

declare const global: any;

mockRpgMakerEnvironment()
mockRpgMakerGlobals()

beforeEach(() => {
  global.AudioManager = {
    bgmVolume: 100,
    bgsVolume: 100,
    meVolume: 100,
    seVolume: 100,
  };

  global.Graphics = {
    _fpsMeter: undefined,
    _fpsMeterToggled: false,
    _fpsCounter: undefined,
    showFps: undefined,
    hideFps: undefined,
    _setupCssFontLoading() {},
    _cssFontLoading: true,
  };

  global.Utils = {
    RPGMAKER_NAME: 'MV',
    isNwjs: () => true,
  };

  global.Bitmap = {
    load(path: string) {
      return path;
    },
  };

  global.Scene_Title = function Scene_Title() {};
  global.Scene_Title.prototype.start = function start() {};

  if (!global.document) {
    global.document = {body: {}, documentElement: {}, createElement: () => ({})};
  }

  if (!global.document.fonts) {
    global.document.fonts = {ready: {then() {}}};
  }

  if (!global.window) {
    global.window = global;
  }

  global.window.LudensBridge = undefined;
});
