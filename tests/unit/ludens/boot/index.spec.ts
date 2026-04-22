import {beforeEach, describe, expect, it, vi} from 'vitest';
import {applyBoot} from '@ludens-plugin/boot';
import {events} from '@ludens-plugin/modules/events';

declare const global: any;

function resetLudensGlobals() {
  global.Utils = {
    RPGMAKER_NAME: 'MV',
    isNwjs: () => true,
  };

  global.Graphics = {
    _cssFontLoading: true,
    _setupCssFontLoading: vi.fn(),
  };

  global.Bitmap = {
    load: vi.fn((path: string) => path),
  };

  global.Scene_Title = function Scene_Title() {};
  global.Scene_Title.prototype.start = vi.fn();

  global.window = global.window || global;
  global.window.LudensBridge = undefined;
  global.document = global.document || {body: {}, documentElement: {}, createElement: () => ({})};
  global.document.fonts = {ready: {then() {}}};
}

describe('Ludens Boot Module', () => {
  beforeEach(() => {
    resetLudensGlobals();
  });

  it('emits onload once and notifies bridge after title start', () => {
    const bridge = {callNative: vi.fn()};
    global.window.LudensBridge = bridge;

    const onload = vi.fn();
    events.on('onload', onload);

    applyBoot();

    const title = new global.Scene_Title();
    title.start();
    title.start();

    expect(onload).toHaveBeenCalledTimes(1);
    expect(bridge.callNative).toHaveBeenCalledTimes(1);
    expect(bridge.callNative).toHaveBeenCalledWith(
      'LudensLoader',
      expect.stringContaining('"canToggleDrawEngine":true'),
    );
  });

  it('encodes bitmap path for MV when not running in NWJS', () => {
    global.Utils.RPGMAKER_NAME = 'MV';
    global.Utils.isNwjs = () => false;

    applyBoot();

    const value = global.Bitmap.load('img/pictures/My File.png');
    expect(value).toBe('img/pictures/My%20File.png');
  });

  it('does not encode bitmap path for MZ', () => {
    global.Utils.RPGMAKER_NAME = 'MZ';
    global.Utils.isNwjs = () => false;

    applyBoot();

    const value = global.Bitmap.load('img/pictures/My File.png');
    expect(value).toBe('img/pictures/My File.png');
  });
});
