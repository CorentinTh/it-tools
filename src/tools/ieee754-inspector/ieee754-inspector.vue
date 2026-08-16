<script setup lang="ts">
import type { FloatFormat, FloatInspection } from './ieee754-inspector.service';
import { inspectFloat } from './ieee754-inspector.service';

const input = ref('0.1');
const format = ref<FloatFormat>('binary64');
const result = ref<FloatInspection>();
const error = ref('');
const completedSignature = ref('');
const signature = computed(() => `${format.value}\0${input.value}`);
const stale = computed(() => Boolean(result.value && signature.value !== completedSignature.value));

function inspect() {
  error.value = '';
  try {
    result.value = inspectFloat(input.value, format.value);
    completedSignature.value = signature.value;
  }
  catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'Floating-point inspection failed.';
  }
}
inspect();
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Bit-exact local inspection">
      The entered decimal is compared as an exact decimal rational with the selected stored IEEE-754 value. Byte order is display-only; this tool does not read machine-native memory.
    </c-alert>
    <c-card class="c-task-options" title="Input">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-input-text v-model:value="input" label="Decimal value" placeholder="0.1" :maxlength="512" raw-text monospace />
        <c-select v-model:value="format" label="Format" :options="[{ label: 'binary32 / float', value: 'binary32' }, { label: 'binary64 / double', value: 'binary64' }]" />
      </div>
    </c-card>
    <div class="c-task-actions">
      <c-button type="primary" data-test-id="float-inspect" @click="inspect">
        Inspect bits
      </c-button>
    </div>
    <c-alert v-if="error" title="Invalid floating-point input" data-test-id="float-error">
      {{ error }}
    </c-alert>
    <c-alert v-if="stale" title="Result uses the previous input">
      Inspect again to apply the current input and format.
    </c-alert>
    <template v-if="result">
      <c-card title="Fields" data-test-id="float-fields">
        <div grid grid-cols-1 gap-2 md:grid-cols-2>
          <p><strong>Classification:</strong> {{ result.classification }}</p>
          <p><strong>Parsed/stored display:</strong> {{ result.parsedValue }}</p>
          <p><strong>Sign:</strong> <code>{{ result.signBit }}</code></p>
          <p><strong>Unbiased exponent:</strong> {{ result.unbiasedExponent }}</p>
          <p md:col-span-2>
            <strong>Exponent bits:</strong> <code break-all>{{ result.exponentBits }}</code>
          </p>
          <p md:col-span-2>
            <strong>Fraction bits:</strong> <code break-all>{{ result.fractionBits }}</code>
          </p>
          <p><strong>Big-endian bytes:</strong> <code>{{ result.bigEndianHex }}</code></p>
          <p><strong>Little-endian bytes:</strong> <code>{{ result.littleEndianHex }}</code></p>
        </div>
      </c-card>
      <c-input-text :value="result.exactStoredValue" label="Exact stored value" data-test-id="float-exact" raw-text monospace readonly multiline :rows="6" />
      <c-input-text :value="result.roundingError" label="Exact rounding error (stored − entered)" data-test-id="float-error-value" raw-text monospace readonly multiline :rows="6" />
    </template>
  </div>
</template>
