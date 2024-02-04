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
      <c-input-text v-model:value="input" label="数值" placeholder="在这里输入数值 (例：42)" label-position="left" label-width="110px" mb-2 label-align="right" />

      <n-form-item label="进制" label-placement="left" label-width="110" :show-feedback="false">
        <n-input-number v-model:value="inputBase" max="64" min="2" placeholder="在这里输入进制 (例：十进制输入 10)" w-full />
      </n-form-item>

      <n-alert v-if="error" style="margin-top: 25px" type="error">
        {{ error }}
      </n-alert>
      <n-divider />

      <InputCopyable
        label="二进制"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 2 })"
        placeholder="转换为二进制"
      />

      <InputCopyable
        label="八进制"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 8 })"
        placeholder="转换为八进制"
      />

      <InputCopyable
        label="十进制"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 10 })"
        placeholder="转换为十进制"
      />

      <InputCopyable
        label="十六进制"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 16 })"
        placeholder="转换为十六进制"
      />

      <InputCopyable
        label="Base64"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 64 })"
        placeholder="转换为Base64"
      />

      <div flex items-baseline>
        <n-input-group style="width: 160px; margin-right: 10px">
          <n-input-group-label> 自定义 </n-input-group-label>
          <n-input-number v-model:value="outputBase" max="64" min="2" placeholder="进制" />
        </n-input-group>

        <InputCopyable
          flex-1
          v-bind="inputProps"
          :value="outputBase ? errorlessConvert({ value: input, fromBase: inputBase, toBase: outputBase }) : ''"
          :placeholder="`转换为${outputBase ? outputBase : '自定义'}进制`"
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
