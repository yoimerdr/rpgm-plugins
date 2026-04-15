import {vi} from 'vitest';

declare const global: any;

export interface MockRpgMakerOptions {
  mockGameSystem?: boolean;
  mockPluginManager?: boolean;
}

/**
 * Mocks the RPG Maker PluginManager global.
 */
export function mockPluginManager() {
  const PluginManager = {
    parameters: vi.fn().mockReturnValue({}),
    registerCommand: vi.fn(),
    setup: vi.fn(),
  };

  if (typeof global !== 'undefined') {
    (global as any).PluginManager = PluginManager;
  }
  if (typeof window !== 'undefined') {
    (window as any).PluginManager = PluginManager;
  }

  return PluginManager;
}

/**
 * Sets up a mocked RPG Maker environment required by core plugins.
 *
 * @param options configuration options for what should be mocked.
 */
export function mockRpgMakerEnvironment(options: MockRpgMakerOptions = {}) {
  const opts = {mockPluginManager: true, ...options};

  if (opts.mockPluginManager) {
    mockPluginManager();
  }

  // Basic window mock if needed by browser-specific logic when running in node
  if (typeof global !== 'undefined' && typeof window === 'undefined') {
    (global as any).window = global;
  }
  
  if (typeof global !== 'undefined' && typeof document === 'undefined') {
    (global as any).document = {
      body: {},
      documentElement: {},
      createElement: () => ({})
    };
  }

  if (typeof global !== 'undefined') {
    if (typeof location === 'undefined') {
      (global as any).location = { href: '', pathname: '', search: '', hash: '' };
    }
    if (typeof navigator === 'undefined') {
      try {
        (global as any).navigator = { userAgent: 'node.js' };
      } catch (e) {
         Object.defineProperty(global, 'navigator', { value: { userAgent: 'node.js' }, writable: true, configurable: true });
      }
    }
    if (typeof history === 'undefined') {
      (global as any).history = { pushState: () => {}, replaceState: () => {} };
    }
    if (typeof XMLHttpRequest === 'undefined') {
      (global as any).XMLHttpRequest = class MockXMLHttpRequest {
        status = 200;
        response = '{}';
        headers: any = {};
        onload() {}
        onerror() {}
        open() {}
        send() { setTimeout(() => this.onload(), 0); }
        setRequestHeader(k: string, v: string) { this.headers[k] = v; }
        overrideMimeType() {}
      };
    }
  }
  
  // Expose further game variables or system here if options demand it mappings
}
