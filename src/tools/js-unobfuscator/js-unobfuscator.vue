<script setup lang="ts">
import { webcrack } from 'webcrack';

const input = ref('');
const result = computedAsync(async () => {
  try {
    return await webcrack(input.value);
  }
  catch (e: any) {
    return {
      code: `/*\n${e.toString()}\n*/`,
      bundle: '',
    };
  }
});
</script>

<template>
  <CInputText
    v-model:value="input"
    placeholder="Your obfuscate Javascript code"
    label="Obfuscate Javascript code:"
    rows="20"
    autosize
    raw-text
    multiline
    monospace
  />

  <n-form-item label="Deobfuscated code:">
    <textarea-copyable :value="result?.code" language="javascript" />
  </n-form-item>
  <n-form-item label="Bundle:">
    <textarea-copyable :value="result?.bundle" language="javascript" />
  </n-form-item>
</template>
