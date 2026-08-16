<script setup lang="ts">
import emojiUnicodeData from 'unicode-emoji-json';
import type { EmojiInfo } from './emoji.types';
import { createEmojiSearchWorkerClient } from './emoji-picker.worker-client';
import { EMOJI_SEARCH_DEBOUNCE_MS } from './emoji-picker.worker.protocol';
import {
  ALL_EMOJI_GROUPS,
  EMOJI_DATASET_LABEL,
  createEmojiCatalog,
  filterEmojiGroup,
  getEmojiGroups,
} from './emoji-picker.model';

const emojiCatalog = createEmojiCatalog(emojiUnicodeData);
const emojiGroups = getEmojiGroups(emojiCatalog);
const emojiByValue = new Map(emojiCatalog.map(info => [info.emoji, info]));

const searchQuery = ref('');
const selectedGroup = ref(ALL_EMOJI_GROUPS);
const searchResults = shallowRef<string[]>();
const searchError = ref('');
const isSearching = ref(false);
const searchClient = createEmojiSearchWorkerClient();
let searchTimer: ReturnType<typeof globalThis.setTimeout> | undefined;
let searchRevision = 0;

const normalizedSearchQuery = computed(() => searchQuery.value.trim());
const matchingEmojiInfos = computed(() => {
  const query = normalizedSearchQuery.value;
  const matchingCatalog = query
    ? (searchResults.value ?? []).map(emoji => emojiByValue.get(emoji)).filter((info): info is EmojiInfo => info !== undefined)
    : emojiCatalog;

  return filterEmojiGroup(matchingCatalog, selectedGroup.value);
});
const virtualResetKey = computed(() => `${normalizedSearchQuery.value}\u0000${selectedGroup.value}`);

watch(normalizedSearchQuery, (query) => {
  if (searchTimer !== undefined) {
    globalThis.clearTimeout(searchTimer);
    searchTimer = undefined;
  }
  const currentRevision = ++searchRevision;
  searchClient.cancel();
  searchError.value = '';

  if (!query) {
    isSearching.value = false;
    searchResults.value = undefined;
    return;
  }

  isSearching.value = true;
  searchTimer = globalThis.setTimeout(async () => {
    searchTimer = undefined;
    try {
      const result = await searchClient.search(query);
      if (currentRevision === searchRevision) {
        searchResults.value = result.value;
      }
    }
    catch {
      if (currentRevision === searchRevision) {
        searchResults.value = [];
        searchError.value = 'Emoji search could not be completed. Please try again.';
      }
    }
    finally {
      if (currentRevision === searchRevision) {
        isSearching.value = false;
      }
    }
  }, EMOJI_SEARCH_DEBOUNCE_MS);
}, { immediate: true });

onScopeDispose(() => {
  ++searchRevision;
  if (searchTimer !== undefined) {
    globalThis.clearTimeout(searchTimer);
  }
  searchClient.dispose();
});

function cancelSearch() {
  ++searchRevision;
  if (searchTimer !== undefined) {
    globalThis.clearTimeout(searchTimer);
    searchTimer = undefined;
  }
  searchClient.cancel();
  isSearching.value = false;
  searchError.value = 'Emoji search was cancelled.';
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
      {{ isSearching ? 'Searching emojis…' : `${matchingEmojiInfos.length} emojis available` }}
    </div>
    <div mt-1 text-xs op-60 data-test-id="emoji-dataset-version">
      Dataset: {{ EMOJI_DATASET_LABEL }} (unicode-emoji-json, local only)
    </div>

    <div v-if="isSearching" mt-3>
      <c-button data-test-id="emoji-cancel-search" @click="cancelSearch">
        Cancel search
      </c-button>
    </div>

    <div v-if="searchError" role="alert" mt-3>
      {{ searchError }}
    </div>

    <div v-if="!isSearching && matchingEmojiInfos.length === 0" mt-4 text-20px font-bold role="status">
      No results
    </div>

    <div v-else id="emoji-results" data-test-id="emoji-results" mt-4>
      <div v-if="normalizedSearchQuery" mb-2 text-20px font-bold>
        Search results
      </div>
      <emoji-virtual-grid
        :emoji-infos="matchingEmojiInfos"
        :reset-key="virtualResetKey"
        :show-group-headers="!normalizedSearchQuery"
      />
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
