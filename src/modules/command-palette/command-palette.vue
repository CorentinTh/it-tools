<script setup lang="ts">
import { storeToRefs } from 'pinia';
import _ from 'lodash';
import { useCommandPaletteStore } from './command-palette.store';
import type { PaletteOption } from './command-palette.types';

const isModalOpen = ref(false);
const inputRef = ref();
const router = useRouter();
const isMac = computed(() => window.navigator.userAgent.toLowerCase().includes('mac'));

const commandPaletteStore = useCommandPaletteStore();
const { searchPrompt, filteredSearchResult } = storeToRefs(commandPaletteStore);

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

whenever(isModalOpen, () => inputRef.value?.focus());

whenever(keys.ctrl_k, open);
whenever(keys.meta_k, open);
whenever(keys.escape, close);

function open() {
  return isModalOpen.value = true;
}

function close() {
  isModalOpen.value = false;
  searchPrompt.value = '';
}

const selectedOptionIndex = ref(0);

function handleKeydown(event: KeyboardEvent) {
  const { key } = event;
  const isEnterPressed = key === 'Enter';
  const isArrowUpOrDown = ['ArrowUp', 'ArrowDown'].includes(key);
  const isArrowDown = key === 'ArrowDown';

  if (isArrowUpOrDown) {
    const increment = isArrowDown ? 1 : -1;
    const maxIndex = Math.max(_.chain(filteredSearchResult.value).values().flatten().size().value() - 1, 0);

    selectedOptionIndex.value = Math.min(Math.max(selectedOptionIndex.value + increment, 0), maxIndex);

    return;
  }

  if (isEnterPressed) {
    const option = _.chain(filteredSearchResult.value)
      .values()
      .flatten()
      .nth(selectedOptionIndex.value)
      .value();

    activateOption(option);
  }
}

function getOptionIndex(option: PaletteOption) {
  return _.chain(filteredSearchResult.value)
    .values()
    .flatten()
    .findIndex(o => o === option)
    .value();
}

function activateOption(option: PaletteOption) {
  const { closeOnSelect } = option;

  if (option.action) {
    option.action();

    if (closeOnSelect) {
      close();
    }

    return;
  }

  const closeAfterNavigation = closeOnSelect || _.isUndefined(closeOnSelect);

  if (option.to) {
    router.push(option.to);

    if (closeAfterNavigation) {
      close();
    }
    return;
  }

  if (option.href) {
    window.open(option.href, '_blank');

    if (closeAfterNavigation) {
      close();
    }
  }
}
</script>

<template>
  <div flex-1>
    <c-button w-full important:justify-start @click="isModalOpen = true">
      <span flex items-center gap-3 op-40>

        <icon-mdi-search />
        {{ $t('search.label') }}

        <span hidden flex-1 border border-current border-op-40 rounded border-solid px-5px py-3px sm:inline>
          {{ isMac ? 'Cmd' : 'Ctrl' }}&nbsp;+&nbsp;K
        </span>
      </span>
    </c-button>

    <c-modal v-model:open="isModalOpen" class="palette-modal" shadow-xl important:max-w-650px important:pa-12px @keydown="handleKeydown">
      <c-input-text ref="inputRef" v-model:value="searchPrompt" raw-text placeholder="Type to search a tool or a command..." autofocus clearable />

      <div v-for="(options, category) in filteredSearchResult" :key="category">
        <div ml-3 mt-3 text-sm font-bold text-primary op-60>
          {{ category }}
        </div>
        <command-palette-option v-for="option in options" :key="option.name" :option="option" :selected="selectedOptionIndex === getOptionIndex(option)" @activated="activateOption" />
      </div>
    </c-modal>
  </div>
</template>

<style scoped lang="less">
.c-input-text {
  font-size: 18px;

  ::v-deep(.input-wrapper) {
      padding: 4px;
      padding-left: 18px;
  }
}

.c-modal--overlay {
  align-items: flex-start !important;
  padding-top: 80px;
}
</style>
