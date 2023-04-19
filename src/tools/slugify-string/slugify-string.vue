<template>
  <div>
    <n-form-item label="Your string to slugify">
      <n-input v-model:value="input" type="textarea" placeholder="Put your string here (ex: My file path)"></n-input>
    </n-form-item>

    <n-form-item label="Your slug">
      <n-input
        :value="slug"
        type="textarea"
        readonly
        placeholder="You slug will be generated here (ex: my-file-path)"
      ></n-input>
    </n-form-item>

    <n-space justify="center">
      <c-button :disabled="slug.length === 0" @click="copy">Copy slug</c-button>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import slugify from '@sindresorhus/slugify';
import { withDefaultOnError } from '@/utils/defaults';
import { useCopy } from '@/composable/copy';

const input = ref('');
const slug = computed(() => withDefaultOnError(() => slugify(input.value), ''));
const { copy } = useCopy({ source: slug, text: 'Slug copied to clipboard' });
</script>

<style lang="less" scoped></style>
