<script setup lang="ts">
import { createToken } from './token-generator.service';
import { useCopy } from '@/composable/copy';
import { useQueryParam } from '@/composable/queryParams';
import { computedRefreshable } from '@/composable/computedRefreshable';

const length = useQueryParam({ name: 'length', defaultValue: 64 });
const withUppercase = useQueryParam({ name: 'uppercase', defaultValue: true });
const withLowercase = useQueryParam({ name: 'lowercase', defaultValue: true });
const withNumbers = useQueryParam({ name: 'numbers', defaultValue: true });
const withSymbols = useQueryParam({ name: 'symbols', defaultValue: false });
const { t } = useI18n();

const [token, refreshToken] = computedRefreshable(() =>
  createToken({
    length: length.value,
    withUppercase: withUppercase.value,
    withLowercase: withLowercase.value,
    withNumbers: withNumbers.value,
    withSymbols: withSymbols.value,
  }),
);

const { copy } = useCopy({ source: token, text: t('tools.token-generator.copied') });
</script>

<template>
  <div>
    <c-card>
      <n-form label-placement="left" label-width="140">
        <div flex justify-center>
          <div>
            <n-form-item :label="t('tools.token-generator.uppercase')">
              <n-switch v-model:value="withUppercase" />
            </n-form-item>

            <n-form-item :label="t('tools.token-generator.lowercase')">
              <n-switch v-model:value="withLowercase" />
            </n-form-item>
          </div>

          <div>
            <n-form-item :label="t('tools.token-generator.numbers')">
              <n-switch v-model:value="withNumbers" />
            </n-form-item>

            <n-form-item :label="t('tools.token-generator.symbols')">
              <n-switch v-model:value="withSymbols" />
            </n-form-item>
          </div>
        </div>
      </n-form>

      <n-form-item :label="`${t('tools.token-generator.length')} (${length})`" label-placement="left">
        <n-slider v-model:value="length" :step="1" :min="1" :max="512" />
      </n-form-item>

      <c-input-text
        v-model:value="token"
        multiline
        :placeholder="t('tools.token-generator.tokenPlaceholder')"
        readonly
        rows="3"
        autosize
        class="token-display"
      />

      <div mt-5 flex justify-center gap-3>
        <c-button @click="copy()">
          {{ t('tools.token-generator.button.copy') }}
        </c-button>
        <c-button @click="refreshToken">
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
