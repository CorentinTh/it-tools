import path from 'node:path';
import unoCssPlugin from 'unocss/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [
    unoCssPlugin(),
    solidPlugin(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
      },
    },
  },
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    exclude: [
      ...configDefaults.exclude,
      '**/*.e2e.test.ts',
    ],
  },
});
