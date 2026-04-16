import {describe, expect, it} from 'vitest';

import {flattenobj, mapString} from '@languages-plugin/shortcuts/mappers';

describe('flattenobj', () => {
  it('flattens a nested object with a separator', () => {
    const input = { a: { b: { c: 1 } } };
    const result = flattenobj(input, '/');
    expect(result['a/b/c']).toBe(1);
  });

  it('handles arrays as leaf values (not descended)', () => {
    const input = { a: [1, 2, 3] };
    const result = flattenobj(input, '.');
    expect(result['a']).toEqual([1, 2, 3]);
  });

  it('flat object is returned as-is (keys unchanged)', () => {
    const input = { x: 'hello', y: 'world' };
    const result = flattenobj(input, '.');
    expect(result['x']).toBe('hello');
    expect(result['y']).toBe('world');
  });

  it('handles empty object', () => {
    expect(flattenobj({}, '.')).toEqual({});
  });
});

describe('mapString', () => {
  it('replaces ${key} tokens with data values', () => {
    const result = mapString('Hello, ${name}!', { name: 'World' });
    expect(result).toBe('Hello, World!');
  });

  it('replaces multiple tokens', () => {
    const result = mapString('${a}-${b}', { a: 'foo', b: 'bar' });
    expect(result).toBe('foo-bar');
  });

  it('leaves unknown tokens as empty string', () => {
    const result = mapString('${missing}', {});
    expect(result).toBe('');
  });

  it('returns template unchanged when no tokens', () => {
    expect(mapString('no tokens here', { x: 1 })).toBe('no tokens here');
  });
});