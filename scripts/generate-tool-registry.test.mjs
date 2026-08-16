import assert from 'node:assert/strict';
import test from 'node:test';
import {
  parseToolDescriptor,
  renderToolRegistry,
  validateToolDescriptors,
} from './generate-tool-registry.mjs';

const descriptorSource = (overrides = '') => `
export const registry = {
  category: 'Crypto',
  order: 3,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: 'Example',
  path: '/example',
  ${overrides}
});
`;

test('parses the canonical category, order, and path', () => {
  assert.deepEqual(parseToolDescriptor(descriptorSource(), 'example'), {
    category: 'Crypto',
    directoryName: 'example',
    order: 3,
    path: '/example',
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
    { category: 'Text', directoryName: 'zeta', order: 2, path: '/zeta' },
    { category: 'Crypto', directoryName: 'alpha', order: 1, path: '/alpha' },
  ]);

  assert.match(output, /import \{ tool as tool0 \} from '\.\/alpha';/);
  assert.match(output, /import \{ tool as tool1 \} from '\.\/zeta';/);
  assert.match(output, /\{ name: 'Crypto', components: \[tool0\] \}/);
  assert.match(output, /\{ name: 'Text', components: \[tool1\] \}/);
  assert.ok(output.indexOf("'./alpha'") < output.indexOf("'./zeta'"));
});
