<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useStyleStore } from '@/stores/style.store';

const emit = defineEmits<{
  (event: 'requestFocusRestore'): void
}>();
const styleStore = useStyleStore();
const { isMenuCollapsed, isSmallScreen } = toRefs(styleStore);
const route = useRoute();
const siderContent = ref<HTMLElement>();
const siderPosition = computed(() => (isSmallScreen.value ? 'absolute' : 'static'));
const isMenuHidden = computed(() => isMenuCollapsed.value);

function closeMobileMenu(): void {
  if (!isSmallScreen.value || isMenuCollapsed.value) {
    return;
  }

  const activeElement = document.activeElement;
  const shouldRestoreFocus = activeElement !== null && siderContent.value?.contains(activeElement);
  isMenuCollapsed.value = true;

  if (shouldRestoreFocus) {
    nextTick(() => emit('requestFocusRestore'));
  }
}

watch(
  [() => route.path, isSmallScreen],
  () => {
    if (isSmallScreen.value) {
      closeMobileMenu();
    }
  },
  { immediate: true },
);

useEventListener(window, 'keydown', (event) => {
  if (event.key === 'Escape' && isSmallScreen.value && !isMenuCollapsed.value) {
    event.preventDefault();
    closeMobileMenu();
  }
});
</script>

<template>
  <n-layout has-sider>
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="0"
      :width="240"
      :collapsed="isMenuCollapsed"
      :show-trigger="false"
      :native-scrollbar="false"
      :position="siderPosition"
    >
      <div
        id="tool-navigation"
        ref="siderContent"
        data-test-id="tool-navigation"
        :inert="isMenuHidden ? '' : undefined"
        :aria-hidden="isMenuHidden ? 'true' : undefined"
      >
        <slot name="sider" />
      </div>
    </n-layout-sider>
    <n-layout class="content">
      <slot name="content" />
      <div v-show="isSmallScreen && !isMenuCollapsed" class="overlay" @click="closeMobileMenu" />
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
  // background-color: #f1f5f9;
  ::v-deep(.n-layout-scroll-container) {
    padding: 26px;
  }
}

.n-layout {
  height: 100vh;
}
</style>
