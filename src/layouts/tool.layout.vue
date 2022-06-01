<script lang="ts" setup>
import { useRoute } from 'vue-router';
import BaseLayout from './base.layout.vue';
import { useHead } from '@vueuse/head';
import type { HeadObject } from '@vueuse/head';
import { computed } from 'vue';
import { useThemeVars } from 'naive-ui';

const route = useRoute();
const theme = useThemeVars();

const head = computed<HeadObject>(() => ({
  title: `${route.meta.name} - IT Tools`,
  meta: [
    {
      name: 'description',
      content: route.meta.description,
    },
    {
      name: 'keywords',
      content: route.meta.keywords,
    },
  ],
}));
useHead(head);
</script>

<template>
  <base-layout>
    <div class="tool-layout">
      <div class="tool-header">
        <n-h1>
          {{ route.meta.name }}

          <n-tag
            v-if="route.meta.isNew"
            round
            type="success"
            :bordered="false"
            :color="{ color: theme.primaryColor, textColor: theme.tagColor }"
          >
            New tool
          </n-tag>
          <!-- <span class="new-tool-badge">New !</span> -->
        </n-h1>

        <div class="separator" />
        <div class="description">
          {{ route.meta.description }}
        </div>
      </div>
    </div>

    <div class="tool-content">
      <slot />
    </div>
  </base-layout>
</template>

<style lang="less" scoped>
.tool-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;

  ::v-deep(& > *) {
    flex: 0 1 600px;
  }
}

.tool-layout {
  max-width: 600px;
  margin: 0 auto;
  box-sizing: border-box;

  .tool-header {
    padding: 40px 0;
    width: 100%;

    .n-h1 {
      opacity: 0.9;
      font-size: 40px;
      font-weight: 400;
      margin: 0;
      line-height: 1;
    }

    .separator {
      width: 200px;
      height: 2px;
      background: rgb(161, 161, 161);

      margin: 10px 0;
    }

    .description {
      margin: 0;

      opacity: 0.7;
    }
  }
}
</style>
