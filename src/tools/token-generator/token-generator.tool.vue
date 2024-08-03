<script setup lang="ts">
import { createToken } from './token-generator.service';
import { useCopy } from '@/composable/copy';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { computedRefreshable } from '@/composable/computedRefreshable';

const count = useQueryParamOrStorage({ name: 'count', storageName: 'token-generator:count', defaultValue: 1 });
const length = useQueryParamOrStorage({ name: 'length', storageName: 'token-generator:length', defaultValue: 64 });
const withUppercase = useQueryParamOrStorage({ name: 'uppercase', storageName: 'token-generator:uppercase', defaultValue: true });
const withLowercase = useQueryParamOrStorage({ name: 'lowercase', storageName: 'token-generator:lowercase', defaultValue: true });
const withNumbers = useQueryParamOrStorage({ name: 'numbers', storageName: 'token-generator:numbers', defaultValue: true });
const withSymbols = useQueryParamOrStorage({ name: 'symbols', storageName: 'token-generator:symbols', defaultValue: false });
const deniedChars = useQueryParamOrStorage({ name: 'deny', storageName: 'token-generator:deny', defaultValue: '' });
const { t } = useI18n();

const [tokens, refreshTokens] = computedRefreshable(() =>
  Array.from({ length: count.value },
    () => createToken({
      length: length.value,
      withUppercase: withUppercase.value,
      withLowercase: withLowercase.value,
      withNumbers: withNumbers.value,
      withSymbols: withSymbols.value,
      deniedChars: deniedChars.value,
    })).join('\n'),
);

const { copy } = useCopy({ source: tokens, text: t('tools.token-generator.copied') });
</script>

<template>
  <div>
    <c-card>
      <n-form label-placement="left" label-width="140">
        <n-space justify="center">
          <n-form-item :label="t('tools.token-generator.uppercase')">
            <n-switch v-model:value="withUppercase" />
          </n-form-item>

          <n-form-item :label="t('tools.token-generator.lowercase')">
            <n-switch v-model:value="withLowercase" />
          </n-form-item>
          <n-form-item :label="t('tools.token-generator.numbers')">
            <n-switch v-model:value="withNumbers" />
          </n-form-item>

          <n-form-item :label="t('tools.token-generator.symbols')">
            <n-switch v-model:value="withSymbols" />
          </n-form-item>
        </n-space>
      </n-form>

      <n-form-item label="Denied Characters (ie, visually similar { oO01lI } or punctuations)" label-placement="top">
        <c-input-text
          v-model:value="deniedChars"
          placeholder="Put characters to deny from token"
        />
      </n-form-item>

      <n-form-item :label="`${t('tools.token-generator.length')} (${length})`" label-placement="left">
        <n-slider v-model:value="length" :step="1" :min="1" :max="512" mr-2 />
        <n-input-number v-model:value="length" size="small" />
      </n-form-item>

      <n-form-item label="Number of token to generate" label-placement="left">
        <n-input-number v-model:value="count" size="small" />
      </n-form-item>

      <c-input-text
        v-model:value="tokens"
        multiline
        :placeholder="t('tools.token-generator.tokenPlaceholder')"
        readonly
        rows="3"
        autosize
        class="token-display"
        word-wrap
      />

      <div mt-5 flex justify-center gap-3>
        <c-button @click="copy()">
          {{ t('tools.token-generator.button.copy') }}
        </c-button>
        <c-button @click="refreshTokens">
          {{ t('tools.token-generator.button.refresh') }}
        </c-button>
      </div>
    </c-card>
  </div>
</template>

<style scoped lang="less">
::v-deep(.token-display) {
  textarea {
    text-align: center;
  }
}
</style>
