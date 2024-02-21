<script setup lang="ts">
import { getCountries, getCountryCallingCode, parsePhoneNumber } from 'libphonenumber-js/max';
import lookup from 'country-code-lookup';
import {
  formatTypeToHumanReadable,
  getDefaultCountryCode,
  getFullCountryName,
} from './phone-parser-and-formatter.models';
import { withDefaultOnError } from '@/utils/defaults';
import { booleanToHumanReadable } from '@/utils/boolean';
import { useValidation } from '@/composable/validation';

const { t } = useI18n();
const rawPhone = ref('');
const defaultCountryCode = ref(getDefaultCountryCode());
const validation = useValidation({
  source: rawPhone,
  rules: [
    {
      validator: value => value === '' || /^[0-9 +\-()]+$/.test(value),
      message: t('tools.phone-parser-and-formatter.invalidMessage'),
    },
  ],
});

const parsedDetails = computed(() => {
  if (!validation.isValid) {
    return undefined;
  }

  const parsed = withDefaultOnError(() => parsePhoneNumber(rawPhone.value, defaultCountryCode.value), undefined);

  if (!parsed) {
    return undefined;
  }

  return [
    {
      label: t('tools.phone-parser-and-formatter.country'),
      value: parsed.country,
    },
    {
      label: t('tools.phone-parser-and-formatter.country'),
      value: getFullCountryName(parsed.country),
    },
    {
      label: t('tools.phone-parser-and-formatter.countryCallingCode'),
      value: parsed.countryCallingCode,
    },
    {
      label: t('tools.phone-parser-and-formatter.isValid'),
      value: booleanToHumanReadable(parsed.isValid()),
    },
    {
      label: t('tools.phone-parser-and-formatter.isPossible'),
      value: booleanToHumanReadable(parsed.isPossible()),
    },
    {
      label: t('tools.phone-parser-and-formatter.type'),
      value: formatTypeToHumanReadable(parsed.getType()),
    },
    {
      label: t('tools.phone-parser-and-formatter.internationalFormat'),
      value: parsed.formatInternational(),
    },
    {
      label: t('tools.phone-parser-and-formatter.nationalFormat'),
      value: parsed.formatNational(),
    },
    {
      label: t('tools.phone-parser-and-formatter.E164Format'),
      value: parsed.format('E.164'),
    },
    {
      label: t('tools.phone-parser-and-formatter.RFC3966Format'),
      value: parsed.format('RFC3966'),
    },
  ];
});

const countriesOptions = getCountries().map(code => ({
  label: `${lookup.byIso(code)?.country || code} (+${getCountryCallingCode(code)})`,
  value: code,
}));
</script>

<template>
  <div>
    <c-select v-model:value="defaultCountryCode" :label="t('tools.phone-parser-and-formatter.defaultCountryCode')" :options="countriesOptions" searchable mb-5 />

    <c-input-text
      v-model:value="rawPhone"
      :placeholder="t('tools.phone-parser-and-formatter.phoneNumberPlaceholder')"
      :label="t('tools.phone-parser-and-formatter.phoneNumberLabel')"
      :validation="validation"
      mb-5
    />

    <n-table v-if="parsedDetails">
      <tbody>
        <tr v-for="{ label, value } in parsedDetails" :key="label">
          <td font-bold>
            {{ label }}
          </td>
          <td>
            <span-copyable v-if="value" :value="value" />
            <span v-else op-70>
              {{ t('tools.phone-parser-and-formatter.unknown') }}
            </span>
          </td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>
