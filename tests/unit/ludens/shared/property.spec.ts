import {describe, expect, it} from 'vitest';
import {defineReadonly} from '@ludens-plugin/shared/property';

describe('Ludens Shared Property', () => {
  it('defineReadonly creates enumerable getter-only property', () => {
    const target: {value?: number} = {};

    defineReadonly(target, 'value', () => 42);

    const descriptor = Object.getOwnPropertyDescriptor(target, 'value');
    expect(descriptor).toBeDefined();
    expect(descriptor?.get).toBeTypeOf('function');
    expect(descriptor?.set).toBeUndefined();
    expect(descriptor?.enumerable).toBe(true);
    expect(descriptor?.configurable).toBe(false);
    expect(target.value).toBe(42);
  });
});
