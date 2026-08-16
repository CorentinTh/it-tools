import { describe, expect, it } from 'vitest';
import { buildConventionalCommit } from './conventional-commit-helper.service';

const base = { type: 'feat', scope: 'auth', description: 'add passkey login', body: '', footers: '', breaking: false, breakingDescription: '' };

describe('Conventional Commit helper', () => {
  it('builds a scoped commit message', () => {
    expect(buildConventionalCommit(base).message).toBe('feat(auth): add passkey login');
  });

  it('adds breaking syntax, body, and footers', () => {
    expect(buildConventionalCommit({ ...base, body: 'Clients must send a challenge.', footers: 'Refs: #42', breaking: true, breakingDescription: 'removes password login' }).message).toBe([
      'feat(auth)!: add passkey login', '', 'Clients must send a challenge.', '', 'BREAKING CHANGE: removes password login', 'Refs: #42',
    ].join('\n'));
  });

  it('validates fields and provides non-blocking style warnings', () => {
    expect(() => buildConventionalCommit({ ...base, scope: 'Bad Scope' })).toThrow(/Scope/u);
    expect(() => buildConventionalCommit({ ...base, breaking: true })).toThrow(/breaking change/u);
    expect(buildConventionalCommit({ ...base, description: 'Add login.' }).warnings).toHaveLength(2);
  });
});
