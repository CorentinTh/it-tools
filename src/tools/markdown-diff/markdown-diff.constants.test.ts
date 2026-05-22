import { describe, expect, it } from 'vitest';
import { modifiedMarkdown, originalMarkdown } from './markdown-diff.constants';

describe('markdown-diff constants', () => {
  it('provides different default Markdown documents', () => {
    expect(originalMarkdown).toContain('# Release notes');
    expect(originalMarkdown).toContain('| user | host | plugin |');
    expect(modifiedMarkdown).toContain('# Release notes');
    expect(modifiedMarkdown).toContain('```sql');
    expect(modifiedMarkdown).not.toBe(originalMarkdown);
  });
});
