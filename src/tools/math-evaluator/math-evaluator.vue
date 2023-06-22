<script setup lang="ts">
import { evaluate } from 'mathjs';

import { withDefaultOnError } from '@/utils/defaults';

const expression = ref('');

const result = computed(() => withDefaultOnError(() => evaluate(expression.value) ?? '', ''));
</script>

<template>
  <div>
    <n-input
      v-model:value="expression"
      rows="1"
      type="textarea"
      placeholder="Your math expression (ex: 2*sqrt(6) )..."
      size="large"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
    />

    <c-card v-if="result !== ''" title="Result " mt-5>
      {{ result }}
    </c-card>
  </div>
</template>
