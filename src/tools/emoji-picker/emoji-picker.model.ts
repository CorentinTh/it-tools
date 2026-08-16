import type emojiUnicodeData from 'unicode-emoji-json';
import type { EmojiInfo, EmojiKeywordMap } from './emoji.types';

export const ALL_EMOJI_GROUPS = '__all__';
export const EMOJI_DATASET_LABEL = 'Unicode Emoji 16.0';

type EmojiUnicodeData = typeof emojiUnicodeData;

function capitalize(value: string) {
  return value.length === 0 ? value : `${value[0].toUpperCase()}${value.slice(1)}`;
}

/**
 * Keep the complete UTF-16 representation. ZWJ, variation selectors, skin
 * tones and regional indicator pairs must not be truncated to the first code
 * point when users copy the value.
 */
export function getEmojiUnicodeEscape(emoji: string) {
  return emoji
    .split('')
    .map(unit => unit.charCodeAt(0))
    .map(codeUnit => `\\u${codeUnit.toString(16).padStart(4, '0')}`)
    .join('');
}

export function getEmojiCodePoints(emoji: string) {
  return Array.from(emoji, symbol => `0x${symbol.codePointAt(0)?.toString(16)}`).join(' ');
}

export function createEmojiCatalog(data: EmojiUnicodeData): EmojiInfo[] {
  return Object.entries(data).map(([emoji, emojiInfo]) => ({
    ...emojiInfo,
    emoji,
    title: capitalize(emojiInfo.name),
    codePoints: getEmojiCodePoints(emoji),
    unicode: getEmojiUnicodeEscape(emoji),
  }));
}

export function addEmojiKeywords(
  emojiInfos: readonly EmojiInfo[],
  keywordMap: EmojiKeywordMap,
) {
  return emojiInfos.map(emojiInfo => ({
    ...emojiInfo,
    keywords: keywordMap[emojiInfo.emoji],
  }));
}

export function getEmojiGroups(emojiInfos: readonly EmojiInfo[]) {
  return [...new Set(emojiInfos.map(({ group }) => group))];
}

export function filterEmojiGroup(
  emojiInfos: readonly EmojiInfo[],
  group: string,
) {
  return group === ALL_EMOJI_GROUPS
    ? [...emojiInfos]
    : emojiInfos.filter(emojiInfo => emojiInfo.group === group);
}
