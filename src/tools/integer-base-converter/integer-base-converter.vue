<script setup lang="ts">
import InputCopyable from '../../components/InputCopyable.vue';
import { convertBase } from './integer-base-converter.model';
import { getErrorMessageIfThrows } from '@/utils/error';

const inputProps = {
  'labelPosition': 'left',
  'labelWidth': '170px',
  'labelAlign': 'right',
  'readonly': true,
  'mb-2': '',
} as const;

const { t } = useI18n();

const input = ref('42');
const inputBase = ref(10);
const outputBase = ref(42);

function errorlessConvert(...args: Parameters<typeof convertBase>) {
  try {
    return convertBase(...args);
  }
  catch (err) {
    return '';
  }
}

const error = computed(() =>
  getErrorMessageIfThrows(() =>
    convertBase({ value: input.value, fromBase: inputBase.value, toBase: outputBase.value }),
  ),
);
</script>

<template>
  <div>
    <c-card>
      <c-input-text v-model:value="input" :label="t('tools.base-converter.inputLabel')" :placeholder="t('tools.base-converter.inputPlaceholder')" label-position="left" label-width="110px" mb-2 label-align="right" />

      <n-form-item :label="t('tools.base-converter.inputBaseLabel')" label-placement="left" label-width="110" :show-feedback="false">
        <n-input-number v-model:value="inputBase" max="64" min="2" :placeholder="t('tools.base-converter.inputBasePlaceholder')" w-full />
      </n-form-item>

      <n-alert v-if="error" style="margin-top: 25px" type="error">
        {{ error }}
      </n-alert>
      <n-divider />

      <InputCopyable
        :label="t('tools.base-converter.binaryLabel')"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 2 })"
        :placeholder="t('tools.base-converter.binaryPlaceholder')"
      />

      <InputCopyable
        :label="t('tools.base-converter.octalLabel')"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 8 })"
        :placeholder="t('tools.base-converter.octalPlaceholder')"
      />

      <InputCopyable
        :label="t('tools.base-converter.decimalLabel')"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 10 })"
        :placeholder="t('tools.base-converter.decimalPlaceholder')"
      />

      <InputCopyable
        :label="t('tools.base-converter.hexadecimalLabel')"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 16 })"
        :placeholder="t('tools.base-converter.hexadecimalPlaceholder')"
      />

      <InputCopyable
        :label="t('tools.base-converter.base64Label')"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 64 })"
        :placeholder="t('tools.base-converter.base64Placeholder')"
      />

      <div flex items-baseline>
        <n-input-group style="width: 160px; margin-right: 10px">
          <n-input-group-label> {{ t('tools.base-converter.custom') }} </n-input-group-label>
          <n-input-number v-model:value="outputBase" max="64" min="2" />
        </n-input-group>

        <InputCopyable
          flex-1
          v-bind="inputProps"
          :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: outputBase })"
          :placeholder="t('tools.base-converter.copyable', { outputBase })"
        />
      </div>
    </c-card>
  </div>
</template>

<style lang="less" scoped>
.n-input-group:not(:first-child) {
  margin-top: 5px;
}
</style>
