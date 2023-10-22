<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import FavoriteButton from './FavoriteButton.vue';
import { useAppTheme } from '@/ui/theme/themes';
import type { Tool } from '@/tools/tools.types';

const props = defineProps<{ tool: Tool & { category: string } }>();
const { tool } = toRefs(props);
const theme = useThemeVars();

const appTheme = useAppTheme();
</script>

<template>
  <router-link :to="tool.path">
    <c-card class="tool-card">
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
            {{ $t('toolCard.new') }}
          </n-tag>

          <FavoriteButton :tool="tool" />
        </div>
      </div>
      <n-h3 class="title">
        <n-ellipsis>{{ tool.name }}</n-ellipsis>
      </n-h3>

      <div class="description">
        <n-ellipsis :line-clamp="2" :tooltip="false" style="min-height: 44.78px">
          {{ tool.description }}
          <br>&nbsp;
        </n-ellipsis>
      </div>
    </c-card>
  </router-link>
</template>

<style lang="less" scoped>
a {
  text-decoration: none;
}

.tool-card {
  transition: border-color ease 0.5s;
  border-width: 2px !important;
  color: transparent;

  &:hover {
    border-color: v-bind('appTheme.primary.colorHover');
  }

  .icon {
    opacity: 0.6;
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
}
</style>
