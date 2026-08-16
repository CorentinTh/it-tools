import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  LAZY_ROUTE_OPTIMIZED_DEPENDENCIES,
  WORKER_OPTIMIZED_DEPENDENCIES,
  WORKER_UNOPTIMIZED_DEPENDENCIES,
} from './vite.config';

const expectedWorkerDependencies = [
  '@noble/hashes/blake3.js',
  '@noble/hashes/legacy.js',
  '@noble/hashes/sha2.js',
  '@noble/hashes/sha3.js',
  'ajv',
  'ajv/dist/2019.js',
  'ajv/dist/2020.js',
  'bcryptjs',
  'composerize-ts',
  'crypto-js',
  'fuse.js',
  'hash-wasm',
  'hyparquet',
  'iarna-toml-esm',
  'js-base64',
  'json5',
  'markdown-it',
  'mathjs/number',
  'pkijs',
  'prettier',
  'prettier/plugins/html',
  'randexp',
  'saxen',
  'sql-formatter',
  'xml-formatter',
  'xml-js',
  'yaml',
];

describe('Vite worker dependency optimization', () => {
  it('prebundles every package family currently owned by a route worker', () => {
    expect(WORKER_OPTIMIZED_DEPENDENCIES).toEqual(expectedWorkerDependencies);
    expect(WORKER_UNOPTIMIZED_DEPENDENCIES).toEqual(['emojilib', 'unicode-emoji-json']);

    const workerSources = [
      'src/tools/aes-gcm-envelope/aes-gcm-envelope.service.ts',
      'src/tools/argon2id-hash-verify/argon2id.worker-handler.ts',
      'src/tools/bcrypt/bcrypt.worker.ts',
      'src/tools/docker-run-to-docker-compose-converter/docker-converter.worker-handler.ts',
      'src/tools/emoji-picker/emoji-picker.worker.ts',
      'src/tools/file-hash/file-hash.worker-handler.ts',
      'src/tools/hash-text/hash-text.worker.ts',
      'src/tools/html-wysiwyg-editor/html-wysiwyg-editor.worker-handler.ts',
      'src/tools/json-schema-validator/json-schema-validator.models.ts',
      'src/tools/json-to-toml/json-converter.worker.ts',
      'src/tools/markdown-to-html/markdown-to-html.worker.ts',
      'src/tools/math-evaluator/math-evaluator.worker.ts',
      'src/tools/parquet-reader/parquet-reader.service.ts',
      'src/tools/pkcs12-pem-workspace/pkcs12-pem-workspace.service.ts',
      'src/tools/regex-tester/regex-tester.sample.service.ts',
      'src/tools/xlsx-reader/xlsx-reader.service.ts',
      'src/tools/sql-prettify/sql-prettify.worker.ts',
      'src/tools/toml-to-json/toml-converter.worker.ts',
      'src/tools/xml-formatter/xml-formatter.worker.ts',
      'src/tools/xml-to-json/xml-data-converter.worker.ts',
      'src/tools/yaml-to-toml/yaml-converter.worker.ts',
    ].map(path => readFileSync(new URL(path, import.meta.url), 'utf8')).join('\n');

    for (const dependency of expectedWorkerDependencies) {
      expect(workerSources, dependency).toContain(`'${dependency}'`);
    }
    for (const dependency of WORKER_UNOPTIMIZED_DEPENDENCIES) {
      expect(workerSources, dependency).toContain(`'${dependency}'`);
    }
  });

  it('prebundles dependencies that are otherwise discovered only after visiting a lazy route', () => {
    expect(LAZY_ROUTE_OPTIMIZED_DEPENDENCIES).toEqual([
      'jsonc-parser',
      'mermaid',
      'monaco-editor/esm/vs/editor/editor.api',
    ]);

    const lazyRouteSources = [
      'src/tools/json-viewer/json.models.ts',
      'src/tools/mermaid-diagram/mermaid-renderer.service.ts',
      'src/ui/c-diff-editor/c-diff-editor.vue',
    ].map(path => readFileSync(new URL(path, import.meta.url), 'utf8')).join('\n');

    for (const dependency of LAZY_ROUTE_OPTIMIZED_DEPENDENCIES) {
      expect(lazyRouteSources, dependency).toContain(`'${dependency}'`);
    }
  });
});
