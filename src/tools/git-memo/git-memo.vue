<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import Memo from './git-memo.content.md';
import MemoZH from './git-memo.content.zh.md';

const themeVars = useThemeVars();
const { locale } = useI18n();
</script>

<template>
  <div>
    <MemoZH v-if="locale === 'zh'" />
    <Memo v-else />
  </div>
</template>

<style lang="less" scoped>
::v-deep(pre) {
  margin: 0;
  padding: 15px 22px;
  background-color: v-bind('themeVars.cardColor');
  border-radius: 4px;
  overflow: auto;
}
</style>
