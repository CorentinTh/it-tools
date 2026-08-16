import { describe, expect, it } from 'vitest';
import { handleImageMetadataRequest } from './image-metadata-remover.worker-handler';
import { IMAGE_METADATA_MAX_FILE_BYTES, parseImageMetadataMessage } from './image-metadata-remover.worker.protocol';

function jpegWithExif(): File {
  const bytes = new Uint8Array([
    0xFF, 0xD8,
    0xFF, 0xE1, 0x00, 0x08, 0x45, 0x78, 0x69, 0x66, 0, 0,
    0xFF, 0xDA, 0x00, 0x04, 1, 2,
    1, 2, 3,
    0xFF, 0xD9,
  ]);
  const file = new File([bytes], 'private.jpg', { type: 'image/jpeg' });
  Object.defineProperty(file, 'arrayBuffer', { value: async () => bytes.buffer.slice(0) });
  return file;
}

describe('image metadata worker', () => {
  it('returns a bounded transferable result with static metadata', async () => {
    const file = jpegWithExif();
    const message = await handleImageMetadataRequest({ jobId: 7, task: { file } });
    expect(message.type).toBe('result');
    if (message.type !== 'result') {
      throw new Error('Expected a result message.');
    }
    expect(message.result.inputBytes - message.result.outputBytes).toBe(message.result.removedBytes);
    expect(message.result.removedItems.reduce((sum, item) => sum + item.bytes, 0)).toBe(message.result.removedBytes);
    expect(Object.prototype.toString.call(message.result.output)).toBe('[object ArrayBuffer]');
    const parsed = parseImageMetadataMessage(message);
    expect(parsed.type).toBe('result');
    if (parsed.type !== 'result') {
      throw new Error('Expected a result message.');
    }
    expect(parsed.result).toMatchObject({
      inputBytes: file.size,
      mimeType: 'image/jpeg',
      removedBytes: 10,
      removedItems: [{ type: 'JPEG APP1', count: 1, bytes: 10 }],
    });
    expect(parsed.result.output.byteLength).toBe(file.size - 10);
  });

  it('rejects malformed and oversized tasks without echoing private content', async () => {
    const malformed = await handleImageMetadataRequest({ jobId: 8, task: { file: 'private-image' } });
    expect(malformed).toEqual({ jobId: 8, type: 'error', code: 'validation', message: 'Select one non-empty local JPEG, PNG, or WebP image.' });
    expect(JSON.stringify(malformed)).not.toContain('private-image');

    const oversized = new Blob(['x']);
    Object.defineProperty(oversized, 'size', { value: IMAGE_METADATA_MAX_FILE_BYTES + 1 });
    await expect(handleImageMetadataRequest({ jobId: 9, task: { file: oversized } }))
      .resolves.toMatchObject({ type: 'error', code: 'limit' });
  });

  it('rejects unknown result keys and inconsistent output accounting', () => {
    expect(() => parseImageMetadataMessage({
      jobId: 1,
      type: 'result',
      result: { inputBytes: 2, outputBytes: 1, mimeType: 'image/png', removedBytes: 0, removedItems: [], output: new ArrayBuffer(1) },
    })).toThrow(/invalid message/u);
  });
});
