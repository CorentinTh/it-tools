import { describe, expect, it, vi } from 'vitest';
import { handleHtmlFormatWorkerRequest } from './html-wysiwyg-editor.worker-handler';
import { HTML_FORMAT_ERROR_MESSAGES } from './html-wysiwyg-editor.worker.protocol';

describe('HTML formatter worker handler', () => {
  it('formats only validated requests and includes bounded byte metadata', async () => {
    const formatter = vi.fn().mockResolvedValue('<p>Hello</p>\n');

    await expect(handleHtmlFormatWorkerRequest({ jobId: 5, task: { html: '<p>Hello</p>' } }, formatter))
      .resolves.toEqual({
        jobId: 5,
        type: 'result',
        result: { byteLength: 13, html: '<p>Hello</p>\n' },
      });
    expect(formatter).toHaveBeenCalledWith({ html: '<p>Hello</p>' });
  });

  it('rejects invalid requests before formatting and hides parser details', async () => {
    const unusedFormatter = vi.fn();
    await expect(handleHtmlFormatWorkerRequest({ jobId: 8, task: { html: '' } }, unusedFormatter))
      .resolves.toEqual({
        jobId: 8,
        type: 'error',
        code: 'validation',
        message: HTML_FORMAT_ERROR_MESSAGES.validation,
      });
    expect(unusedFormatter).not.toHaveBeenCalled();

    const failingFormatter = vi.fn().mockRejectedValue(new Error('private parser detail'));
    const result = await handleHtmlFormatWorkerRequest(
      { jobId: 9, task: { html: '<p>x</p>' } },
      failingFormatter,
    );
    expect(result).toEqual({
      jobId: 9,
      type: 'error',
      code: 'formatting',
      message: HTML_FORMAT_ERROR_MESSAGES.formatting,
    });
    expect(JSON.stringify(result)).not.toContain('private parser detail');
  });
});
