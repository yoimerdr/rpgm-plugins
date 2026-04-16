import {describe, expect, it} from 'vitest';
import {cls} from '@core-plugin/modules/cls';

describe('Classes (cls) Module', () => {
  it('should construct functional classes via funclass', () => {
    const TestClass = cls.funclass({
      prototype: {
        getVal() { return 'val'; }
      }
    });
    
    const instance: any = new (TestClass as any)();
    expect(instance.getVal()).toBe('val');
  });

  it('should expose extendMethod functions', () => {
    expect(cls.extendMethod).toBeTypeOf('function');
    
    let executed = false;
    const obj = { run() { return 1; } };
    cls.extendMethod(obj, 'run', {
      afterCall() { executed = true; return 1; }
    });
    
    obj.run();
    expect(executed).toBe(true);
  });
});
