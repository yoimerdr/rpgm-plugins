import {describe, expect, it, vi, beforeEach, afterEach} from 'vitest';
import {errors} from '@ludens-plugin/modules/errors';

declare const global: any;

describe('Ludens Errors Module', () => {
  let originalWindow: any;
  let originalSceneManager: any;

  beforeEach(() => {
    originalWindow = global.window;
    originalSceneManager = (global as any).SceneManager;
  });

  afterEach(() => {
    global.window = originalWindow;
    (global as any).SceneManager = originalSceneManager;
  });

  it('errors.reportError sends formatted payload to LudensBridge when available', () => {
    const mockCallNative = vi.fn();
    global.window = {
      LudensBridge: {
        callNative: mockCallNative
      }
    } as any;

    const error = new Error('Test Engine Error');
    error.stack = 'Custom Stack Trace';

    errors.report('Test Engine Error', 'main.js', 10, 5, error);

    expect(mockCallNative).toHaveBeenCalledTimes(1);
    expect(mockCallNative).toHaveBeenCalledWith(
      'GameError',
      JSON.stringify({
        message: 'Test Engine Error',
        source: 'main.js',
        line: 10,
        column: 5,
        stackTrace: 'Custom Stack Trace'
      })
    );
  });
});
