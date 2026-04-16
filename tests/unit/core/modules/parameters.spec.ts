import {describe, expect, it} from 'vitest';
import {parameters} from '@core-plugin/modules/parameters';

describe('Internal Parameters module', () => {
  it('boolParameter processes logic constraints', () => {
    expect(parameters.bool('true')).toBe(true);
    expect(parameters.bool('false')).toBe(false);
    expect(parameters.bool('undefined')).toBe(false);
    expect(parameters.bool(null as any)).toBe(false);
  });
});
