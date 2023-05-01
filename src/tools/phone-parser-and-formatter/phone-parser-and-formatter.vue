<template>
  <div>
    <n-form-item label="Default country code:">
      <n-select v-model:value="defaultCountryCode" :options="countriesOptions" />
    </n-form-item>
    <n-form-item label="Phone number:" v-bind="validation.attrs">
      <n-input v-model:value="rawPhone" placeholder="Enter a phone number" />
    </n-form-item>

    <n-table v-if="parsedDetails">
      <tbody>
        <tr v-for="{ label, value } in parsedDetails" :key="label">
          <td>
            <n-text strong>{{ label }}</n-text>
          </td>
          <td>
            <span-copyable v-if="value" :value="value"></span-copyable>
            <n-text v-else depth="3" italic>Unknown</n-text>
          </td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>

<script setup lang="ts">
import { withDefaultOnError } from '@/utils/defaults';
import { parsePhoneNumber, getCountries, getCountryCallingCode } from 'libphonenumber-js/max';
import { booleanToHumanReadable } from '@/utils/boolean';
import { useValidation } from '@/composable/validation';
import lookup from 'country-code-lookup';
import {
  formatTypeToHumanReadable,
  getFullCountryName,
  getDefaultCountryCode,
} from './phone-parser-and-formatter.models';

const rawPhone = ref('');
const defaultCountryCode = ref(getDefaultCountryCode());
const validation = useValidation({
  source: rawPhone,
  rules: [
    {
      validator: (value) => value === '' || /^[0-9 +\-()]+$/.test(value),
      message: 'Invalid phone number',
    },
  ],
});

const parsedDetails = computed(() => {
  if (!validation.isValid) return undefined;

  const parsed = withDefaultOnError(() => parsePhoneNumber(rawPhone.value, 'FR'), undefined);

  if (!parsed) return undefined;

  return [
    {
      label: 'Country',
      value: parsed.country,
    },
    {
      label: 'Country',
      value: getFullCountryName(parsed.country),
    },
    {
      label: 'Country calling code',
      value: parsed.countryCallingCode,
    },
    {
      label: 'Is valid?',
      value: booleanToHumanReadable(parsed.isValid()),
    },
    {
      label: 'Is possible?',
      value: booleanToHumanReadable(parsed.isPossible()),
    },
    {
      label: 'Type',
      value: formatTypeToHumanReadable(parsed.getType()),
    },
    {
      label: 'International format',
      value: parsed.formatInternational(),
    },
    {
      label: 'National format',
      value: parsed.formatNational(),
    },
    {
      label: 'E.164 format',
      value: parsed.format('E.164'),
    },
    {
      label: 'RFC3966 format',
      value: parsed.format('RFC3966'),
    },
  ];
});

const countriesOptions = getCountries().map((code) => ({
  label: `${lookup.byIso(code)?.country || code} (+${getCountryCallingCode(code)})`,
  value: code,
}));
</script>

<style lang="less" scoped></style>
