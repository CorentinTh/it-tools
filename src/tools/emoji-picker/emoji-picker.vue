<script setup lang="ts">
import emojiUnicodeData from 'unicode-emoji-json';
import emojiKeywords from 'emojilib';
import _ from 'lodash';
import type { EmojiInfo } from './emoji.types';
import { useFuzzySearch } from '@/composable/fuzzySearch';
import useDebouncedRef from '@/composable/debouncedref';

const escapeUnicode = ({ emoji }: { emoji: string }) => emoji.split('').map(unit => `\\u${unit.charCodeAt(0).toString(16).padStart(4, '0')}`).join('');
const getEmojiCodePoints = ({ emoji }: { emoji: string }) => emoji.codePointAt(0) ? `0x${emoji.codePointAt(0)?.toString(16)}` : undefined;

const emojis = _.map(emojiUnicodeData, (emojiInfo, emoji) => ({
  ...emojiInfo,
  emoji,
  title: _.capitalize(emojiInfo.name),
  keywords: emojiKeywords[emoji as keyof typeof emojiKeywords],
  codePoints: getEmojiCodePoints({ emoji }),
  unicode: escapeUnicode({ emoji }),
}));

const emojisGroups: { emojiInfos: EmojiInfo[]; group: string }[] = _
  .chain(emojis)
  .groupBy('group')
  .map((emojiInfos, group) => ({ group, emojiInfos }))
  .value();

const searchQuery = useDebouncedRef('', 500);

const { searchResult } = useFuzzySearch({
  search: searchQuery,
  data: emojis,
  options: {
    keys: ['group', { name: 'name', weight: 3 }, 'keywords', 'unicode', 'codePoints', 'emoji'],
    threshold: 0.3,
    useExtendedSearch: true,
    isCaseSensitive: false,
  },
});
</script>

<template>
  <div mx-auto max-w-2400px important:flex-1>
    <div flex items-center gap-3>
      <c-input-text
        v-model:value="searchQuery"
        placeholder="Search emojis (e.g. 'smile')..."
        mx-auto max-w-600px
      >
        <template #prefix>
          <icon-mdi-search mr-6px color-black op-70 dark:color-white />
        </template>
      </c-input-text>
    </div>

    <div v-if="searchQuery.trim().length > 0">
      <div
        v-if="searchResult.length === 0"
        mt-4
        text-20px
        font-bold
      >
        No results
      </div>

      <div v-else>
        <div mt-4 text-20px font-bold>
          Search result
        </div>

        <emoji-grid :emoji-infos="searchResult" />
      </div>
    </div>

    <div
      v-for="{ group, emojiInfos } in emojisGroups"
      v-else
      :key="group"
    >
      <div mt-4 text-20px font-bold>
        {{ group }}
      </div>

      <emoji-grid :emoji-infos="emojiInfos" />
    </div>
  </div>
</template>
