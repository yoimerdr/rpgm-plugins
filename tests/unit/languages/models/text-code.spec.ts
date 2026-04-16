import {describe, expect, it} from 'vitest';
import {TextCode} from '@languages-plugin/models/text-code';

describe('TextCode', () => {
  it('TEXT is 401', () => {
    expect(TextCode.TEXT).toBe(401);
  });

  it('CHOICE is 102', () => {
    expect(TextCode.CHOICE).toBe(102);
  });

  it('SCROLLING_TEXT is 405', () => {
    expect(TextCode.SCROLLING_TEXT).toBe(405);
  });

  it('is a frozen enum-like object', () => {
    const keys = Object.keys(TextCode);
    expect(keys).toContain('TEXT');
    expect(keys).toContain('CHOICE');
    expect(keys).toContain('SCROLLING_TEXT');
  });
});
