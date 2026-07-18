import type emojiUnicodeData from 'unicode-emoji-json';

export type EmojiInfo = {
  title: string
  emoji: string
  codePoints: string
  unicode: string
  keywords?: readonly string[]
} & typeof emojiUnicodeData[string];

export type EmojiKeywordMap = Readonly<Partial<Record<string, readonly string[]>>>;
