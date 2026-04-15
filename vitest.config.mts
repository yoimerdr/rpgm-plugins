import { definePluginTestConfig } from './tests/configuration';

export default definePluginTestConfig({
  test: {
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.{test,spec}.ts'],
    coverage: {
      include: ['src/**'],
      exclude: ['lib/**', 'tests/**', 'node_modules/**']
    }
  },
  resolve: {
    alias: {
      '@core-plugin': '/src/plugins/core',
      '@jstls': '/lib/jstls/src'
    }
  },

});
