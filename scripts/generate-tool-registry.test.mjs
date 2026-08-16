import assert from 'node:assert/strict';
import test from 'node:test';
import {
  parseToolDescriptor,
  renderToolRegistry,
  validateToolDescriptors,
} from './generate-tool-registry.mjs';

const descriptorSource = (overrides = '') => `
import { Fingerprint } from '@vicons/tabler';

export const registry = {
  category: 'Crypto',
  order: 3,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: 'Example',
  path: '/example',
  description: 'Example description',
  keywords: ['example'],
  component: () => import('./example.vue'),
  icon: Fingerprint,
  ${overrides}
});
`;

test('parses the canonical category, order, and path', () => {
  assert.deepEqual(parseToolDescriptor(descriptorSource(), 'example'), {
    category: 'Crypto',
    componentPath: './example.vue',
    createdAt: undefined,
    description: "'Example description'",
    directoryName: 'example',
    icon: { imported: 'Fingerprint', local: 'Fingerprint', source: '@vicons/tabler' },
    keywords: "['example']",
    name: "'Example'",
    order: 3,
    path: '/example',
    redirectFrom: undefined,
  });
});

test('rejects missing typed registry metadata', () => {
  assert.throws(
    () => parseToolDescriptor(`export const tool = defineTool({ path: '/example' });`, 'example'),
    /registry metadata/,
  );
});

test('preserves legacy URLs that intentionally differ from directory names', () => {
  const descriptor = parseToolDescriptor(descriptorSource().replace("'/example'", "'/legacy-url'"), 'example');
  assert.equal(descriptor.path, '/legacy-url');
});

test('rejects duplicate paths and category positions', () => {
  const first = parseToolDescriptor(descriptorSource(), 'example');
  assert.throws(() => validateToolDescriptors([first, { ...first, directoryName: 'second' }]), /Duplicate tool path/);
  assert.throws(
    () => validateToolDescriptors([first, { ...first, directoryName: 'second', path: '/second' }]),
    /Duplicate tool order/,
  );
});

test('renders deterministic imports, category membership, and lazy descriptor references', () => {
  const output = renderToolRegistry([
    { category: 'Text', componentPath: './zeta.vue', description: "'Zeta'", directoryName: 'zeta', icon: { imported: 'default', local: 'ZetaIcon', source: './zeta.svg?component' }, keywords: "['zeta']", name: "'Zeta'", order: 2, path: '/zeta' },
    { category: 'Crypto', componentPath: './alpha.vue', description: "'Alpha'", directoryName: 'alpha', icon: { imported: 'Fingerprint', local: 'Fingerprint', source: '@vicons/tabler' }, keywords: "['alpha']", name: "'Alpha'", order: 1, path: '/alpha' },
  ]);

  assert.match(output, /import \{ Fingerprint as ToolIcon0 \} from '@vicons\/tabler';/);
  assert.match(output, /import ToolIcon1 from '\.\/zeta\/zeta\.svg\?component';/);
  assert.match(output, /const tool0 = defineTool\(\{/);
  assert.match(output, /component: \(\) => import\('\.\/alpha\/alpha\.vue'\)/);
  assert.match(output, /icon: ToolIcon0/);
  assert.match(output, /icon: ToolIcon1/);
  assert.match(output, /\{ name: 'Crypto', components: \[tool0\] \}/);
  assert.match(output, /\{ name: 'Text', components: \[tool1\] \}/);
  assert.ok(output.indexOf("'./alpha/alpha.vue'") < output.indexOf("'./zeta/zeta.vue'"));
});
