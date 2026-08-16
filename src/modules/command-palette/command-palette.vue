<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCommandPaletteStore } from './command-palette.store';
import {
  activateSelectedPaletteOption,
  clampPaletteOptionIndex,
} from './command-palette.navigation';
import type { PaletteOption } from './command-palette.types';

const isModalOpen = ref(false);
const inputRef = ref();
const router = useRouter();
const isMac = computed(() => window.navigator.userAgent.toLowerCase().includes('mac'));

const commandPaletteStore = useCommandPaletteStore();
const { searchPrompt, filteredSearchResult, hiddenResultCount, showAllResults } = storeToRefs(commandPaletteStore);
const flattenedOptions = computed(() => Object.values(filteredSearchResult.value).flat());
const selectedOptionIndex = ref(0);

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
  showAllResults.value = false;
  selectedOptionIndex.value = 0;
}

watch(searchPrompt, () => {
  selectedOptionIndex.value = 0;
  showAllResults.value = false;
});

watch(showAllResults, () => {
  selectedOptionIndex.value = 0;
});

watch(flattenedOptions, (options) => {
  selectedOptionIndex.value = clampPaletteOptionIndex(selectedOptionIndex.value, options.length);
}, { flush: 'sync' });

function handleKeydown(event: KeyboardEvent) {
  const { key } = event;
  const isEnterPressed = key === 'Enter';
  const isArrowUpOrDown = ['ArrowUp', 'ArrowDown'].includes(key);
  const isArrowDown = key === 'ArrowDown';

  if (isArrowUpOrDown) {
    const increment = isArrowDown ? 1 : -1;
    selectedOptionIndex.value = clampPaletteOptionIndex(
      selectedOptionIndex.value + increment,
      flattenedOptions.value.length,
    );

    return;
  }

  if (isEnterPressed) {
    activateSelectedPaletteOption(flattenedOptions.value, selectedOptionIndex.value, activateOption);
  }
}

function getOptionIndex(option: PaletteOption) {
  return flattenedOptions.value.indexOf(option);
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

  const closeAfterNavigation = closeOnSelect ?? true;

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
        <div ml-3 mt-3 text-sm text-primary font-bold op-60>
          {{ category }}
        </div>
        <command-palette-option v-for="option in options" :key="option.name" :option="option" :selected="selectedOptionIndex === getOptionIndex(option)" @activated="activateOption" />
      </div>
      <c-button
        v-if="hiddenResultCount > 0 && !showAllResults"
        data-test-id="command-palette-show-all"
        mt-3 w-full
        @click="showAllResults = true"
      >
        Show all {{ hiddenResultCount }} more results
      </c-button>
      <p v-else-if="searchPrompt && flattenedOptions.length === 0" role="status" mt-4 text-center op-70>
        No matching tools or commands.
      </p>
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
