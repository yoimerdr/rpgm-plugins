import {describe, expect, it} from 'vitest';
import {properties} from '@core-plugin/modules/properties';

declare const global: any;

describe('Properties Module', () => {
  it('define should construct property definitions without crashing', () => {
    const targetObj: Record<string, any> = {};
    
    properties.define(targetObj, 'vitalKey', {
      value: 'data',
      writable: false, // Testing immutability flag
      enumerable: true
    });
    
    expect(targetObj.vitalKey).toBe('data');
    
    // As JS writable ignores silently without strict mode, or throws if object is sealed/frozen...
    // In vitest env, we can just assert definitions exist in property getters
    const descriptor = Object.getOwnPropertyDescriptor(targetObj, 'vitalKey');
    expect(descriptor?.writable).toBe(false);
    expect(descriptor?.value).toBe('data');
  });

  it('define should return early if property is already defined', () => {
    const targetObj: any = { existing: 'yes' };
    properties.define(targetObj, 'existing', { value: 'no' });
    expect(targetObj.existing).toBe('yes'); // Was not overwritten
  });

  it('addWindowPolyfill injects polyfill based on mode', () => {
    const fakeWin = global.window;
    
    // Auto mode when property already exists
    fakeWin.testPoly = 'exist';
    properties.addWindowPolyfill('auto', 'testPoly', 'newval');
    expect(fakeWin.testPoly).toBe('exist'); // Didn't overwrite
    
    // Include mode bypasses checks
    properties.addWindowPolyfill('include', 'testPoly2', 'newval');
    expect(fakeWin.testPoly2).toBe('newval');
  });

  it('should have standard module exports correctly instantiated', () => {
    expect(properties.getprop).toBeTypeOf('function');
    expect(properties.assign).toBeTypeOf('function');
    expect(properties.define).toBeTypeOf('function');
  });
});
