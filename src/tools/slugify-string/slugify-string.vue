<script setup lang="ts">
import slugify from '@sindresorhus/slugify';
import { withDefaultOnError } from '@/utils/defaults';
import { useCopy } from '@/composable/copy';

const { t } = useI18n();
const input = ref('');
const slug = computed(() => withDefaultOnError(() => slugify(input.value), ''));
const { copy } = useCopy({ source: slug, text: t('tools.slugify-string.copied') });
</script>

<template>
  <div>
    <c-input-text v-model:value="input" multiline :placeholder="t('tools.slugify-string.inputPlaceholder')" :label="t('tools.slugify-string.inputLabel')" autofocus raw-text mb-5 />

    <c-input-text :value="slug" multiline readonly :placeholder="t('tools.slugify-string.outputPlaceholder')" :label="t('tools.slugify-string.outputLabel')" mb-5 />

    <div flex justify-center>
      <c-button :disabled="slug.length === 0" @click="copy()">
        {{ t('tools.slugify-string.copyBtn') }}
      </c-button>
    </div>
  </div>
</template>
