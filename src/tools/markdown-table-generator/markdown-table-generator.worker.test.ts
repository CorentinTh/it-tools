import { describe, expect, it } from 'vitest';
import { handleMarkdownTableRequest } from './markdown-table-generator.worker';

describe('Markdown table worker', () => {
  it('returns bounded generated output', () => {
    const response = handleMarkdownTableRequest({ jobId: 4, task: { source: 'A,B\n1,2', delimiter: 'comma', firstRowHeader: true, trimCells: true, alignmentPattern: 'left,right' } });
    expect(response).toMatchObject({ jobId: 4, type: 'result' });
  });

  it('rejects oversized input without echoing it', () => {
    const response = handleMarkdownTableRequest({ jobId: 5, task: { source: 'x'.repeat(512 * 1024 + 1), delimiter: 'auto', firstRowHeader: true, trimCells: true, alignmentPattern: 'left' } });
    expect(response).toEqual({ jobId: 5, type: 'error', code: 'input-limit', message: 'Table input is limited to 512 KiB of UTF-8 text.' });
  });
});
