<script setup lang="ts">
import { decodeSharePointsURL } from './sharepoint-decoder.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const inputSharePointUrl = ref('');
const outputDecodedUrl = computed(() => {
  try {
    return decodeSharePointsURL(inputSharePointUrl.value);
  }
  catch (e: any) {
    return e.toString();
  }
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="inputSharePointUrl"
      raw-text
      placeholder="Your input SharePoint Url..."
      autofocus
      label="Your input SharePoint Url:"
    />

    <n-divider />

    <n-form-item label="Output decoded URL:">
      <TextareaCopyable :value="outputDecodedUrl" :word-wrap="true" />
    </n-form-item>
  </div>
</template>
