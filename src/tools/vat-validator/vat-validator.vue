<script setup lang="ts">
import { checkVAT, countries } from 'jsvat-next';
import type { CKeyValueListItems } from '@/ui/c-key-value-list/c-key-value-list.types';

const rawVATNumber = ref('BE0411905847');
const vatInfos = computed<{ isValid: boolean; infos: CKeyValueListItems }>(() => {
  const vat = checkVAT(rawVATNumber.value, countries);
  if (vat == null) {
    return { isValid: false, infos: [] };
  }
  return {
    isValid: vat.isValid,
    infos: [
      {
        label: 'Is VAT Number valid ?',
        value: vat.isValid,
      },
      {
        label: 'Is VAT Number valid format ?',
        value: vat.isValidFormat,
      },
      {
        label: 'Cleaned VAT Number',
        value: vat.value,
      },
      {
        label: 'Country (name)',
        value: vat.country?.name || 'Unknown',
      },
      {
        label: 'Country (ISO2)',
        value: vat.country?.isoCode?.short || 'unk',
      },
      {
        label: 'Country (ISO3)',
        value: vat.country?.isoCode?.long || 'unk',
      },
      {
        label: 'Country (ISO Num)',
        value: vat.country?.isoCode?.numeric || 0,
      },
    ],
  };
});
</script>

<template>
  <div>
    <c-input-text v-model:value="rawVATNumber" placeholder="Enter a VAT number to check for validity..." test-id="vat-input" mb-2 />
    <n-alert v-if="!vatInfos.isValid" type="error" mb-2>
      Invalid VAT Number.
    </n-alert>

    <c-card v-if="vatInfos.infos.length > 0" title="VAT Number Infos">
      <c-key-value-list :items="vatInfos.infos" data-test-id="vat-info" />
    </c-card>
  </div>
</template>
