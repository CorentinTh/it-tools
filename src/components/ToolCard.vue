<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import FavoriteButton from './FavoriteButton.vue';
import type { Tool } from '@/tools/tools.types';

const props = defineProps<{ tool: Tool & { category: string } }>();
const { tool } = toRefs(props);
const theme = useThemeVars();
</script>

<template>
  <router-link :to="tool.path">
    <c-card class="tool-card" shadow>
      <div flex items-center justify-between>
        <n-icon class="icon" size="40" :component="tool.icon" />
        <div flex items-center gap-8px>
          <n-tag
            v-if="tool.isNew"
            size="small"
            class="badge-new"
            round
            type="success"
            :bordered="false"
            :color="{ color: theme.primaryColor, textColor: theme.tagColor }"
          >
            New
          </n-tag>

          <FavoriteButton :tool="tool" />
        </div>
      </div>
      <n-h3 class="title" truncate>
        {{ tool.name }}
      </n-h3>

      <div class="description">
        <div line-clamp-2 style="min-height: 44.78px">
          {{ tool.description }}
        </div>
      </div>
    </c-card>
  </router-link>
</template>

<style lang="less" scoped>
a {
  text-decoration: none;
}

.tool-card {
  border-width: 2px !important;
  color: transparent;
  position: relative;
  border-radius: 15px;
  border: none;

  .icon {
    opacity: 0.4;
    color: v-bind('theme.textColorBase');
  }

  .title {
    margin: 5px 0;
  }

  .description {
    opacity: 0.6;
    color: v-bind('theme.textColorBase');
    margin: 5px 0;
  }

  &::after {
    --mask-radius: 20em;

    border-radius: 15px;
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    user-select: none;
    display: block;
    height: calc(100% - 4px) ;
    width:  calc(100% - 4px) ;
    background: #18a05818;
    top: 0;
    left: 0;
    opacity: 1;
    border: 2px solid transparent;
    transition: all 0.2s ease-in-out;

    -webkit-mask: radial-gradient(
      var(--mask-radius) var(--mask-radius) at 45px 45px,
      #000 1%,
      transparent 50%
    );

    mask: radial-gradient(
      var(--mask-radius) var(--mask-radius) at 45px 45px,
      #000 1%,
      transparent 50%
    );

    will-change: mask;
  }

  &:hover {
    &::after {
      --mask-radius: 50em;
      border: 2px solid #18a058;
    }
  }
}
</style>
