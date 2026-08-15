import { describe, expect, it } from 'vitest';
import { handleXmlDataConverterWorkerRequest } from './xml-data-converter.worker';

describe('XML data converter worker', () => {
  it('converts XML to formatted JSON while preserving Unicode', async () => {
    await expect(handleXmlDataConverterWorkerRequest({
      jobId: 1,
      task: { conversion: 'xml-to-json', source: '<message language="ru">Привет 👋</message>' },
    })).resolves.toMatchObject({
      jobId: 1,
      type: 'result',
      result: { value: expect.stringContaining('Привет 👋') },
    });
  });

  it('converts JSON5 to compact XML', async () => {
    await expect(handleXmlDataConverterWorkerRequest({
      jobId: 2,
      task: { conversion: 'json-to-xml', source: '{message: {_text: \'hello\'}}' },
    })).resolves.toMatchObject({
      jobId: 2,
      type: 'result',
      result: { value: '<message>hello</message>' },
    });
  });

  it('returns a static processing error for malformed input', async () => {
    await expect(handleXmlDataConverterWorkerRequest({
      jobId: 3,
      task: { conversion: 'json-to-xml', source: '{message:' },
    })).resolves.toEqual({
      jobId: 3,
      type: 'error',
      code: 'processing',
      message: 'The document could not be converted. Check that the source is valid for this tool.',
    });
  });
});
