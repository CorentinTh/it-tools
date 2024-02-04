<script setup lang="ts">
import _ from 'lodash';
import { generateRandomMacAddress } from './mac-adress-generator.models';
import { computedRefreshable } from '@/composable/computedRefreshable';
import { useCopy } from '@/composable/copy';
import { usePartialMacAddressValidation } from '@/utils/macAddress';

const amount = useStorage('mac-address-generator-amount', 1);
const macAddressPrefix = useStorage('mac-address-generator-prefix', '64:16:7F');

const prefixValidation = usePartialMacAddressValidation(macAddressPrefix);

const casesTransformers = [
  { label: '大写', value: (value: string) => value.toUpperCase() },
  { label: '小写', value: (value: string) => value.toLowerCase() },
];
const caseTransformer = ref(casesTransformers[0].value);

const separators = [
  {
    label: ':',
    value: ':',
  },
  {
    label: '-',
    value: '-',
  },
  {
    label: '.',
    value: '.',
  },
  {
    label: '无',
    value: '',
  },
];
const separator = useStorage('mac-address-generator-separator', separators[0].value);

const [macAddresses, refreshMacAddresses] = computedRefreshable(() => {
  if (!prefixValidation.isValid) {
    return '';
  }

  const ids = _.times(amount.value, () => caseTransformer.value(generateRandomMacAddress({
    prefix: macAddressPrefix.value,
    separator: separator.value,
  })));
  return ids.join('\n');
});

const { copy } = useCopy({ source: macAddresses, text: 'MAC地址已复制到剪贴板' });
</script>

<template>
  <div flex flex-col justify-center gap-2>
    <div flex items-center>
      <label w-150px pr-12px text-right> 数量:</label>
      <n-input-number v-model:value="amount" min="1" max="10000" flex-1 />
    </div>

    <c-input-text
      v-model:value="macAddressPrefix"
      label="MAC地址前缀:"
      placeholder="设置前缀，例：64:16:7F"
      clearable
      label-position="left"
      spellcheck="false"
      :validation="prefixValidation"
      raw-text
      label-width="150px"
      label-align="right"
    />

    <c-buttons-select
      v-model:value="caseTransformer"
      :options="casesTransformers"
      label="格式:"
      label-width="150px"
      label-align="right"
    />

    <c-buttons-select
      v-model:value="separator"
      :options="separators"
      label="分隔符:"
      label-width="150px"
      label-align="right"
    />

    <c-card mt-5 flex data-test-id="ulids">
      <pre m-0 m-x-auto>{{ macAddresses }}</pre>
    </c-card>

    <div flex justify-center gap-2>
      <c-button data-test-id="refresh" @click="refreshMacAddresses()">
        刷新
      </c-button>
      <c-button @click="copy()">
        复制
      </c-button>
    </div>
  </div>
</template>
