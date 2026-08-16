import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

const dockerfile = readFileSync(new URL('./Dockerfile', import.meta.url), 'utf8');
const baseUrlPattern = dockerfile.match(/case "\$BASE_URL" in ([^)]*\))/u)?.[1];

describe('Dockerfile BASE_URL policy', () => {
  it('accepts root and bounded subpaths but rejects malformed deployment bases', () => {
    expect(baseUrlPattern).toBeDefined();

    const evaluate = (value: string) => execFileSync(
      'sh',
      ['-c', `value=$1; case "$value" in ${baseUrlPattern} printf accepted ;; *) printf rejected ;; esac`, 'sh', value],
      { encoding: 'utf8' },
    );

    expect(evaluate('/')).toBe('accepted');
    expect(evaluate('/it-tools/')).toBe('accepted');
    expect(evaluate('it-tools/')).toBe('rejected');
    expect(evaluate('/it-tools')).toBe('rejected');
  });
});
