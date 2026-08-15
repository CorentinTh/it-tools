<script setup lang="ts">
import { evaluate } from 'mathjs';

import { withDefaultOnError } from '@/utils/defaults';

const expression = ref('');

const result = computed(() => withDefaultOnError(() => evaluate(expression.value) ?? '', ''));
</script>

<template>
  <div class="c-form-layout">
    <c-card title="Expression">
      <c-input-text
        v-model:value="expression"
        label="Math expression"
        rows="3"
        multiline
        placeholder="Your math expression (for example, 2*sqrt(6))..."
        raw-text
        monospace
        autofocus
      />
    </c-card>

    <c-card v-if="result !== ''" title="Result">
      <output text-xl font-mono>{{ result }}</output>
    </c-card>
  </div>
</template>
