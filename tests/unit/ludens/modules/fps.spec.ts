import {describe, expect, it, vi} from 'vitest';
import {fps} from '@ludens-plugin/modules/fps';

declare const global: any;

describe('Ludens FPS Module', () => {
  it('show and hide control MV FPS meter', () => {
    global.Graphics._fpsMeter = {isPaused: true};
    global.Graphics.showFps = vi.fn(() => {
      global.Graphics._fpsMeter.isPaused = false;
    });
    global.Graphics.hideFps = vi.fn(() => {
      global.Graphics._fpsMeter.isPaused = true;
    });

    fps.show();
    expect(global.Graphics.showFps).toHaveBeenCalledTimes(1);
    expect(fps.isVisible).toBe(true);

    fps.hide();
    expect(global.Graphics.hideFps).toHaveBeenCalledTimes(1);
    expect(fps.isVisible).toBe(false);
  });

  it('show and hide control MZ FPS counter', () => {
    const update = vi.fn();
    global.Graphics._fpsMeter = undefined;
    global.Graphics._fpsCounter = {
      _showFps: false,
      _boxDiv: {style: {display: 'none'}},
      _update: update,
    };

    fps.show();
    expect(global.Graphics._fpsCounter._showFps).toBe(true);
    expect(global.Graphics._fpsCounter._boxDiv.style.display).toBe('block');
    expect(update).toHaveBeenCalledTimes(1);

    fps.hide();
    expect(global.Graphics._fpsCounter._showFps).toBe(false);
    expect(global.Graphics._fpsCounter._boxDiv.style.display).toBe('none');
    expect(update).toHaveBeenCalledTimes(2);
  });

  it('toggle flips visibility state', () => {
    global.Graphics._fpsMeter = undefined;
    global.Graphics._fpsCounter = {
      _showFps: false,
      _boxDiv: {style: {display: 'none'}},
      _update() {},
    };

    fps.toggle();
    expect(fps.isVisible).toBe(true);

    fps.toggle();
    expect(fps.isVisible).toBe(false);
  });
});
