<script setup lang="ts">
import FavoriteButton from './FavoriteButton.vue';
import type { Tool } from '@/tools/tools.types';

const props = defineProps<{ tool: Tool & { category: string } }>();
const { tool } = toRefs(props);
</script>

<template>
  <router-link :to="tool.path" class="decoration-none">
    <c-card class="terminal-tool-card h-full">
      <div flex items-center justify-between>
        <div class="tool-module">
          {{ tool.category }} / {{ tool.path.replace('/', '') }}
        </div>

        <div flex items-center gap-8px>
          <div
            v-if="tool.isNew"
            class="new-badge"
          >
            {{ $t('toolCard.new') }}
          </div>

          <FavoriteButton :tool="tool" />
        </div>
      </div>

      <div class="tool-title">
        {{ tool.name }} <span class="run-arrow">→</span>
      </div>

      <div class="tool-description line-clamp-2">
        {{ tool.description }}
      </div>
    </c-card>
  </router-link>
</template>

<style scoped lang="less">
.terminal-tool-card {
  min-height: 142px;
  border: 1px solid #24363b !important;
  border-radius: 10px !important;
  background: rgba(15, 24, 29, 0.92) !important;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: #46f0b4 !important;
    box-shadow: 0 10px 32px rgba(70, 240, 180, 0.08);
  }
}

.tool-module {
  max-width: 80%;
  overflow: hidden;
  color: #3e595f;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 9px;
  text-transform: uppercase;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.new-badge {
  border: 1px solid #46f0b4;
  border-radius: 4px;
  padding: 2px 6px;
  color: #46f0b4;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 9px;
}

.tool-title {
  margin: 24px 0 7px;
  color: #eafff8;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 14px;
  font-weight: 500;
}

.run-arrow {
  float: right;
  color: #46f0b4;
}

.tool-description {
  color: #647d84;
  font-size: 11px;
  line-height: 1.5;
}
</style>
