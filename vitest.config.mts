import {definePluginTestConfig} from './tests/configuration';

const alias = {
  '@core-plugin': '/src/plugins/core',
  '@ludens-plugin': '/src/plugins/ludens',
  '@jstls': '/lib/jstls/src',
  '@tests': '/tests',
};

export default definePluginTestConfig({
  test: {
    coverage: {
      include: ['src/**'],
      exclude: ['lib/**', 'tests/**', 'node_modules/**']
    },
    projects: [
      {
        // Core plugin tests
        resolve: {alias},
        test: {
          name: 'core',
          include: ['tests/unit/core/**/*.{test,spec}.ts'],
          setupFiles: ['./tests/configuration/setup/index.ts'],
        }
      },
      {
        // Ludens plugin tests
        resolve: {alias},
        test: {
          name: 'ludens',
          include: ['tests/unit/ludens/**/*.{test,spec}.ts'],
          setupFiles: ['./tests/configuration/setup/ludens.ts'],
        }
      },
    ]
  },
  resolve: {alias},
});

