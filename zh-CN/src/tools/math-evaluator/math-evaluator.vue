<script setup lang="ts">
import { evaluate } from 'mathjs';

import { withDefaultOnError } from '@/utils/defaults';

const expression = ref('');

const result = computed(() => withDefaultOnError(() => evaluate(expression.value) ?? '', ''));
</script>

<template>
  <div>
    <c-input-text
      v-model:value="expression"
      rows="1"
      multiline
      placeholder="您的数学表达式，例如：2*sqrt(6)"
      raw-text
      monospace
      autofocus
      autosize
    />

    <c-card v-if="result !== ''" title="结果" mt-5>
      {{ result }}
    </c-card>
  </div>
</template>
