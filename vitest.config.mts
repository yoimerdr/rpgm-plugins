import {definePluginTestConfig} from './tests/configuration';

const alias = {
  '@core-plugin': '/src/plugins/core',
  '@jstls': '/lib/jstls/src',
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
    ]
  },
  resolve: {alias},
});

