import emojiUnicodeData from 'unicode-emoji-json';
import { describe, expect, it } from 'vitest';
import { createEmojiCatalog } from './emoji-picker.model';
import {
  EMOJI_VIRTUAL_HEADER_HEIGHT,
  EMOJI_VIRTUAL_OVERSCAN_ROWS,
  EMOJI_VIRTUAL_ROW_HEIGHT,
  createEmojiVirtualRows,
  getEmojiVirtualColumnCount,
  getEmojiVirtualHeight,
  getEmojiVirtualRowForIndex,
  getVisibleEmojiVirtualRows,
} from './emoji-picker.virtual';

const catalog = createEmojiCatalog(emojiUnicodeData);

describe('emoji virtual grid model', () => {
  it('uses deterministic responsive columns', () => {
    expect([639, 640, 768, 1_024, 1_280].map(getEmojiVirtualColumnCount)).toEqual([1, 2, 3, 4, 6]);
  });

  it('preserves source order and group headers while assigning global positions', () => {
    const rows = createEmojiVirtualRows(catalog.slice(0, 80), 6, true);
    const cells = rows.flatMap(row => row.type === 'emoji' ? row.cells : []);

    expect(rows[0]).toMatchObject({ type: 'header', offset: 0, height: EMOJI_VIRTUAL_HEADER_HEIGHT });
    expect(cells.map(({ emojiInfo }) => emojiInfo)).toEqual(catalog.slice(0, 80));
    expect(cells.map(({ index }) => index)).toEqual(cells.map((_, index) => index));
    expect(getEmojiVirtualHeight(rows)).toBeGreaterThan(EMOJI_VIRTUAL_ROW_HEIGHT);
  });

  it('returns only the viewport plus fixed overscan and locates keyboard targets', () => {
    const rows = createEmojiVirtualRows(catalog, 6, false);
    const visible = getVisibleEmojiVirtualRows(rows, 5_000, 640);
    const maximumRows = Math.ceil(640 / EMOJI_VIRTUAL_ROW_HEIGHT) + EMOJI_VIRTUAL_OVERSCAN_ROWS * 2 + 2;

    expect(visible.length).toBeLessThanOrEqual(maximumRows);
    expect(visible.length).toBeLessThan(rows.length);
    expect(getEmojiVirtualRowForIndex(rows, 1_913)).toMatchObject({ type: 'emoji' });
    expect(getEmojiVirtualRowForIndex(rows, 1_914)).toBeUndefined();
  });
});
