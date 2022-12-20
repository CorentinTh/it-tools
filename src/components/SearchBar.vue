<script lang="ts" setup>
import { useFuzzySearch } from '@/composable/fuzzySearch';
import { tools } from '@/tools';
import type { Tool } from '@/tools/tools.types';
import { SearchRound } from '@vicons/material';
import { useMagicKeys, whenever } from '@vueuse/core';
import { computed, h, ref } from 'vue';
import { useRouter } from 'vue-router';
import SearchBarItem from './SearchBarItem.vue';

const router = useRouter();
const queryString = ref('');

const { searchResult } = useFuzzySearch({
  search: queryString,
  data: tools,
  options: { keys: [{ name: 'name', weight: 2 }, 'description', 'keywords'] },
});

const toolToOption = (tool: Tool) => ({ label: tool.name, value: tool.path, tool });

const options = computed(() => {
  if (queryString.value === '') {
    return tools.map(toolToOption);
  }

  return searchResult.value.map(toolToOption);
});

function onSelect(path: string) {
  router.push(path);
  queryString.value = '';
}

const focusTarget = ref();

const keys = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.ctrlKey && e.key === 'k' && e.type === 'keydown') {
      e.preventDefault();
    }
  },
});

whenever(keys.ctrl_k, () => {
  focusTarget.value.focus();
});

function renderOption({ tool }: { tool: Tool }) {
  return h(SearchBarItem, { tool });
}
</script>

<template>
  <div class="search-bar">
    <n-auto-complete
      v-model:value="queryString"
      :options="options"
      :on-select="(value) => onSelect(String(value))"
      :render-label="renderOption"
      :default-value="'aa'"
      :get-show="() => true"
      :on-focus="() => $tracker.trackEvent({ eventName: 'Search-bar focused' })"
    >
      <template #default="{ handleInput, handleBlur, handleFocus, value: slotValue }">
        <n-input
          ref="focusTarget"
          round
          clearable
          placeholder="Search a tool... [Ctrl + K]"
          :value="slotValue"
          :input-props="{ autocomplete: 'disabled' }"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
        >
          <template #prefix>
            <n-icon :component="SearchRound" />
          </template>
        </n-input>
      </template>
    </n-auto-complete>
  </div>
</template>
