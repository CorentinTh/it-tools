<script setup lang="ts">
import { useStyleStore } from '@/stores/style.store';

const styleStore = useStyleStore();
const { isMenuCollapsed, isSmallScreen } = toRefs(styleStore);
const siderPosition = computed(() => (isSmallScreen.value ? 'absolute' : 'static'));
</script>

<template>
  <n-layout has-sider>
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="0"
      :width="210"
      :collapsed="isMenuCollapsed"
      :show-trigger="false"
      :native-scrollbar="false"
      :position="siderPosition"
    >
      <slot name="sider" />
    </n-layout-sider>
    <n-layout class="content">
      <slot name="content" />
      <div v-show="isSmallScreen && !isMenuCollapsed" class="overlay" @click="isMenuCollapsed = true" />
    </n-layout>
  </n-layout>
</template>

<style lang="less" scoped>
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00000080;
  cursor: pointer;
}

.content {
  background-color: #0b1014;
  ::v-deep(.n-layout-scroll-container) {
    padding: 18px 26px 26px;
    background-color: #0b1014;
    background-image:
      linear-gradient(rgba(70, 240, 180, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(70, 240, 180, 0.03) 1px, transparent 1px);
    background-size: 28px 28px;
  }
}

::v-deep(.n-layout-sider) {
  background: #0e161b !important;
  border-right-color: #203036 !important;
}

.n-layout {
  height: 100vh;
}
</style>
