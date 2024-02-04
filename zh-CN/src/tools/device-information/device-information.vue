<script setup lang="ts">
import { useWindowSize } from '@vueuse/core';

const { width, height } = useWindowSize();

const sections = [
  {
    name: '屏幕',
    information: [
      {
        label: '屏幕尺寸',
        value: computed(() => `${window.screen.availWidth} x ${window.screen.availHeight}`),
      },
      {
        label: '方向',
        value: computed(() => window.screen.orientation.type),
      },
      {
        label: '方位角',
        value: computed(() => `${window.screen.orientation.angle}°`),
      },
      {
        label: '颜色深度',
        value: computed(() => `${window.screen.colorDepth} bits`),
      },
      {
        label: '像素比例',
        value: computed(() => `${window.devicePixelRatio} dppx`),
      },
      {
        label: '窗口大小',
        value: computed(() => `${width.value} x ${height.value}`),
      },
    ],
  },
  {
    name: '设备',
    information: [
      {
        label: '浏览器供应商',
        value: computed(() => navigator.vendor),
      },
      {
        label: '语音',
        value: computed(() => navigator.languages.join(', ')),
      },
      {
        label: '平台',
        value: computed(() => navigator.platform),
      },
      {
        label: '用户代理',
        value: computed(() => navigator.userAgent),
      },
    ],
  },
];
</script>

<template>
  <c-card v-for="{ name, information } in sections" :key="name" :title="name">
    <n-grid cols="1 400:2" x-gap="12" y-gap="12">
      <n-gi v-for="{ label, value: { value } } in information" :key="label" class="information">
        <div class="label">
          {{ label }}
        </div>

        <div class="value">
          <n-ellipsis v-if="value">
            {{ value }}
          </n-ellipsis>
          <div v-else class="undefined-value">
            未知
          </div>
        </div>
      </n-gi>
    </n-grid>
  </c-card>
</template>

<style lang="less" scoped>
.information {
  padding: 14px 16px;
  border-radius: 4px;
  background-color: #aaaaaa11;

  .label {
    font-size: 14px;
    opacity: 0.8;
    line-height: 1;
    margin-bottom: 5px;
  }
  .value {
    font-size: 20px;
    font-weight: 400;
  }

  .undefined-value {
    opacity: 0.8;
  }
}
</style>
