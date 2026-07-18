import type emojiUnicodeData from 'unicode-emoji-json';
import type { EmojiInfo, EmojiKeywordMap } from './emoji.types';

export const EMOJI_PAGE_SIZE = 60;
export const ALL_EMOJI_GROUPS = '__all__';

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

export function getEmojiPage(
  emojiInfos: readonly EmojiInfo[],
  visibleCount: number,
) {
  return emojiInfos.slice(0, Math.max(0, visibleCount));
}

export function groupEmojiInfos(emojiInfos: readonly EmojiInfo[]) {
  const groupedEmojiInfos = new Map<string, EmojiInfo[]>();

  for (const emojiInfo of emojiInfos) {
    const group = groupedEmojiInfos.get(emojiInfo.group) ?? [];
    group.push(emojiInfo);
    groupedEmojiInfos.set(emojiInfo.group, group);
  }

  return [...groupedEmojiInfos].map(([group, infos]) => ({
    group,
    emojiInfos: infos,
  }));
}
