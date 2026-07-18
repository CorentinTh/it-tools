import { describe, expect, it, vi } from 'vitest';
import type { TextDownloadPlatform } from './downloadText';
import { downloadTextFile } from './downloadText';

function createPlatform() {
  const anchor = { href: '', download: '', click: vi.fn() };
  const platform: TextDownloadPlatform = {
    createAnchor: vi.fn(() => anchor),
    createObjectUrl: vi.fn(() => 'blob:nanoids'),
    revokeObjectUrl: vi.fn(),
  };

  return { anchor, platform };
}

describe('downloadTextFile', () => {
  it('downloads UTF-8 text and always revokes its object URL', () => {
    const { anchor, platform } = createPlatform();

    downloadTextFile({ content: 'one\ntwo\n🚀', filename: 'nanoids.txt', platform });

    expect(platform.createObjectUrl).toHaveBeenCalledOnce();
    const blob = vi.mocked(platform.createObjectUrl).mock.calls[0][0];
    expect(blob.type).toBe('text/plain;charset=utf-8');
    expect(anchor).toMatchObject({ href: 'blob:nanoids', download: 'nanoids.txt' });
    expect(anchor.click).toHaveBeenCalledOnce();
    expect(platform.revokeObjectUrl).toHaveBeenCalledWith('blob:nanoids');
  });

  it('revokes the URL when anchor activation fails', () => {
    const { anchor, platform } = createPlatform();
    anchor.click.mockImplementation(() => {
      throw new Error('activation failed');
    });

    expect(() => downloadTextFile({ content: 'id', filename: 'nanoids.txt', platform }))
      .toThrow('activation failed');
    expect(platform.revokeObjectUrl).toHaveBeenCalledWith('blob:nanoids');
  });

  it.each(['', '   ', '../nanoids.txt', 'folder\\nanoids.txt'])(
    'rejects unsafe filename %j',
    (filename) => {
      const { platform } = createPlatform();

      expect(() => downloadTextFile({ content: 'id', filename, platform })).toThrow();
      expect(platform.createObjectUrl).not.toHaveBeenCalled();
    },
  );

  it('rejects empty content without allocating an object URL', () => {
    const { platform } = createPlatform();

    expect(() => downloadTextFile({ content: '', filename: 'nanoids.txt', platform }))
      .toThrow('Text content is empty.');
    expect(platform.createObjectUrl).not.toHaveBeenCalled();
  });
});
