import { describe, expect, it } from 'vitest';
import { handleMarkdownDiffRequest } from './markdown-diff.worker';

describe('Markdown diff worker', () => {
  it('returns a bounded source report', () => {
    const response = handleMarkdownDiffRequest({ jobId: 7, task: { left: '# Old', right: '# New', granularity: 'line' } });
    expect(response).toMatchObject({ jobId: 7, type: 'result' });
    expect(response.type === 'result' && response.result.value).toContain('- # Old');
  });

  it('uses static errors that do not echo oversized or adversarial input', () => {
    const marker = 'private-markdown-marker';
    const response = handleMarkdownDiffRequest({ jobId: 8, task: { left: `${marker}${'x'.repeat(256 * 1024)}`, right: '', granularity: 'line' } });
    expect(response).toEqual({ jobId: 8, type: 'error', code: 'input-limit', message: 'Each Markdown document is limited to 256 KiB of UTF-8 text.' });
    expect(JSON.stringify(response)).not.toContain(marker);
  });

  it('rejects invalid worker envelopes with a bounded response', () => {
    expect(handleMarkdownDiffRequest({ jobId: 9, task: [], secret: 'do-not-echo' })).toEqual({ jobId: 9, type: 'error', code: 'validation', message: 'Enter two Markdown documents and a valid comparison granularity.' });
  });
});
