import {describe, expect, it, vi} from 'vitest';
import {events} from '@ludens-plugin/modules/events';

describe('Ludens Events Module', () => {
  it('on and off subscribe and unsubscribe listeners', () => {
    const listener = vi.fn();

    events.on('ping', listener);
    events.emit('ping');
    expect(listener).toHaveBeenCalledTimes(1);

    events.off('ping', listener);
    events.emit('ping');
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
