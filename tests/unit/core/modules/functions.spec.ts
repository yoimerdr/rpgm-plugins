import { describe, it, expect } from 'vitest';
import { functions } from '@core-plugin/modules/functions';

describe('Functions Module', () => {
  it('should have a noact operation', () => {
    expect(functions.noact).toBeDefined();
    expect(typeof functions.noact).toBe('function');
    
    // noact should essentially do nothing or return undefined
    expect(functions.noact()).toBeUndefined();
  });

  it('should expose standard function tools like bind and apply', () => {
    expect(functions.bind).toBeTypeOf('function');
    
    const context = { value: 42 };
    function testFn(this: any, arg: number) { return this.value + arg; }
    
    const bound = functions.bind(testFn, context);
    expect(bound(8)).toBe(50);
    
    const applied = functions.apply(testFn, context, [10]);
    expect(applied).toBe(52);
  });
});
