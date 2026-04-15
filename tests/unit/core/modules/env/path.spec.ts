import { describe, it, expect, vi } from 'vitest';
import { path } from '@core-plugin/modules/env/path';

describe('Path Environment module', () => {
  it('exposes sep and utilities', () => {
    expect(path.sep).toBeDefined();
    expect(path.join).toBeTypeOf('function');
    expect(path.normalize).toBeTypeOf('function');
  });

  it('Filepath instance supports mkdir with recursive and fallback rules', () => {
    const filepath = new path.Filepath('fake/dir/path');
    let mkdirCallCount = 0;
    
    const mockFs: any = {
      mkdirSync: vi.fn(() => {
        mkdirCallCount++;
        if (mkdirCallCount === 1) {
          const err = new Error('ENOENT') as any;
          err.code = 'ENOENT';
          throw err;
        }
        // Second call passes
      })
    };

    // Fails on non-recursive
    expect(() => filepath.mkdir({ recursive: false }, mockFs)).toThrow();
    
    // Recovers on recursive by calling parent
    mkdirCallCount = 0; // reset
    expect(filepath.mkdir({ recursive: true }, mockFs)).toBe(true);
  });
});
