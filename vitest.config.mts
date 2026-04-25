import {definePluginTestConfig} from './tests/configuration';

const alias = {
  '@core-plugin': '/src/plugins/core',
  '@ludens-plugin': '/src/plugins/ludens',
  '@jstls': '/lib/jstls/src',
  "@languages-plugin": '/src/plugins/languages',
  "@crossassets-plugin": '/src/plugins/crossassets',
  "@tests": '/tests',
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
        // Core plugin tests
        resolve: {alias},
        test: {
          name: 'languages',
          include: ['tests/unit/languages/**/*.{test,spec}.ts'],
          setupFiles: [
            './tests/configuration/setup/index.ts',
            './tests/configuration/setup/languages.ts'
          ],
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

