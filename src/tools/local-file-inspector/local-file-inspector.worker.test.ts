import { Blob as NodeBlob } from 'node:buffer';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleFileInspectorRequest } from './local-file-inspector.worker-handler';

describe('local file inspector worker', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('streams a file into signature, CRC-32, and bounded hex output', async () => {
    vi.stubGlobal('Blob', NodeBlob);
    const progress: unknown[] = [];
    const file = new Blob([new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x41])]);
    const message = await handleFileInspectorRequest({ jobId: 7, task: { file } }, value => progress.push(value));
    expect(message.type).toBe('result');
    if (message.type !== 'result') {
      throw new Error('Expected result');
    }
    expect(message.result.detectedName).toBe('PNG image');
    expect(message.result.fileSize).toBe(9);
    expect(message.result.previewBytes).toBe(9);
    expect(message.result.crc32).toMatch(/^[0-9a-f]{8}$/);
    expect(progress).toHaveLength(2);
  });

  it('returns a static validation error without echoing malformed input', async () => {
    const message = await handleFileInspectorRequest({ jobId: 3, task: { file: 'secret-value' } }, () => {});
    expect(message).toEqual({ jobId: 3, type: 'error', code: 'validation', message: 'Select a valid local file.' });
    expect(JSON.stringify(message)).not.toContain('secret-value');
  });
});
