<script setup lang="ts">
import type { Themes } from 'md-editor-v3';
import { MdEditor } from 'md-editor-v3';

import 'md-editor-v3/lib/style.css';
import { useStyleStore } from '@/stores/style.store';

const theme = ref<Themes>('light');
const styleStore = useStyleStore();
watch(
  () => styleStore.isDarkTheme,
  isDarkTheme => theme.value = isDarkTheme ? 'dark' : 'light',
  { immediate: true },
);

const markdown = ref('Sample _formatted_ *text*');
</script>

<template>
  <div>
    <MdEditor
      v-model="markdown"
      :theme="theme"
      language="en-US"
    />
  </div>
</template>
