<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import Memo from './common-regex.md';

const themeVars = useThemeVars();
</script>

<template>
  <div>
    <Memo style="overflow-x: auto;" />
  </div>
</template>

<style lang="less" scoped>
::v-deep(pre) {
  margin: 0;
  padding: 15px 22px;
  background-color: v-bind('themeVars.cardColor');
  border-radius: 4px;
  white-space: pre-wrap;
}
::v-deep(a) {
  color: v-bind('themeVars.textColor3');
}
</style>
