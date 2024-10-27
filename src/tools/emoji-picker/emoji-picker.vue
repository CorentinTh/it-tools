<script setup lang="ts">
import emojiUnicodeData from 'unicode-emoji-json';
import emojiKeywords from 'emojilib';
import _ from 'lodash';
import { IconChevronRight, IconSearch } from '@tabler/icons-vue';
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

const emojisPerPage = 30; // Number of emojis to load per group initially

// Tracks how many emojis are shown per group and the collapsed state of each group
const groupLoadLimits = ref(
  emojisGroups.reduce((acc, group) => {
    acc[group.group] = { limit: emojisPerPage, collapsed: false };
    return acc;
  }, {} as Record<string, { limit: number; collapsed: boolean }>),
);

// Toggles the visibility of the emoji group
function toggleGroup(group: string) {
  groupLoadLimits.value[group].collapsed = !groupLoadLimits.value[group].collapsed;
};

// Loads more emojis incrementally
function loadMoreEmojis(group: string) {
  groupLoadLimits.value[group].limit += emojisPerPage;
};

// Loads all emojis in the group at once
function loadAllEmojis(group: string) {
  groupLoadLimits.value[group].limit = emojisGroups.find(g => g.group === group)?.emojiInfos.length || 0;
};
</script>

<template>
  <div mx-auto max-w-2400px important:flex-1>
    <!-- Emoji Search Bar -->
    <div flex items-center gap-3>
      <c-input-text
        v-model:value="searchQuery"
        placeholder="Search emojis (e.g. 'smile')..."
        mx-auto max-w-600px
      >
        <template #prefix>
          <n-icon :component="IconSearch" mr-6px color-black op-70 dark:color-white />
        </template>
      </c-input-text>
    </div>

    <!-- Emoji Search Results -->
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

    <div v-for="{ group, emojiInfos } in emojisGroups" :key="group">
      <!-- Collapsible Group Header with Chevron Icons -->
      <div
        mt-4 text-20px font-bold
        style="cursor: pointer;"
        @click="toggleGroup(group)"
      >
        <n-icon
          :component="IconChevronRight"
          :class="{ 'rotate-0': groupLoadLimits[group].collapsed, 'rotate-90': !groupLoadLimits[group].collapsed }"
          mr-1 text-16px lh-1 op-50 transition
        />
        <span>{{ group }}</span>
      </div>

      <!-- Emoji Grid, conditionally displayed based on collapse state -->
      <div v-show="!groupLoadLimits[group].collapsed">
        <emoji-grid :emoji-infos="emojiInfos.slice(0, groupLoadLimits[group].limit)" />

        <div v-if="groupLoadLimits[group].limit < emojiInfos.length" style="display: flex; gap: 8px; margin-top: 8px; justify-content: center;">
          <c-button @click="loadMoreEmojis(group)">
            Load More
          </c-button>
          <c-button @click="loadAllEmojis(group)">
            Load All
          </c-button>
        </div>
      </div>
    </div>
  </div>
</template>
