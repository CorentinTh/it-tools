import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const shellSources = [
  '../composable/debouncedref.ts',
  '../composable/validation.ts',
  './command-palette/command-palette.store.ts',
  './tracker/tracker.services.ts',
  '../plugins/plausible.plugin.ts',
  '../tools/tools.store.ts',
  '../utils/error.ts',
];

describe('initial shell dependency contract', () => {
  it.each(shellSources)('%s does not pull the full Lodash package into the shell', (relativePath) => {
    const source = readFileSync(new URL(relativePath, import.meta.url), 'utf8');
    expect(source).not.toMatch(/from ['"]lodash['"]/);
  });
});
