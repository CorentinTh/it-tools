<script setup lang="ts">
import { createMathWorkerClient } from './math-evaluator.worker-client';
import { MATH_LIVE_MAX_BYTES, MATH_MAX_INPUT_BYTES } from './math-evaluator.worker.protocol';
import { useBoundedTextTransform } from '@/composable/bounded-text-transform';

const expression = ref('');
const client = createMathWorkerClient();
const {
  cancel,
  hasError,
  isRunning,
  output: result,
  run,
  state,
} = useBoundedTextTransform({
  client,
  createTask: () => ({ expression: expression.value }),
  debounceMs: 350,
  label: 'math evaluation',
  liveMaxBytes: MATH_LIVE_MAX_BYTES,
  maxInputBytes: MATH_MAX_INPUT_BYTES,
  source: expression,
  watchSources: [expression],
});
</script>

<template>
  <div class="c-form-layout">
    <c-card title="Expression">
      <c-input-text
        v-model:value="expression"
        label="Math expression"
        rows="3"
        placeholder="Your math expression (for example, 2*sqrt(6))..."
        raw-text autofocus multiline monospace
      />
    </c-card>

    <div class="c-task-actions">
      <c-button type="primary" data-test-id="math-run" :disabled="expression.trim() === '' || isRunning" @click="run">
        {{ isRunning ? 'Evaluating…' : 'Evaluate' }}
      </c-button>
      <c-button v-if="isRunning" type="warning" data-test-id="math-cancel" @click="cancel">
        Cancel
      </c-button>
    </div>

    <p
      v-if="state.message"
      data-test-id="math-status"
      role="status"
      aria-live="polite"
      :class="{ 'status-error': hasError }"
    >
      {{ state.message }}
    </p>

    <c-card v-if="result !== ''" title="Result">
      <output data-test-id="math-result" text-xl font-mono>{{ result }}</output>
    </c-card>
  </div>
</template>

<style scoped>
.status-error {
  color: var(--n-feedback-text-color-error);
}
</style>
