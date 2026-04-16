import {describe, expect, it} from 'vitest';

import {TextCommand} from '@languages-plugin/models/command';

describe('TextCommand', () => {
  describe('constructor', () => {
    it('stores eventId, pageIndex, index and parameters', () => {
      const cmd = new TextCommand(1, 0, 2, ['Hello']);
      expect(cmd.eventId).toBe(1);
      expect(cmd.pageIndex).toBe(0);
      expect(cmd.index).toBe(2);
      expect(cmd.parameters).toEqual(['Hello']);
    });

    it('defaults to -1 and [] when called without args', () => {
      const cmd = new TextCommand();
      expect(cmd.eventId).toBe(-1);
      expect(cmd.pageIndex).toBe(-1);
      expect(cmd.index).toBe(-1);
      expect(cmd.parameters).toEqual([]);
    });
  });

  describe('isValid', () => {
    it('is true when all indices are >= 0', () => {
      const cmd = new TextCommand(0, 0, 0, []);
      expect(cmd.isValid).toBe(true);
    });

    it('is false when any index is -1', () => {
      expect(new TextCommand(-1, 0, 0, []).isValid).toBe(false);
      expect(new TextCommand(0, -1, 0, []).isValid).toBe(false);
      expect(new TextCommand(0, 0, -1, []).isValid).toBe(false);
    });
  });

  describe('join', () => {
    it('returns the same single parameter unchanged', () => {
      const cmd = new TextCommand(1, 0, 3, ['Only one']);
      const joined = cmd.join();
      expect(joined.parameters).toEqual(['Only one']);
      expect(joined.length).toBeUndefined();
    });

    it('joins multiple parameters with joinSeparator and sets length', () => {
      const cmd = new TextCommand(1, 0, 3, ['Line A', 'Line B', 'Line C']);
      const joined = cmd.join();
      expect(joined.parameters).toEqual(['Line A\nLine B\nLine C']);
      expect(joined.length).toBe(3);
    });
  });

  describe('split', () => {
    it('splits a joined command back into individual lines', () => {
      const multi = new TextCommand(2, 1, 0, ['Alpha', 'Beta']);
      const joinedMulti = multi.join();
      const split = joinedMulti.split();
      expect(split.parameters).toEqual(['Alpha', 'Beta']);
    });

    it('returns original parameters when length is not set', () => {
      const cmd = new TextCommand(1, 0, 0, ['Solo line']);
      const result = cmd.split();
      expect(result.parameters).toEqual(['Solo line']);
    });
  });

  describe('toJSON', () => {
    it('serialises all relevant fields', () => {
      const cmd = new TextCommand(5, 2, 7, ['Test']);
      const json = cmd.toJSON!();
      expect(json.eventId).toBe(5);
      expect(json.pageIndex).toBe(2);
      expect(json.index).toBe(7);
      expect(json.parameters).toEqual(['Test']);
    });
  });
});