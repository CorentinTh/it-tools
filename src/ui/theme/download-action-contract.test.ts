import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const sharedConverterRoutes = [
  '../../tools/json-minify/json-minify.vue',
  '../../tools/json-to-yaml-converter/json-to-yaml.vue',
  '../../tools/json-to-toml/json-to-toml.vue',
  '../../tools/json-to-xml/json-to-xml.vue',
  '../../tools/yaml-to-json-converter/yaml-to-json.vue',
  '../../tools/yaml-to-toml/yaml-to-toml.vue',
  '../../tools/toml-to-json/toml-to-json.vue',
  '../../tools/toml-to-yaml/toml-to-yaml.vue',
  '../../tools/xml-to-json/xml-to-json.vue',
] as const;

const directDownloadRoutes = [
  '../../tools/json-to-csv/json-to-csv.vue',
  '../../tools/json-viewer/json-viewer.vue',
  '../../tools/yaml-viewer/yaml-viewer.vue',
  '../../tools/xml-formatter/xml-formatter.vue',
  '../../tools/sql-prettify/sql-prettify.vue',
  '../../tools/devops-config-workspace/devops-config-workspace.vue',
  '../../tools/json-code-generator/json-code-generator.vue',
  '../../tools/json-repair-query/json-repair-query.vue',
] as const;

describe('bounded transformed-output download contract', () => {
  it('keeps the shared converter download bound to existing non-empty output', () => {
    const source = readFileSync(new URL('../../components/BoundedTextTransformer.vue', import.meta.url), 'utf8');
    expect(source).toContain('downloadFilename: string');
    expect(source).toContain(':disabled="!output"');
    expect(source).toContain('downloadTextFile({ content: output, filename: downloadFilename })');
  });

  it.each(sharedConverterRoutes)('%s supplies an explicit safe filename', (relativePath) => {
    const source = readFileSync(new URL(relativePath, import.meta.url), 'utf8');
    expect(source).toMatch(/download-filename="[a-z0-9-]+\.(?:json|yaml|toml|xml)"/);
  });

  it.each(directDownloadRoutes)('%s uses the shared short-lived Blob URL helper', (relativePath) => {
    const source = readFileSync(new URL(relativePath, import.meta.url), 'utf8');
    expect(source).toContain('@/composable/downloadText');
    expect(source).toContain('downloadTextFile({ content:');
  });
});
