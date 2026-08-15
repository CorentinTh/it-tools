import { describe, expect, it } from 'vitest';
import {
  HTML_FORMAT_ERROR_MESSAGES,
  HTML_FORMAT_MAX_BYTES,
  parseHtmlFormatTask,
  parseHtmlFormatWorkerMessage,
  parseHtmlFormatWorkerRequest,
} from './html-wysiwyg-editor.worker.protocol';

describe('HTML formatter worker protocol', () => {
  it('accepts exact bounded tasks and rejects empty, extra, and oversized input', () => {
    expect(parseHtmlFormatTask({ html: '<p>Hello</p>' })).toEqual({ html: '<p>Hello</p>' });
    expect(() => parseHtmlFormatTask({ html: '' })).toThrowError(HTML_FORMAT_ERROR_MESSAGES.validation);
    expect(() => parseHtmlFormatTask({ html: '<p>x</p>', secret: true })).toThrow();
    expect(() => parseHtmlFormatTask({ html: '€'.repeat(Math.floor(HTML_FORMAT_MAX_BYTES / 3) + 1) }))
      .toThrowError(HTML_FORMAT_ERROR_MESSAGES.limit);
    expect(() => parseHtmlFormatWorkerRequest({ jobId: 1, task: { html: '<p>x</p>' }, extra: true })).toThrow();
  });

  it('accepts bounded result metadata and static errors only', () => {
    expect(parseHtmlFormatWorkerMessage({
      jobId: 3,
      type: 'result',
      result: { byteLength: 13, html: '<p>Hello</p>' },
    })).toMatchObject({ type: 'result', result: { html: '<p>Hello</p>' } });
    expect(parseHtmlFormatWorkerMessage({
      jobId: 3,
      type: 'error',
      code: 'formatting',
      message: HTML_FORMAT_ERROR_MESSAGES.formatting,
    })).toMatchObject({ type: 'error', code: 'formatting' });

    for (const message of [
      { jobId: 0, type: 'result', result: { byteLength: 1, html: 'x' } },
      { jobId: 1, type: 'result', result: { byteLength: 0, html: 'x' } },
      { jobId: 1, type: 'result', result: { byteLength: 1, html: 'x', secret: true } },
      { jobId: 1, type: 'error', code: 'formatting', message: 'private parser detail' },
    ]) {
      expect(() => parseHtmlFormatWorkerMessage(message)).toThrowError(/invalid message/);
    }
  });
});
