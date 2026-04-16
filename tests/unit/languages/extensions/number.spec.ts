import {beforeEach, describe, expect, it} from 'vitest';

import {applyNumberExtensions} from '@languages-plugin/extensions/number';

describe('applyNumberExtensions', () => {
  beforeEach(() => {
    applyNumberExtensions();
  });

  describe('Number.isTextCode()', () => {
    it('returns true for Show Text code (401)', () => {
      expect((401).isTextCode()).toBe(true);
    });

    it('returns true for Show Choices code (102)', () => {
      expect((102).isTextCode()).toBe(true);
    });

    it('returns true for Scroll Text code (405)', () => {
      expect((405).isTextCode()).toBe(true);
    });

    it('returns false for non-text codes', () => {
      expect((101).isTextCode()).toBe(false);
      expect((201).isTextCode()).toBe(false);
      expect((0).isTextCode()).toBe(false);
      expect((999).isTextCode()).toBe(false);
    });
  });

  describe('Number.isShowTextCode()', () => {
    it('returns true for Show Text code (401)', () => {
      expect((401).isShowTextCode()).toBe(true);
    });

    it('returns false for Show Choices code (102)', () => {
      expect((102).isShowTextCode()).toBe(false);
    });

    it('returns false for Scroll Text code (405)', () => {
      expect((405).isShowTextCode()).toBe(false);
    });

    it('returns false for other codes', () => {
      expect((0).isShowTextCode()).toBe(false);
      expect((100).isShowTextCode()).toBe(false);
    });
  });
});