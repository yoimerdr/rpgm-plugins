import {emitter} from "@jstls/core/emitter";

export interface LudensEmitter {
  /**
   * Adds a listener for the specified event.
   *
   * @example
   * emitter.on('event', () => console.log('fired'));
   *
   * @param name The event name.
   * @param listener The callback function.
   */
  on(name: string, listener: Function): void;

  /**
   * Removes a listener for the specified event.
   *
   * @example
   * emitter.off('event', listener);
   *
   * @param name The event name.
   * @param listener The callback function to remove.
   */
  off(name: string, listener: Function): void;
}

export const events = emitter()
