import {beforeEach, describe, expect, it, vi} from 'vitest';
import {applyExtensions} from '@languages-plugin/extensions';
import {loadMapCommands, loadMapFile} from '@languages-plugin/files/map';

const appendMock = vi.hoisted(() => vi.fn());

vi.mock('@languages-plugin/shortcuts/env/logger', () => ({
  append: appendMock,
}));

describe('languages/files/map', () => {
  beforeEach(() => {
    applyExtensions();
  });

  it('parses map file JSON from data folder', () => {
    const manager = {
      readFileSync: vi.fn(() => '{"id":1,"events":[]}'),
    } as any;

    const map = loadMapFile('Map001.json', manager) as any;
    expect(map.id).toBe(1);
    expect(manager.readFileSync).toHaveBeenCalledWith(expect.stringContaining('data'));
  });

  it('returns undefined and logs when file parsing fails', () => {
    const manager = {
      readFileSync: vi.fn(() => '{bad json'),
    } as any;

    const map = loadMapFile('Map001.json', manager);
    expect(map).toBeUndefined();
    expect(appendMock).toHaveBeenCalled();
  });

  it('extracts only events with text commands', () => {
    const file = {
      events: [
        null,
        {
          id: 1,
          pages: [{list: [{code: 0, parameters: []}]}],
        },
        {
          id: 2,
          pages: [{list: [{code: 401, parameters: ['Hola']}]}],
        },
      ],
    } as any;

    const result = loadMapCommands(file);
    expect(result[2]).toBeDefined();
    expect(result[1]).toBeUndefined();
  });
});
