import { describe, expect, it } from 'vitest';
import { handleJsonConverterWorkerRequest } from './json-converter.worker';

function request(conversion: 'json-minify' | 'json-to-toml' | 'json-to-yaml', source: string) {
  return handleJsonConverterWorkerRequest({ jobId: 1, task: { conversion, source } });
}

describe('JSON converter worker', () => {
  it('parses JSON5 once and converts it to TOML or YAML', async () => {
    await expect(request('json-minify', '{name:"worker", enabled:true}')).resolves.toMatchObject({
      type: 'result',
      result: { value: '{"name":"worker","enabled":true}' },
    });
    await expect(request('json-to-toml', '{name:"worker", enabled:true}')).resolves.toMatchObject({
      type: 'result',
      result: { value: 'name = "worker"\nenabled = true' },
    });
    await expect(request('json-to-yaml', '{name:"worker", enabled:true}')).resolves.toMatchObject({
      type: 'result',
      result: { value: 'name: worker\nenabled: true\n' },
    });
  });

  it('returns a static processing error for malformed JSON', async () => {
    await expect(request('json-to-yaml', '{')).resolves.toMatchObject({ type: 'error', code: 'processing' });
  });
});
