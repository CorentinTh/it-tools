<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import Memo from './git-memo.content.md';

const themeVars = useThemeVars();
</script>

<template>
  <div>
    <Memo />
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
