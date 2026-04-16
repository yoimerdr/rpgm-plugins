import {definePluginTestConfig} from './tests/configuration';

const alias = {
  '@core-plugin': '/src/plugins/core',
  '@jstls': '/lib/jstls/src',
  "@languages-plugin": '/src/plugins/languages',
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
    ]
  },
  resolve: {alias},
});

