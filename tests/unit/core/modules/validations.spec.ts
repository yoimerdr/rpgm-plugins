import {describe, expect, it} from 'vitest';
import {validations} from '@core-plugin/modules/validations';

describe('Validations Module', () => {
  it('isString correctly identifies strings', () => {
    expect(validations.isString('hellouuu')).toBe(true);
    expect(validations.isString(123)).toBe(false);
    expect(validations.isString({ foo: 'bar' })).toBe(false);
  });

  it('isObject correctly identifies objects', () => {
    expect(validations.isObject({})).toBe(true);
    // Remember, arrays are typeof object in JS/TS
    expect(validations.isObject([])).toBe(true);
    expect(validations.isObject(null)).toBe(false);
  });

  it('isDefined accurately catches undefined and null', () => {
    // In this framework, null is considered not defined.
    expect(validations.isDefined(null)).toBe(false);
    expect(validations.isDefined(false)).toBe(true);
    expect(validations.isDefined(undefined)).toBe(false);
  });

  it('requireDefined throws an error on undefined and null', () => {
    expect(() => validations.requireDefined(undefined)).toThrow();
    expect(() => validations.requireDefined(null)).toThrow();
  });
});
