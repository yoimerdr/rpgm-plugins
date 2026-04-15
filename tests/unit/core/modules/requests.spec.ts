import {describe, it, expect, beforeEach} from 'vitest';
import {requests} from '@core-plugin/modules/requests';

declare const global: any;

describe('Requests Module', () => {
  beforeEach(() => {
    // XMLHttpRequest is mocked via marks.ts globally, but we can intercept it here too
  });

  it('has fetchRequest and fetchJson interfaces', () => {
    expect(requests.fetch).toBeTypeOf('function');
    expect(requests.fetchJson).toBeTypeOf('function');
    expect(requests.Promise).toBeDefined();
  });

  // @ts-ignore
  it('fetchJson rejects properly if status is 400+', async () => {
    // Overriding the mock XMLHttpRequest dynamically for this block
    const OriginalXHR = global.XMLHttpRequest;

    global.XMLHttpRequest = class BadXHR extends OriginalXHR {
      open() {
      }

      send() {
        this.status = 404;
        setTimeout(() => this.onload(), 0);
      }
    };

    await expect(requests.fetchJson('https://fake-endpoint.com')).rejects.toThrow('Unexpected response status: 404');

    global.XMLHttpRequest = OriginalXHR; // Restore
  });

  // @ts-ignore
  it('fetchJson resolves and parses JSON correctly', async () => {
    const OriginalXHR = global.XMLHttpRequest;

    global.XMLHttpRequest = class GoodXHR extends OriginalXHR {
      open() {
      }

      send() {
        this.status = 200;
        this.response = '{"message": "success"}';
        setTimeout(() => this.onload(), 0);
      }
    };

    const result = await requests.fetchJson('https://fake-endpoint.com');
    expect(result).toEqual({message: 'success'});

    global.XMLHttpRequest = OriginalXHR; // Restore
  });

  // @ts-ignore
  it('fetchRequest triggers reject on xhr onerror', async () => {
    const OriginalXHR = global.XMLHttpRequest;
    global.XMLHttpRequest = class ErrorXHR extends OriginalXHR {
      open() {
      }

      send() {
        setTimeout(() => this.onerror(), 0);
      }
    };

    await expect(requests.fetch('https://err.com')).rejects.toBeDefined();
    global.XMLHttpRequest = OriginalXHR;
  });

  it('fetchRequest throws if XMLHttpRequest is undefined', () => {
    const OriginalXHR = global.XMLHttpRequest;
    delete global.XMLHttpRequest;

    expect(() => requests.fetch('https://req.com')).toThrow(ReferenceError);

    global.XMLHttpRequest = OriginalXHR;
  });
});
