<script setup lang="ts">
import { evaluate } from 'mathjs';

import { withDefaultOnError } from '@/utils/defaults';

const { t } = useI18n();
const expression = ref('');

const result = computed(() => withDefaultOnError(() => evaluate(expression.value) ?? '', ''));
</script>

<template>
  <div>
    <c-input-text
      v-model:value="expression"
      rows="1"
      multiline
      :placeholder="t('tools.math-evaluator.inputPlaceholder')"
      raw-text
      monospace
      autofocus
      autosize
    />

    <c-card v-if="result !== ''" :title="t('tools.math-evaluator.result')" mt-5>
      {{ result }}
    </c-card>
  </div>
</template>
