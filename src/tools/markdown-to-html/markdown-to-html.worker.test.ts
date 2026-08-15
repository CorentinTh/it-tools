import { describe, expect, it } from 'vitest';
import { handleMarkdownWorkerRequest } from './markdown-to-html.worker';
import { MARKDOWN_ERROR_MESSAGES } from './markdown-to-html.worker.protocol';

describe('Markdown rendering worker', () => {
  it('renders a valid explicit task', () => {
    expect(handleMarkdownWorkerRequest({ jobId: 6, task: { source: '# Heading' } })).toMatchObject({
      jobId: 6,
      type: 'result',
      result: { value: '<h1>Heading</h1>\n' },
    });
  });

  it('rejects empty input with a stable message', () => {
    expect(handleMarkdownWorkerRequest({ jobId: 6, task: { source: '' } })).toEqual({
      jobId: 6,
      type: 'error',
      code: 'validation',
      message: MARKDOWN_ERROR_MESSAGES.validation,
    });
  });
});
