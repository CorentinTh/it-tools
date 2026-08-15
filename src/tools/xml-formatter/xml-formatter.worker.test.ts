import { describe, expect, it } from 'vitest';
import { handleXmlWorkerRequest } from './xml-formatter.worker';
import { XML_ERROR_MESSAGES } from './xml-formatter.worker.protocol';

function request(source: string) {
  return { jobId: 5, task: { collapseContent: true, indentSize: 2, source } };
}

describe('XML formatting worker', () => {
  it('formats a valid explicit task', () => {
    expect(handleXmlWorkerRequest(request('<root><item>value</item></root>'))).toMatchObject({
      jobId: 5,
      type: 'result',
      result: { value: '<root>\n  <item>value</item>\n</root>' },
    });
  });

  it('returns a stable error for malformed XML', () => {
    expect(handleXmlWorkerRequest(request('hello world'))).toEqual({
      jobId: 5,
      type: 'error',
      code: 'processing',
      message: XML_ERROR_MESSAGES.processing,
    });
  });
});
