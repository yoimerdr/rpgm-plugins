import {describe, expect, it} from 'vitest';
import {exceptions} from '@core-plugin/modules/exceptions';

describe('Exceptions Module', () => {
  it('instantiates IllegalArgumentError correctly', () => {
    const err = new exceptions.IllegalArgumentError('Wrong arg');
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Wrong arg');
  });

  it('instantiates RequiredArgumentError correctly', () => {
    const err = new exceptions.RequiredArgumentError('Missing arg');
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Missing arg');
  });

  it('instantiates IllegalAccessError correctly', () => {
    const err = new exceptions.IllegalAccessError('Invalid access');
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('Invalid access');
  });
});
