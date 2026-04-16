import {describe, expect, it} from 'vitest';
import {fm, getEmptyFS, getFS} from '@core-plugin/modules/env/fs';

declare const global: any;

describe('FS Manager', () => {
  it('instantiates emptyFS that returns default empty responses', () => {
    const fs = getEmptyFS();
    expect(fs.existsSync('')).toBe(false);
    expect(fs.readdirSync('')).toEqual([]);
    expect(fs.readFileSync('')).toBe('');
    expect(fs.statSync('').isDirectory()).toBe(false);

    // Actions shouldn't crash
    expect(() => fs.writeFileSync('', '')).not.toThrow();
    expect(() => fs.appendFileSync('', '')).not.toThrow();
    expect(() => fs.mkdirSync('')).not.toThrow();
  });

  it('exposes fm namespace safely', () => {
    expect(fm.fs).toBeTypeOf('function');
    expect(fm.emptyFS).toBeTypeOf('function');
  });

  it('getFS resolves safely in non-nwjs', () => {
    // ensure no Utils.isNwjs crash or bypass
    global.Utils = {isNwjs: () => false};

    const fsInstance = getFS(true);
    expect(fsInstance).toBeDefined();
    expect(fsInstance.existsSync).toBeTypeOf('function');
  });
});
