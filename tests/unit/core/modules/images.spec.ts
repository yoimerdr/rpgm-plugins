import {describe, expect, it, vi} from 'vitest';
import {images} from '@core-plugin/modules/images';
import type {FileManager, FileManagerState} from '@core-plugin/modules/env/fs';

describe('Images Module', () => {
  it('ext configuration exposes raw and encoded definitions', () => {
    // @ts-ignore
    expect(images.ext.raw.includes('.png')).toBe(true);
    // @ts-ignore
    expect(images.ext.encoded.includes('.rpgmvp')).toBe(true);
  });

  it('extensions dynamically bundles raw and encoded', () => {
    expect(images.extensions.length).toBeGreaterThan(0);
    // @ts-ignore
    expect(images.extensions.includes('.png')).toBe(true);
    // @ts-ignore
    expect(images.extensions.includes('.rpgmvp')).toBe(true);
  });

  it('isSupported correctly identifies image files by suffix', () => {
    expect(images.isSupported('mapletree.png')).toBe(true);
    expect(images.isSupported('tileset.rpgmvp')).toBe(true);
    expect(images.isSupported('script.js')).toBe(false);
    expect(images.isSupported('noextension')).toBe(false);
  });

  it('list recursively scans directories for images', () => {
    // Constructing a fake FileSystem simulator
    const mockStat = (isDirectory: boolean): FileManagerState => ({
      isDirectory: () => isDirectory,
      isFile: () => !isDirectory
    } as any);

    const mockFs: FileManager = {
      readdirSync: vi.fn((dir: string) => {
        if (dir === 'root') return ['image1.png', 'subfolder', 'script.js'];
        // @ts-ignore
        if (dir.includes('subfolder')) return ['image2.rpgmvp', 'audio.ogg'];
        return [];
      }),
      statSync: vi.fn((filepath: string) => {
        // @ts-ignore
        if (filepath.includes('subfolder') && !filepath.includes('.')) return mockStat(true);
        return mockStat(false);
      }),
    } as any;

    const result = images.list('root', mockFs);

    expect(mockFs.readdirSync).toHaveBeenCalledTimes(2); // 'root' and 'subfolder'
    expect(result.length).toBe(2);
    // @ts-ignore
    expect(result.some(r => r.includes('image1.png'))).toBe(true);
    // @ts-ignore
    expect(result.some(r => r.includes('image2.rpgmvp'))).toBe(true);
  });
});
