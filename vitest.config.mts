import {definePluginTestConfig} from './tests/configuration';

const alias = {
  '@core-plugin': '/src/plugins/core',
  '@jstls': '/lib/jstls/src',
  "@tests": '/tests',
  "@crossassets-plugin": '/src/plugins/crossassets',
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
        // CrossAssets plugin tests
        resolve: {alias},
        test: {
          name: 'crossassets',
          include: ['tests/unit/crossassets/**/*.{test,spec}.ts'],
          setupFiles: [
            './tests/configuration/setup/index.ts',
            "./tests/configuration/setup/crossassets.ts"
          ],
        }
      }
    ]
  },
  resolve: {alias},
});

