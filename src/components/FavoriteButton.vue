<script setup lang="ts">
import { FavoriteFilled } from '@vicons/material';

import { useToolStore } from '@/tools/tools.store';
import type { Tool } from '@/tools/tools.types';

const props = defineProps<{ tool: Tool }>();

const toolStore = useToolStore();

const { tool } = toRefs(props);

const isFavorite = computed(() => toolStore.isToolFavorite({ tool }));
const buttonType = computed(() => (isFavorite.value ? 'primary' : 'default'));

function toggleFavorite(event: MouseEvent) {
  event.preventDefault();

  if (toolStore.isToolFavorite({ tool })) {
    toolStore.removeToolFromFavorites({ tool });
    return;
  }

  toolStore.addToolToFavorites({ tool });
}
</script>

<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <c-button
        variant="text"
        circle
        :type="buttonType"
        :style="{ opacity: isFavorite ? 1 : 0.2 }"
        @click="toggleFavorite"
      >
        <n-icon :component="FavoriteFilled" />
      </c-button>
    </template>
    {{ isFavorite ? 'Remove from favorites' : 'Add to favorites' }}
  </n-tooltip>
</template>
