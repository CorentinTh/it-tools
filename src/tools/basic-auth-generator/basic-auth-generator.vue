<template>
  <div>
    <n-form-item label="Username">
      <n-input v-model:value="username" placeholder="Your username..." clearable />
    </n-form-item>
    <n-form-item label="Password">
      <n-input
        v-model:value="password"
        placeholder="Your password..."
        type="password"
        show-password-on="click"
        clearable
      />
    </n-form-item>

    <c-card>
      <n-statistic label="Authorization header:" class="header">
        <n-scrollbar x-scrollable style="max-width: 550px; margin-bottom: -10px; padding-bottom: 10px" trigger="none">
          {{ header }}
        </n-scrollbar>
      </n-statistic>
    </c-card>
    <n-space justify="center" mt-5>
      <c-button @click="copy">Copy header</c-button>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { textToBase64 } from '@/utils/base64';
import { computed, ref } from 'vue';

const username = ref('');
const password = ref('');
const header = computed(() => `Authorization: Basic ${textToBase64(`${username.value}:${password.value}`)}`);

const { copy } = useCopy({ source: header, text: 'Header copied to the clipboard' });
</script>

<style lang="less" scoped>
::v-deep(.n-statistic-value__content) {
  font-family: monospace;
  font-size: 17px !important;
  white-space: nowrap;
}
</style>
