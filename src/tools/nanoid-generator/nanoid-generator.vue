<script setup lang="ts">
import {
  DEFAULT_NANOID_ALPHABET,
  DEFAULT_NANOID_LENGTH,
  DEFAULT_NANOID_QUANTITY,
  MAX_NANOID_ALPHABET_CODE_UNITS,
  MAX_NANOID_LENGTH,
  MAX_NANOID_QUANTITY,
  MAX_NANOID_TOTAL_SYMBOLS,
  calculateNanoIdCollisionMetrics,
  formatScientificNumber,
  generateNanoIdBatch,
  parseNanoIdCountInput,
  validateNanoIdOptions,
} from './nanoid-generator.service';
import type { NanoIdOptions, NanoIdValidation } from './nanoid-generator.service';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';
import CSwitch from '@/ui/c-switch/c-switch.vue';

const { t } = useI18n();

const lengthInput = ref(String(DEFAULT_NANOID_LENGTH));
const quantityInput = ref(String(DEFAULT_NANOID_QUANTITY));
const useCustomAlphabet = ref(false);
const customAlphabet = ref(DEFAULT_NANOID_ALPHABET);
const output = ref('');
const generatedOptionsSignature = ref('');
const generationError = ref('');

const effectiveAlphabet = computed(() => (
  useCustomAlphabet.value ? customAlphabet.value : DEFAULT_NANOID_ALPHABET
));

const options = computed<NanoIdOptions>(() => ({
  alphabet: effectiveAlphabet.value,
  length: parseNanoIdCountInput(lengthInput.value, MAX_NANOID_LENGTH),
  quantity: parseNanoIdCountInput(quantityInput.value, MAX_NANOID_QUANTITY),
}));

const validation = computed<NanoIdValidation>(() => {
  return validateNanoIdOptions(options.value);
});

const collisionMetrics = computed(() => {
  if (!validation.value.isValid) {
    return undefined;
  }

  return calculateNanoIdCollisionMetrics({
    alphabetSize: validation.value.alphabetSize,
    length: options.value.length,
    sampleCount: options.value.quantity,
  });
});

function optionsSignature(value: NanoIdOptions) {
  return `${value.length}\u0000${value.quantity}\u0000${value.alphabet}`;
}

const outputIsStale = computed(() => Boolean(
  output.value
  && generatedOptionsSignature.value !== optionsSignature(options.value),
));

const collisionProbability = computed(() => {
  const metrics = collisionMetrics.value;
  if (!metrics || !metrics.collisionProbabilityScientific) {
    return '0';
  }

  return formatScientificNumber(metrics.collisionProbabilityScientific);
});

const collisionRiskIsHigh = computed(() => (
  (collisionMetrics.value?.collisionProbability ?? 0) >= 0.01
));

const onePercentThresholdIsBelowTwo = computed(() => {
  const threshold = collisionMetrics.value?.onePercentCollisionCount;
  if (!threshold) {
    return false;
  }

  return threshold.exponent < 0 || (threshold.exponent === 0 && threshold.mantissa < 2);
});

function generate() {
  generationError.value = '';
  if (!validation.value.isValid) {
    generationError.value = validation.value.message ?? t('tools.nanoid-generator.validation.invalid');
    return;
  }

  try {
    const batch = generateNanoIdBatch(options.value);
    output.value = batch.text;
    generatedOptionsSignature.value = optionsSignature(options.value);
  }
  catch (error) {
    generationError.value = error instanceof Error
      ? error.message
      : t('tools.nanoid-generator.validation.generationFailed');
  }
}

watch([lengthInput, quantityInput, useCustomAlphabet, customAlphabet], () => {
  generationError.value = '';
});

function download() {
  if (output.value) {
    downloadTextFile({ content: output.value, filename: 'nanoids.txt' });
  }
}

function clear() {
  output.value = '';
  generatedOptionsSignature.value = '';
  generationError.value = '';
}

const { copy } = useCopy({ source: output, text: t('tools.nanoid-generator.copied') });

generate();
</script>

<template>
  <div class="c-generator-layout">
    <c-card class="c-generator-options">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-input-text
          id="nanoid-length"
          v-model:value="lengthInput"
          :label="`${t('tools.nanoid-generator.length')} (1–${MAX_NANOID_LENGTH})`"
          :maxlength="String(MAX_NANOID_LENGTH).length"
          test-id="nanoid-length"
          inputmode="numeric"
          raw-text
        />

        <c-input-text
          id="nanoid-quantity"
          v-model:value="quantityInput"
          :label="`${t('tools.nanoid-generator.quantity')} (1–${MAX_NANOID_QUANTITY.toLocaleString('en-US')})`"
          :maxlength="String(MAX_NANOID_QUANTITY).length"
          test-id="nanoid-quantity"
          inputmode="numeric"
          raw-text
        />
      </div>

      <CSwitch
        id="nanoid-custom-alphabet"
        v-model:value="useCustomAlphabet"
        :label="t('tools.nanoid-generator.customAlphabet')"
        test-id="nanoid-custom-alphabet"
        class="mt-4"
      />

      <c-input-text
        v-if="useCustomAlphabet"
        v-model:value="customAlphabet"
        :label="t('tools.nanoid-generator.alphabet')"
        :maxlength="MAX_NANOID_ALPHABET_CODE_UNITS"
        :placeholder="DEFAULT_NANOID_ALPHABET"
        test-id="nanoid-alphabet"
        class="mt-3"

        raw-text monospace clearable
      />

      <p mt-3 text-sm op-70>
        {{ t('tools.nanoid-generator.limitHelp', { total: MAX_NANOID_TOTAL_SYMBOLS.toLocaleString('en-US') }) }}
      </p>

      <c-alert
        v-if="!validation.isValid || generationError"
        :title="t('tools.nanoid-generator.invalidConfiguration')"
        mt-3
        data-test-id="nanoid-validation"
      >
        {{ generationError || validation.message }}
      </c-alert>
    </c-card>

    <c-card v-if="collisionMetrics" data-test-id="nanoid-guidance">
      <div grid grid-cols-1 gap-2 md:grid-cols-2>
        <div>
          <span fw-600>{{ t('tools.nanoid-generator.alphabetSize') }}:</span>
          {{ collisionMetrics.alphabetSize }}
        </div>
        <div>
          <span fw-600>{{ t('tools.nanoid-generator.entropy') }}:</span>
          {{ collisionMetrics.entropyBits.toFixed(2) }} bits
        </div>
        <div>
          <span fw-600>{{ t('tools.nanoid-generator.namespace') }}:</span>
          {{ formatScientificNumber(collisionMetrics.namespaceSize) }}
        </div>
        <div>
          <span fw-600>{{ t('tools.nanoid-generator.batchCollision') }}:</span>
          {{ collisionProbability }}
        </div>
        <div md:col-span-2>
          <span fw-600>{{ t('tools.nanoid-generator.onePercentThreshold') }}:</span>
          {{ onePercentThresholdIsBelowTwo
            ? t('tools.nanoid-generator.fewerThanTwo')
            : formatScientificNumber(collisionMetrics.onePercentCollisionCount) }}
        </div>
      </div>
      <p mt-3 text-sm op-70>
        {{ t('tools.nanoid-generator.collisionDisclaimer') }}
      </p>
      <c-alert
        v-if="collisionRiskIsHigh"
        :title="t('tools.nanoid-generator.highCollisionRisk')"
        mt-3
        data-test-id="nanoid-collision-warning"
      >
        {{ t('tools.nanoid-generator.highCollisionRiskHelp') }}
      </c-alert>
    </c-card>

    <c-alert
      v-if="outputIsStale"
      :title="t('tools.nanoid-generator.previousSettings')"
      data-test-id="nanoid-stale"
    >
      {{ t('tools.nanoid-generator.previousSettingsHelp') }}
    </c-alert>

    <c-input-text
      class="c-generator-output"
      :value="output"
      aria-label="Generated NanoIDs"
      :placeholder="t('tools.nanoid-generator.outputPlaceholder')"
      test-id="nanoid-output"

      raw-text monospace readonly multiline
      :rows="12"
    />

    <div class="c-generator-actions">
      <c-button
        type="primary"
        :disabled="!validation.isValid"
        data-test-id="nanoid-generate"
        @click="generate"
      >
        {{ t('tools.nanoid-generator.generate') }}
      </c-button>
      <c-button :disabled="!output" data-test-id="nanoid-copy" @click="copy()">
        {{ t('tools.nanoid-generator.copy') }}
      </c-button>
      <c-button :disabled="!output" data-test-id="nanoid-download" @click="download">
        {{ t('tools.nanoid-generator.download') }}
      </c-button>
      <c-button :disabled="!output" data-test-id="nanoid-clear" @click="clear">
        {{ t('tools.nanoid-generator.clear') }}
      </c-button>
    </div>
  </div>
</template>
