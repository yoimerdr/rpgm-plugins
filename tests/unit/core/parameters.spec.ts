import { describe, it, expect } from 'vitest';
import { setupParameters, PluginName } from '@core-plugin/parameters';

describe('Root Plugin Parameters Module', () => {
  it('exposes PluginName statically', () => {
    expect(PluginName).toBeDefined();
    expect(typeof PluginName).toBe('string');
  });

  it('setupParameters reads global PluginManager context safely', () => {
    expect(() => setupParameters()).not.toThrow();
  });
});
