<script setup lang="ts">
import type { EmojiInfo } from './emoji.types';

const props = withDefaults(defineProps<{ emojiInfos?: EmojiInfo[] }>(), { emojiInfos: () => [] });
const { emojiInfos } = toRefs(props);
</script>

<template>
  <div grid grid-cols-1 gap-2 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xl:grid-cols-6>
    <emoji-card v-for="emojiInfo in emojiInfos" :key="emojiInfo.name" :emoji-info="emojiInfo" flex items-center gap-3 />
  </div>
</template>
