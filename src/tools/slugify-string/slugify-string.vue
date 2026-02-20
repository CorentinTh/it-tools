<script setup lang="ts">
import slugify from '@sindresorhus/slugify';
import { withDefaultOnError } from '@/utils/defaults';
import { useCopy } from '@/composable/copy';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const input = ref('');
const separator = useQueryParamOrStorage({ name: 'sep', storageName: 'slugify:sep', defaultValue: '-' });
const slug = computed(() => withDefaultOnError(() => slugify(input.value, {
  separator: separator.value,
}), ''));
const { copy } = useCopy({ source: slug, text: 'Slug copied to clipboard' });
</script>

<template>
  <div>
    <c-input-text
      v-model:value="input" multiline
      placeholder="Put your string here (ex: My file path)"
      label="Your string to slugify" autofocus raw-text mb-2
    />

    <c-input-text
      v-model:value="separator"
      placeholder="Put separator char here"
      label="Separator character" raw-text mb-5
    />

    <c-input-text
      :value="slug" multiline readonly
      placeholder="You slug will be generated here (ex: my-file-path)"
      label="Your slug" mb-5
    />

    <div flex justify-center>
      <c-button :disabled="slug.length === 0" @click="copy()">
        Copy slug
      </c-button>
    </div>
  </div>
</template>
