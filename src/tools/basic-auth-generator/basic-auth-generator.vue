<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { textToBase64 } from '@/utils/base64';

const username = ref('');
const password = ref('');
const header = computed(() => `Authorization: Basic ${textToBase64(`${username.value}:${password.value}`)}`);

const { copy } = useCopy({ source: header, text: 'Header copied to the clipboard' });
</script>

<template>
  <div class="c-generator-layout">
    <c-card class="c-generator-options" title="Credentials">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-input-text v-model:value="username" label="Username" placeholder="Your username..." clearable raw-text />
        <c-input-text
          v-model:value="password"
          label="Password"
          placeholder="Your password..."
          clearable
          raw-text
          type="password"
        />
      </div>
    </c-card>

    <c-card class="c-generator-output" title="Result">
      <InputCopyable :value="header" label="Authorization header" readonly monospace />
    </c-card>

    <div class="c-generator-actions">
      <c-button @click="copy()">
        Copy header
      </c-button>
    </div>
  </div>
</template>
