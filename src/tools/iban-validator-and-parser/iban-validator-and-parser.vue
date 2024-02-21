<script setup lang="ts">
import { extractIBAN, friendlyFormatIBAN, isQRIBAN, validateIBAN } from 'ibantools';
import { getFriendlyErrors } from './iban-validator-and-parser.service';
import type { CKeyValueListItems } from '@/ui/c-key-value-list/c-key-value-list.types';

const { t } = useI18n();
const rawIban = ref('');

const ibanInfo = computed<CKeyValueListItems>(() => {
  const iban = rawIban.value.toUpperCase().replace(/\s/g, '').replace(/-/g, '');

  if (iban === '') {
    return [];
  }

  const { valid: isIbanValid, errorCodes } = validateIBAN(iban);
  const { countryCode, bban } = extractIBAN(iban);
  const errors = getFriendlyErrors(errorCodes);

  return [

    {
      label: t('tools.iban-validator-and-parser.isIbanValid'),
      value: isIbanValid,
      showCopyButton: false,
    },
    {
      label: t('tools.iban-validator-and-parser.IBANErrors'),
      value: errors.length === 0 ? undefined : errors,
      hideOnNil: true,
      showCopyButton: false,
    },
    {
      label: t('tools.iban-validator-and-parser.isQRIBAN'),
      value: isQRIBAN(iban),
      showCopyButton: false,
    },
    {
      label: t('tools.iban-validator-and-parser.countryCode'),
      value: countryCode,
    },
    {
      label: t('tools.iban-validator-and-parser.BBAN'),
      value: bban,
    },
    {
      label: t('tools.iban-validator-and-parser.IBANFriendlyFormat'),
      value: friendlyFormatIBAN(iban),
    },
  ];
});

const ibanExamples = [
  'FR7630006000011234567890189',
  'DE89370400440532013000',
  'GB29NWBK60161331926819',
];
</script>

<template>
  <div>
    <c-input-text v-model:value="rawIban" :placeholder="t('tools.iban-validator-and-parser.inputPlaceholder')" test-id="iban-input" />

    <c-card v-if="ibanInfo.length > 0" mt-5>
      <c-key-value-list :items="ibanInfo" data-test-id="iban-info" />
    </c-card>

    <c-card :title="t('tools.iban-validator-and-parser.ibanExamples')" mt-5>
      <div v-for="iban in ibanExamples" :key="iban">
        <c-text-copyable :value="iban" font-mono :displayed-value="friendlyFormatIBAN(iban)" />
      </div>
    </c-card>
  </div>
</template>
