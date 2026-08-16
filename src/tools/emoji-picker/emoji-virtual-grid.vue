<script setup lang="ts">
import type { EmojiInfo } from './emoji.types';
import {
  EMOJI_VIRTUAL_ROW_HEIGHT,
  createEmojiVirtualRows,
  getEmojiVirtualColumnCount,
  getEmojiVirtualHeight,
  getEmojiVirtualRowForIndex,
  getVisibleEmojiVirtualRows,
} from './emoji-picker.virtual';

const props = withDefaults(defineProps<{
  emojiInfos?: EmojiInfo[]
  resetKey?: string
  showGroupHeaders?: boolean
}>(), {
  emojiInfos: () => [],
  resetKey: '',
  showGroupHeaders: true,
});

const viewport = ref<HTMLElement>();
const scrollTop = ref(0);
const viewportHeight = ref(640);
const columns = ref(1);
let resizeObserver: ResizeObserver | undefined;

const rows = computed(() => createEmojiVirtualRows(props.emojiInfos, columns.value, props.showGroupHeaders));
const totalHeight = computed(() => getEmojiVirtualHeight(rows.value));
const visibleRows = computed(() => getVisibleEmojiVirtualRows(
  rows.value,
  scrollTop.value,
  viewportHeight.value,
));

function measureViewport() {
  const element = viewport.value;
  if (!element) {
    return;
  }
  viewportHeight.value = element.clientHeight || 640;
  columns.value = getEmojiVirtualColumnCount(element.clientWidth || globalThis.innerWidth || 1);
}

function handleScroll() {
  scrollTop.value = viewport.value?.scrollTop ?? 0;
}

async function focusEmoji(index: number) {
  const element = viewport.value;
  const row = getEmojiVirtualRowForIndex(rows.value, index);
  if (!element || !row) {
    return;
  }

  const rowBottom = row.offset + row.height;
  const viewportBottom = element.scrollTop + viewportHeight.value;
  if (row.offset < element.scrollTop || rowBottom > viewportBottom) {
    element.scrollTop = Math.max(0, row.offset - EMOJI_VIRTUAL_ROW_HEIGHT);
    scrollTop.value = element.scrollTop;
  }
  await nextTick();
  element.querySelector<HTMLElement>(`[data-emoji-index="${index}"]`)?.focus();
}

function handleKeydown(event: KeyboardEvent) {
  const target = event.target instanceof Element
    ? event.target.closest<HTMLElement>('[data-emoji-index]')
    : undefined;
  const currentIndex = Number(target?.dataset.emojiIndex);
  if (!Number.isSafeInteger(currentIndex)) {
    return;
  }

  let nextIndex = currentIndex;
  if (event.key === 'ArrowRight') {
    nextIndex += 1;
  }
  else if (event.key === 'ArrowLeft') {
    nextIndex -= 1;
  }
  else if (event.key === 'ArrowDown') {
    nextIndex += columns.value;
  }
  else if (event.key === 'ArrowUp') {
    nextIndex -= columns.value;
  }
  else if (event.key === 'Home') {
    nextIndex = 0;
  }
  else if (event.key === 'End') {
    nextIndex = props.emojiInfos.length - 1;
  }
  else {
    return;
  }

  event.preventDefault();
  focusEmoji(Math.max(0, Math.min(props.emojiInfos.length - 1, nextIndex)));
}

watch(() => props.resetKey, () => {
  if (viewport.value) {
    viewport.value.scrollTop = 0;
  }
  scrollTop.value = 0;
});

onMounted(() => {
  measureViewport();
  if (typeof ResizeObserver !== 'undefined' && viewport.value) {
    resizeObserver = new ResizeObserver(measureViewport);
    resizeObserver.observe(viewport.value);
  }
});

onScopeDispose(() => resizeObserver?.disconnect());
</script>

<template>
  <div
    ref="viewport"
    class="emoji-virtual-viewport"
    data-test-id="emoji-virtual-viewport"
    role="region"
    aria-label="Virtualized emoji results"
    @scroll.passive="handleScroll"
    @keydown="handleKeydown"
  >
    <div
      role="list"
      aria-label="Emojis"
      class="emoji-virtual-content"
      :style="{ height: `${totalHeight}px` }"
    >
      <div
        v-for="row in visibleRows"
        :key="`${row.type}-${row.offset}`"
        role="presentation"
        class="emoji-virtual-row"
        :style="{ height: `${row.height}px`, transform: `translateY(${row.offset}px)` }"
      >
        <div v-if="row.type === 'header'" role="heading" aria-level="2" text-20px font-bold>
          {{ row.group }}
        </div>
        <div
          v-else
          role="presentation"
          class="emoji-virtual-grid-row"
          :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }"
        >
          <emoji-card
            v-for="cell in row.cells"
            :key="cell.emojiInfo.emoji"
            :emoji-info="cell.emojiInfo"
            :position="cell.index + 1"
            :total="emojiInfos.length"
            :virtual-index="cell.index"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.emoji-virtual-viewport {
  height: min(70vh, 720px);
  min-height: 320px;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
}

.emoji-virtual-content {
  position: relative;
  width: 100%;
}

.emoji-virtual-row {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.emoji-virtual-grid-row {
  display: grid;
  gap: 8px;
}
</style>
