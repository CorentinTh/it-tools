<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import Memo from './regex-memo.content.md';
import MemoZH from './regex-memo.content.zh.md';
import MemoFR from './regex-memo.content.fr.md';

const themeVars = useThemeVars();
const { locale } = useI18n();
</script>

<template>
  <div>
    <MemoZH v-if="locale === 'zh'" />
    <MemoFR v-else-if="locale === 'fr'" />
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
::v-deep(table) {
  border-collapse: collapse;
}
::v-deep(table), ::v-deep(td), ::v-deep(th) {
  border: 1px solid v-bind('themeVars.textColor1');
  padding: 5px;
}
::v-deep(a) {
  color: v-bind('themeVars.textColor1');
}
</style>
