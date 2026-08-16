import emojiUnicodeData from 'unicode-emoji-json';
import { describe, expect, it } from 'vitest';
import {
  ALL_EMOJI_GROUPS,
  createEmojiCatalog,
  filterEmojiGroup,
  getEmojiCodePoints,
  getEmojiGroups,
  getEmojiUnicodeEscape,
} from './emoji-picker.model';

describe('emoji picker model', () => {
  it('keeps complex ZWJ and flag sequences complete in copy metadata', () => {
    expect(getEmojiCodePoints('👨‍👩‍👧‍👦'))
      .toBe('0x1f468 0x200d 0x1f469 0x200d 0x1f467 0x200d 0x1f466');
    expect(getEmojiUnicodeEscape('👨‍👩‍👧‍👦'))
      .toBe('\\ud83d\\udc68\\u200d\\ud83d\\udc69\\u200d\\ud83d\\udc67\\u200d\\ud83d\\udc66');
    expect(getEmojiCodePoints('🇺🇳')).toBe('0x1f1fa 0x1f1f3');
    expect(getEmojiUnicodeEscape('🇺🇳')).toBe('\\ud83c\\uddfa\\ud83c\\uddf3');
  });

  it('builds the complete catalog without changing emoji sequence keys', () => {
    const catalog = createEmojiCatalog(emojiUnicodeData);
    const family = catalog.find(({ emoji }) => emoji === '👨‍👩‍👧‍👦');
    const unitedNationsFlag = catalog.find(({ emoji }) => emoji === '🇺🇳');
    const faceWithBags = catalog.find(({ emoji }) => emoji === '🫩');

    expect(catalog).toHaveLength(1914);
    expect(family).toMatchObject({
      emoji: '👨‍👩‍👧‍👦',
      title: 'Family man, woman, girl, boy',
      group: 'People & Body',
    });
    expect(unitedNationsFlag).toMatchObject({
      emoji: '🇺🇳',
      title: 'Flag United Nations',
      group: 'Flags',
    });
    expect(faceWithBags).toMatchObject({
      emoji: '🫩',
      title: 'Face with bags under eyes',
      emoji_version: '16.0',
    });
  });

  it('filters categories without duplicating entries', () => {
    const catalog = createEmojiCatalog(emojiUnicodeData);
    const allEmoji = filterEmojiGroup(catalog, ALL_EMOJI_GROUPS);

    expect(getEmojiGroups(catalog)).toContain('Flags');
    expect(allEmoji).toHaveLength(catalog.length);
    expect(allEmoji).not.toBe(catalog);
  });
});
