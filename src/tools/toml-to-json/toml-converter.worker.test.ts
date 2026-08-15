import { describe, expect, it } from 'vitest';
import { handleTomlConverterWorkerRequest } from './toml-converter.worker';

function request(conversion: 'toml-to-json' | 'toml-to-yaml', source: string) {
  return handleTomlConverterWorkerRequest({ jobId: 1, task: { conversion, source } });
}

describe('TOML converter worker', () => {
  it('parses TOML once and converts it to JSON or YAML', async () => {
    await expect(request('toml-to-json', 'name = "worker"\nenabled = true')).resolves.toMatchObject({
      type: 'result',
      result: { value: '{\n   "name": "worker",\n   "enabled": true\n}' },
    });
    await expect(request('toml-to-yaml', 'name = "worker"\nenabled = true')).resolves.toMatchObject({
      type: 'result',
      result: { value: 'name: worker\nenabled: true\n' },
    });
  });

  it('returns a static processing error for malformed TOML', async () => {
    await expect(request('toml-to-json', 'name =')).resolves.toMatchObject({ type: 'error', code: 'processing' });
  });
});
