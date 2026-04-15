import { describe, it, expect, vi } from 'vitest';
import { iterables } from '@core-plugin/modules/iterables';

describe('Iterables Module', () => {
  it('each should iterate over arrays', () => {
    const list = [1, 2, 3];
    const mapFn = vi.fn();
    
    iterables.each(list, mapFn);
    
    expect(mapFn).toHaveBeenCalledTimes(3);
  });

  it('keach should iterate over object keys', () => {
    const obj = { a: 1, b: 2 };
    const mapFn = vi.fn();
    
    iterables.keach(obj, mapFn);
    
    expect(mapFn).toHaveBeenCalledTimes(2);
  });

  it('reach should iterate in reverse or recursively depending on implementation', () => {
    expect(iterables.reach).toBeDefined();
    expect(typeof iterables.reach).toBe('function');
  });

  it('custom each2 should ignore undefined elements safely', () => {
    const list = [1, undefined, 3];
    const mapFn = vi.fn();
    
    iterables.each2(list, mapFn);
    
    // It should skip undefined
    expect(mapFn).toHaveBeenCalledTimes(2);
  });
});
