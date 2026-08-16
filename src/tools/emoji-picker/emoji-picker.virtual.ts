import type { EmojiInfo } from './emoji.types';

export const EMOJI_VIRTUAL_ROW_HEIGHT = 72;
export const EMOJI_VIRTUAL_HEADER_HEIGHT = 42;
export const EMOJI_VIRTUAL_OVERSCAN_ROWS = 1;

export interface EmojiVirtualCell {
  emojiInfo: EmojiInfo
  index: number
}

export type EmojiVirtualRow = {
  height: number
  offset: number
  type: 'header'
  group: string
} | {
  height: number
  offset: number
  type: 'emoji'
  cells: EmojiVirtualCell[]
};

export function getEmojiVirtualColumnCount(width: number) {
  if (width >= 1_280) {
    return 6;
  }
  if (width >= 1_024) {
    return 4;
  }
  if (width >= 768) {
    return 3;
  }
  if (width >= 640) {
    return 2;
  }
  return 1;
}

export function createEmojiVirtualRows(
  emojiInfos: readonly EmojiInfo[],
  columns: number,
  showGroupHeaders: boolean,
): EmojiVirtualRow[] {
  const safeColumns = Math.max(1, Math.floor(columns));
  const rows: EmojiVirtualRow[] = [];
  let offset = 0;
  let index = 0;

  for (let groupStart = 0; groupStart < emojiInfos.length;) {
    const group = emojiInfos[groupStart].group;
    let groupEnd = groupStart + 1;
    while (groupEnd < emojiInfos.length && emojiInfos[groupEnd].group === group) {
      groupEnd += 1;
    }

    if (showGroupHeaders) {
      rows.push({ group, height: EMOJI_VIRTUAL_HEADER_HEIGHT, offset, type: 'header' });
      offset += EMOJI_VIRTUAL_HEADER_HEIGHT;
    }

    for (let rowStart = groupStart; rowStart < groupEnd; rowStart += safeColumns) {
      const cells = emojiInfos.slice(rowStart, Math.min(groupEnd, rowStart + safeColumns))
        .map(emojiInfo => ({ emojiInfo, index: index++ }));
      rows.push({ cells, height: EMOJI_VIRTUAL_ROW_HEIGHT, offset, type: 'emoji' });
      offset += EMOJI_VIRTUAL_ROW_HEIGHT;
    }
    groupStart = groupEnd;
  }

  return rows;
}

export function getEmojiVirtualHeight(rows: readonly EmojiVirtualRow[]) {
  const lastRow = rows.at(-1);
  return lastRow ? lastRow.offset + lastRow.height : 0;
}

export function getVisibleEmojiVirtualRows(
  rows: readonly EmojiVirtualRow[],
  scrollTop: number,
  viewportHeight: number,
) {
  const overscan = EMOJI_VIRTUAL_OVERSCAN_ROWS * EMOJI_VIRTUAL_ROW_HEIGHT;
  const start = Math.max(0, scrollTop - overscan);
  const end = Math.max(start, scrollTop + viewportHeight + overscan);
  return rows.filter(row => row.offset + row.height >= start && row.offset <= end);
}

export function getEmojiVirtualRowForIndex(rows: readonly EmojiVirtualRow[], index: number) {
  return rows.find(row => row.type === 'emoji' && row.cells.some(cell => cell.index === index));
}
