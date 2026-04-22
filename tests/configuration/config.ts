import { ViteUserConfig, mergeConfig } from 'vitest/config';

/**
 * Creates a standard Vitest configuration with tsconfig paths resolution.
 * Allows extending the base configuration for specific plugins.
 *
 * @param overrides - Optional additional configuration that will be merged with the base configuration.
 * @returns {ViteUserConfig} The merged UserConfig suitable for vitest.config.ts.
 */
export function definePluginTestConfig(overrides?: ViteUserConfig): ViteUserConfig {
  const baseConfig: ViteUserConfig = {
    plugins: [],
    test: {
      globals: true,
      environment: 'node',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
      },
    },
  };

  return overrides ? mergeConfig(baseConfig, overrides) : baseConfig;
}
