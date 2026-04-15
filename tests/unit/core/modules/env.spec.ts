import { describe, it, expect } from 'vitest';
import { env } from '@core-plugin/modules/env';

describe('Environment Module', () => {
  it('exposes file system manager', () => {
    expect(env.fm).toBeDefined();
    // Verify specific properties expected from the core file manager module
  });

  it('exposes logger', () => {
    expect(env.logger).toBeDefined();
  });

  it('exposes path utilities', () => {
    expect(env.path).toBeDefined();
  });
});
