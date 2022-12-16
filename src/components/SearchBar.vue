<script lang="ts" setup>
import { useFuzzySearch } from '@/composable/fuzzySearch';
import { tools } from '@/tools';
import { SearchRound } from '@vicons/material';
import { useMagicKeys, whenever } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const queryString = ref('');

const { searchResult } = useFuzzySearch({
  search: queryString,
  data: tools,
  options: { keys: [{ name: 'name', weight: 2 }, 'description', 'keywords'] },
});

const options = computed(() => searchResult.value.map(({ name, path }) => ({ label: name, value: path })));

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
</script>

<template>
  <div class="search-bar">
    <n-auto-complete
      v-model:value="queryString"
      :options="options"
      :input-props="{ autocomplete: 'disabled' }"
      :on-select="(value) => onSelect(String(value))"
    >
      <template #default="{ handleInput, handleBlur, handleFocus, value: slotValue }">
        <n-input
          ref="focusTarget"
          round
          clearable
          placeholder="Search a tool... [Ctrl + K]"
          :value="slotValue"
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

<style lang="less" scoped>
// ::v-deep(.n-input__border) {
//     border: none;
// }
</style>
