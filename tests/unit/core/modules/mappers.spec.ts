import { describe, it, expect } from 'vitest';
import { mappers } from '@core-plugin/modules/mappers';

describe('Mappers Module', () => {
  it('exposes set and setTo property transformations', () => {
    const target: any = { deep: { path: {} } };
    mappers.set(target, 'deep', 'path', 'key', 'value');
    expect(target.deep.path.key).toBe('value');
    
    const source = { a: 1 };
    mappers.setTo(source, ['a'], target);
    expect(target.a).toBe(1);
  });

  it('exposes get utilities and resolves deep paths via arguments', () => {
    const data = { deep: { prop: 'found' } };
    expect(mappers.get(data, 'deep', 'prop')).toBe('found');
    expect(mappers.getfirst(data, ['missing', 'deep'])).toBe(data.deep);
  });

  it('exposes indexable combinations', () => {
    expect(mappers.concat).toBeTypeOf('function');
    expect(mappers.string).toBeTypeOf('function');
  });
});
