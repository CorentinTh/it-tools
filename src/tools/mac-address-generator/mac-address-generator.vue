<script setup lang="ts">
import _ from 'lodash';
import { generateRandomMacAddress } from './mac-adress-generator.models';
import { computedRefreshable } from '@/composable/computedRefreshable';
import { useCopy } from '@/composable/copy';
import { useResilientStorage } from '@/composable/use-resilient-storage';
import CInputNumber from '@/ui/c-input-number/c-input-number.vue';
import { usePartialMacAddressValidation } from '@/utils/macAddress';

const amount = useResilientStorage('mac-address-generator-amount', 1);
const macAddressPrefix = ref('64:16:7F');

const prefixValidation = usePartialMacAddressValidation(macAddressPrefix);

const casesTransformers = [
  { label: 'Uppercase', value: (value: string) => value.toUpperCase() },
  { label: 'Lowercase', value: (value: string) => value.toLowerCase() },
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
    label: 'None',
    value: '',
  },
];
const separator = useResilientStorage('mac-address-generator-separator', separators[0].value);

const [macAddresses, refreshMacAddresses] = computedRefreshable(() => {
  if (!prefixValidation.isValid) {
    return '';
  }

  const ids = _.times(amount.value, () => caseTransformer.value(generateRandomMacAddress({
    prefix: macAddressPrefix.value,
    separator: separator.value,
  })));
  return ids.join('\n');
}, {
  dependencies: [amount, macAddressPrefix, () => prefixValidation.isValid, caseTransformer, separator],
});

const { copy } = useCopy({ source: macAddresses, text: 'MAC addresses copied to the clipboard' });
</script>

<template>
  <div class="c-generator-layout">
    <c-card class="c-generator-options">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-field label="Quantity (1–100)" label-for="mac-address-quantity">
          <CInputNumber
            id="mac-address-quantity"
            v-model:value="amount"
            test-id="mac-address-quantity"
            :min="1"
            :max="100"
          />
        </c-field>

        <c-input-text
          id="mac-address-prefix"
          v-model:value="macAddressPrefix"
          label="MAC address prefix"
          placeholder="Set a prefix, e.g. 64:16:7F"
          test-id="mac-address-prefix"
          spellcheck="false"
          :validation="prefixValidation"
          raw-text
          clearable
          monospace
        />

        <c-buttons-select
          v-model:value="caseTransformer"
          :options="casesTransformers"
          label="Case"
          label-position="top"
        />

        <c-buttons-select
          v-model:value="separator"
          :options="separators"
          label="Separator"
          label-position="top"
        />
      </div>
    </c-card>

    <c-input-text
      class="c-generator-output"
      :value="macAddresses"
      aria-label="Generated MAC addresses"
      placeholder="Generated MAC addresses"
      test-id="mac-address-output"
      :rows="12"

      raw-text monospace readonly multiline
    />

    <div class="c-generator-actions">
      <c-button
        type="primary"
        data-test-id="mac-address-generate"
        :disabled="!prefixValidation.isValid"
        @click="refreshMacAddresses()"
      >
        Generate
      </c-button>
      <c-button data-test-id="mac-address-copy" :disabled="!macAddresses" @click="copy()">
        Copy
      </c-button>
    </div>
  </div>
</template>
