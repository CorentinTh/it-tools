import { describe, expect, it } from 'vitest';
import { handleYamlConverterWorkerRequest } from './yaml-converter.worker';

function request(conversion: 'yaml-to-json' | 'yaml-to-toml', source: string) {
  return handleYamlConverterWorkerRequest({ jobId: 1, task: { conversion, source } });
}

describe('YAML converter worker', () => {
  it('converts YAML to JSON and TOML', async () => {
    await expect(request('yaml-to-json', 'name: worker\nenabled: true')).resolves.toMatchObject({
      type: 'result',
      result: { value: '{\n   "name": "worker",\n   "enabled": true\n}' },
    });
    await expect(request('yaml-to-toml', 'name: worker\nenabled: true')).resolves.toMatchObject({
      type: 'result',
      result: { value: 'name = "worker"\nenabled = true' },
    });
  });

  it('preserves valid false and zero YAML scalars in JSON output', async () => {
    await expect(request('yaml-to-json', 'false')).resolves.toMatchObject({ type: 'result', result: { value: 'false' } });
    await expect(request('yaml-to-json', '0')).resolves.toMatchObject({ type: 'result', result: { value: '0' } });
  });
});
