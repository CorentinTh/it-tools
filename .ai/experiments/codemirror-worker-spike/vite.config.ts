import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  build: {
    emptyOutDir: true,
    outDir: fileURLToPath(new URL('../../../.tmp-codemirror-spike-dist', import.meta.url)),
  },
});
