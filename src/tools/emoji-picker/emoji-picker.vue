<script setup lang="ts">
import Fuse from 'fuse.js';
import emojiUnicodeData from 'unicode-emoji-json';
import type { EmojiKeywordMap } from './emoji.types';
import {
  ALL_EMOJI_GROUPS,
  EMOJI_PAGE_SIZE,
  addEmojiKeywords,
  createEmojiCatalog,
  filterEmojiGroup,
  getEmojiGroups,
  getEmojiPage,
  groupEmojiInfos,
} from './emoji-picker.model';

const emojiCatalog = createEmojiCatalog(emojiUnicodeData);
const emojiGroups = getEmojiGroups(emojiCatalog);

const searchQuery = ref('');
const selectedGroup = ref(ALL_EMOJI_GROUPS);
const visibleCount = ref(EMOJI_PAGE_SIZE);
const emojiKeywords = shallowRef<EmojiKeywordMap>();
let keywordLoad: Promise<void> | undefined;

const catalogWithKeywords = computed(() => emojiKeywords.value
  ? addEmojiKeywords(emojiCatalog, emojiKeywords.value)
  : emojiCatalog,
);

const searchEngine = computed(() => new Fuse(catalogWithKeywords.value, {
  keys: ['group', { name: 'name', weight: 3 }, 'keywords', 'unicode', 'codePoints', 'emoji'],
  threshold: 0.3,
  useExtendedSearch: true,
  isCaseSensitive: false,
}));

const normalizedSearchQuery = computed(() => searchQuery.value.trim());
const matchingEmojiInfos = computed(() => {
  const query = normalizedSearchQuery.value;
  const matchingCatalog = query
    ? searchEngine.value.search(query).map(({ item }) => item)
    : emojiCatalog;

  return filterEmojiGroup(matchingCatalog, selectedGroup.value);
});
const visibleEmojiInfos = computed(() => getEmojiPage(matchingEmojiInfos.value, visibleCount.value));
const visibleEmojiGroups = computed(() => groupEmojiInfos(visibleEmojiInfos.value));
const hasMore = computed(() => visibleEmojiInfos.value.length < matchingEmojiInfos.value.length);

watch([searchQuery, selectedGroup], () => {
  visibleCount.value = EMOJI_PAGE_SIZE;
});

watch(normalizedSearchQuery, (query) => {
  if (query) {
    loadEmojiKeywords();
  }
});

async function loadEmojiKeywords() {
  keywordLoad ??= import('emojilib')
    .then(({ default: keywordMap }) => {
      emojiKeywords.value = keywordMap;
    })
    .catch(() => {
      // Official Unicode names remain searchable if the optional chunk cannot
      // be loaded (for example when a stale offline tab references old assets).
    });

  await keywordLoad;
}

function showMore() {
  visibleCount.value = Math.min(
    visibleCount.value + EMOJI_PAGE_SIZE,
    matchingEmojiInfos.value.length,
  );
}
</script>

<template>
  <div mx-auto max-w-2400px important:flex-1>
    <div class="emoji-picker-controls" mx-auto max-w-900px gap-3>
      <c-input-text
        v-model:value="searchQuery"
        label="Search emojis"
        placeholder="Search emojis (e.g. 'smile')..."
        test-id="emoji-search"
        raw-text
        clearable
      >
        <template #prefix>
          <icon-mdi-search mr-6px color-black op-70 dark:color-white />
        </template>
      </c-input-text>

      <label flex flex-col gap-5px for="emoji-group">
        <span>Category</span>
        <select
          id="emoji-group"
          v-model="selectedGroup"
          data-test-id="emoji-category"
          min-h-40px
          rounded
          border="1px solid current op-30"
          bg-transparent
          px-3
        >
          <option :value="ALL_EMOJI_GROUPS">
            All categories
          </option>
          <option v-for="group in emojiGroups" :key="group" :value="group">
            {{ group }}
          </option>
        </select>
      </label>
    </div>

    <div
      data-test-id="emoji-result-status"
      mt-4
      text-sm
      op-70
      aria-live="polite"
    >
      Showing {{ visibleEmojiInfos.length }} of {{ matchingEmojiInfos.length }} emojis
    </div>

    <div v-if="matchingEmojiInfos.length === 0" mt-4 text-20px font-bold role="status">
      No results
    </div>

    <div v-else id="emoji-results" data-test-id="emoji-results">
      <template v-if="normalizedSearchQuery">
        <div mt-4 text-20px font-bold>
          Search results
        </div>
        <emoji-grid :emoji-infos="visibleEmojiInfos" />
      </template>

      <template v-else>
        <div
          v-for="{ group, emojiInfos } in visibleEmojiGroups"
          :key="group"
        >
          <div mt-4 text-20px font-bold>
            {{ group }}
          </div>

          <emoji-grid :emoji-infos="emojiInfos" />
        </div>
      </template>
    </div>

    <div v-if="hasMore" mt-5 flex justify-center>
      <c-button
        data-test-id="emoji-load-more"
        aria-controls="emoji-results"
        :aria-label="`Show ${Math.min(EMOJI_PAGE_SIZE, matchingEmojiInfos.length - visibleEmojiInfos.length)} more emojis`"
        @click="showMore"
      >
        Load more
      </c-button>
    </div>
  </div>
</template>

<style scoped>
.emoji-picker-controls {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(220px, 1fr);
}

@media (max-width: 640px) {
  .emoji-picker-controls {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
