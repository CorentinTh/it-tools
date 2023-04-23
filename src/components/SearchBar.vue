<script lang="ts" setup>
import { useFuzzySearch } from '@/composable/fuzzySearch';
import { useTracker } from '@/modules/tracker/tracker.services';
import { tools } from '@/tools';
import type { Tool } from '@/tools/tools.types';
import { SearchRound } from '@vicons/material';
import { useMagicKeys, whenever } from '@vueuse/core';
import type { NInput } from 'naive-ui';
import { computed, h, ref } from 'vue';
import { useRouter } from 'vue-router';
import SearchBarItem from './SearchBarItem.vue';

const toolToOption = (tool: Tool) => ({ label: tool.name, value: tool.path, tool });

const router = useRouter();
const { tracker } = useTracker();

const queryString = ref('');
const inputEl = ref<HTMLElement>();
const displayDropDown = ref(true);
const isMac = computed(() => window.navigator.userAgent.toLowerCase().includes('mac'));

const options = computed(() => {
  if (queryString.value === '') {
    return tools.map(toolToOption);
  }

  return searchResult.value.map(toolToOption);
});

const { searchResult } = useFuzzySearch({
  search: queryString,
  data: tools,
  options: { keys: [{ name: 'name', weight: 2 }, 'description', 'keywords'] },
});

const keys = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.ctrlKey && e.key === 'k' && e.type === 'keydown') {
      e.preventDefault();
    }

    if (e.metaKey && e.key === 'k' && e.type === 'keydown') {
      e.preventDefault();
    }
  },
});

whenever(keys.ctrl_k, claimFocus);
whenever(keys.meta_k, claimFocus);
whenever(keys.escape, releaseFocus);

function renderOption({ tool }: { tool: Tool }) {
  return h(SearchBarItem, { tool });
}

function onSelect(path: string) {
  router.push(path);
  queryString.value = '';
}

function claimFocus() {
  displayDropDown.value = true;

  inputEl.value?.focus();
}

function releaseFocus() {
  displayDropDown.value = false;
}

function onFocus() {
  tracker.trackEvent({ eventName: 'Search-bar focused' });
  displayDropDown.value = true;
}
</script>

<template>
  <div class="search-bar">
    <n-auto-complete
      v-model:value="queryString"
      :options="options"
      :on-select="(value: string | number) => onSelect(String(value))"
      :render-label="renderOption"
      :default-value="'aa'"
      :get-show="() => displayDropDown"
      :on-focus="onFocus"
      @update:value="() => (displayDropDown = true)"
    >
      <template #default="{ handleInput, handleBlur, handleFocus, value: slotValue }">
        <n-input
          ref="inputEl"
          round
          clearable
          :placeholder="`Search a tool (use ${isMac ? 'Cmd' : 'Ctrl'} + K to focus)`"
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
