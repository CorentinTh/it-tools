<script setup lang="ts">
import { MAX_TOKEN_LENGTH, createToken } from './token-generator.service';
import { useCopy } from '@/composable/copy';
import { useQueryParam } from '@/composable/queryParams';
import { computedRefreshable } from '@/composable/computedRefreshable';
import CInputNumber from '@/ui/c-input-number/c-input-number.vue';
import CSwitch from '@/ui/c-switch/c-switch.vue';

const length = useQueryParam({ name: 'length', defaultValue: 64 });
const withUppercase = useQueryParam({ name: 'uppercase', defaultValue: true });
const withLowercase = useQueryParam({ name: 'lowercase', defaultValue: true });
const withNumbers = useQueryParam({ name: 'numbers', defaultValue: true });
const withSymbols = useQueryParam({ name: 'symbols', defaultValue: false });
const { t } = useI18n();

const safeLength = computed({
  get() {
    const value = Number(length.value);

    if (!Number.isSafeInteger(value)) {
      return 64;
    }

    return Math.min(MAX_TOKEN_LENGTH, Math.max(1, value));
  },
  set(value: number) {
    length.value = value;
  },
});

const [token, refreshToken] = computedRefreshable(() =>
  createToken({
    length: safeLength.value,
    withUppercase: withUppercase.value,
    withLowercase: withLowercase.value,
    withNumbers: withNumbers.value,
    withSymbols: withSymbols.value,
  }),
{
  dependencies: [safeLength, withUppercase, withLowercase, withNumbers, withSymbols],
},
);

const { copy } = useCopy({ source: token, text: t('tools.token-generator.copied') });
</script>

<template>
  <div class="c-generator-layout">
    <c-card class="c-generator-options">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <CSwitch v-model:value="withUppercase" :label="t('tools.token-generator.uppercase')" />
        <CSwitch v-model:value="withLowercase" :label="t('tools.token-generator.lowercase')" />
        <CSwitch v-model:value="withNumbers" :label="t('tools.token-generator.numbers')" />
        <CSwitch v-model:value="withSymbols" :label="t('tools.token-generator.symbols')" />
      </div>

      <c-field
        id="token-length-field"
        :label="`${t('tools.token-generator.length')} (1–${MAX_TOKEN_LENGTH})`"
        label-for="token-length"
        mt-4
      >
        <CInputNumber
          id="token-length"
          v-model:value="safeLength"
          :min="1"
          :max="MAX_TOKEN_LENGTH"
          :placeholder="t('tools.token-generator.length')"
          test-id="token-length"
        />
      </c-field>
    </c-card>

    <c-input-text
      class="c-generator-output"
      :value="token"
      aria-label="Generated token"
      :placeholder="t('tools.token-generator.tokenPlaceholder')"
      test-id="token-output"
      rows="8"
      readonly
      raw-text
      multiline
      monospace
    />

    <div class="c-generator-actions">
      <c-button type="primary" data-test-id="token-generate" @click="refreshToken">
        {{ t('tools.token-generator.button.generate') }}
      </c-button>
      <c-button data-test-id="token-copy" @click="copy()">
        {{ t('tools.token-generator.button.copy') }}
      </c-button>
    </div>
  </div>
</template>
