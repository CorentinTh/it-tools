import type emojiUnicodeData from 'unicode-emoji-json';

export type EmojiInfo = {
  title: string
  emoji: string
  codePoints: string | undefined
  unicode: string
} & typeof emojiUnicodeData['\uD83E\uDD10'];
