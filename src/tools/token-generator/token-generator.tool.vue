<script setup lang="ts">
import { MAX_TOKEN_ALPHABET_SIZE, MAX_TOKEN_LENGTH, MAX_TOKEN_QUANTITY, createTokens } from './token-generator.service';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';
import { useResilientStorage } from '@/composable/use-resilient-storage';
import CInputNumber from '@/ui/c-input-number/c-input-number.vue';
import CSwitch from '@/ui/c-switch/c-switch.vue';

const length = useResilientStorage('token-generator:v1:length', 64);
const quantity = useResilientStorage('token-generator:v1:quantity', 1);
const withUppercase = useResilientStorage('token-generator:v1:uppercase', true);
const withLowercase = useResilientStorage('token-generator:v1:lowercase', true);
const withNumbers = useResilientStorage('token-generator:v1:numbers', true);
const withSymbols = useResilientStorage('token-generator:v1:symbols', false);
const customAlphabet = ref('');
const deniedCharacters = ref('');
const output = ref('');
const error = ref('');
const status = ref('Ready.');
const { t } = useI18n();

const safeLength = computed({
  get: () => Number.isSafeInteger(Number(length.value)) ? Math.min(MAX_TOKEN_LENGTH, Math.max(1, Number(length.value))) : 64,
  set: value => length.value = value,
});
const safeQuantity = computed({
  get: () => Number.isSafeInteger(Number(quantity.value)) ? Math.min(MAX_TOKEN_QUANTITY, Math.max(1, Number(quantity.value))) : 1,
  set: value => quantity.value = value,
});

function generate() {
  error.value = '';
  try {
    output.value = createTokens({
      length: safeLength.value,
      quantity: safeQuantity.value,
      withUppercase: withUppercase.value,
      withLowercase: withLowercase.value,
      withNumbers: withNumbers.value,
      withSymbols: withSymbols.value,
      customAlphabet: customAlphabet.value,
      deniedCharacters: deniedCharacters.value,
    }).join('\n');
    status.value = `Generated ${safeQuantity.value} token${safeQuantity.value === 1 ? '' : 's'} locally.`;
  }
  catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'Token generation failed.';
    status.value = 'Generation failed.';
  }
}

function clearResult() {
  output.value = '';
  error.value = '';
  status.value = 'Generated output cleared.';
}

const { copy } = useCopy({ source: output, text: t('tools.token-generator.copied') });
onMounted(generate);
</script>

<template>
  <div class="c-generator-layout">
    <c-alert title="Local unbiased generation">
      Web Crypto rejection sampling gives every character in the final alphabet equal probability. Only harmless versioned length/count/toggle preferences are stored; custom, denied, and generated values remain session-only.
    </c-alert>
    <c-card class="c-generator-options" title="Alphabet and batch">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <CSwitch v-model:value="withUppercase" :label="t('tools.token-generator.uppercase')" :disabled="Boolean(customAlphabet)" />
        <CSwitch v-model:value="withLowercase" :label="t('tools.token-generator.lowercase')" :disabled="Boolean(customAlphabet)" />
        <CSwitch v-model:value="withNumbers" :label="t('tools.token-generator.numbers')" :disabled="Boolean(customAlphabet)" />
        <CSwitch v-model:value="withSymbols" :label="t('tools.token-generator.symbols')" :disabled="Boolean(customAlphabet)" />
      </div>
      <div grid grid-cols-1 mt-4 gap-3 md:grid-cols-2>
        <c-input-text v-model:value="customAlphabet" label="Custom alphabet (optional)" :maxlength="MAX_TOKEN_ALPHABET_SIZE" placeholder="Overrides category switches" raw-text />
        <c-input-text v-model:value="deniedCharacters" label="Denied characters" :maxlength="MAX_TOKEN_ALPHABET_SIZE" placeholder="For example: 0OIl1" raw-text />
      </div>
      <div grid grid-cols-1 mt-4 gap-3 md:grid-cols-2>
        <c-field id="token-length-field" :label="`${t('tools.token-generator.length')} (1–${MAX_TOKEN_LENGTH})`" label-for="token-length">
          <CInputNumber id="token-length" v-model:value="safeLength" :min="1" :max="MAX_TOKEN_LENGTH" test-id="token-length" />
        </c-field>
        <c-field id="token-quantity-field" :label="`Quantity (1–${MAX_TOKEN_QUANTITY})`" label-for="token-quantity">
          <CInputNumber id="token-quantity" v-model:value="safeQuantity" :min="1" :max="MAX_TOKEN_QUANTITY" test-id="token-quantity" />
        </c-field>
      </div>
    </c-card>

    <c-input-text class="c-generator-output" :value="output" aria-label="Generated tokens" placeholder="Generated tokens" test-id="token-output" rows="12" readonly raw-text multiline monospace />
    <p class="c-task-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="error" title="Token generation error">
      {{ error }}
    </c-alert>
    <div class="c-generator-actions">
      <c-button type="primary" data-test-id="token-generate" @click="generate">
        {{ t('tools.token-generator.button.generate') }}
      </c-button>
      <c-button :disabled="!output" data-test-id="token-copy" @click="copy()">
        {{ t('tools.token-generator.button.copy') }}
      </c-button>
      <c-button :disabled="!output" @click="downloadTextFile({ content: output, filename: 'tokens.txt' })">
        Download
      </c-button>
      <c-button :disabled="!output" @click="clearResult">
        Clear result
      </c-button>
    </div>
  </div>
</template>
