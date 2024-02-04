<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { textToBase64 } from '@/utils/base64';

const username = ref('');
const password = ref('');
const header = computed(() => `Authorization: Basic ${textToBase64(`${username.value}:${password.value}`)}`);

const { copy } = useCopy({ source: header, text: '已复制到剪贴板' });
</script>

<template>
  <div>
    <c-input-text v-model:value="username" label="用户名" placeholder="请输入用户名" raw-text clearable mb-5 />
    <c-input-text
      v-model:value="password"
      label="密码"
      placeholder="请输入密码"
      clearable
      raw-text
      mb-2
      type="password"
    />

    <c-card>
      <n-statistic label="授权标头：" class="header">
        <n-scrollbar x-scrollable style="max-width: 550px; margin-bottom: -10px; padding-bottom: 10px" trigger="none">
          {{ header }}
        </n-scrollbar>
      </n-statistic>
    </c-card>
    <div mt-5 flex justify-center>
      <c-button @click="copy()">
        复制
      </c-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
::v-deep(.n-statistic-value__content) {
  font-family: monospace;
  font-size: 17px !important;
  white-space: nowrap;
}
</style>
