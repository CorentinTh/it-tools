<script setup lang="ts">
import { ref, watch } from 'vue';
import { random } from '@/utils/random';

const countries = [
  { code: 'AL', name: 'Albania', bankCodeLength: 8, accountNumberLength: 16, prefix: '' },
  { code: 'AD', name: 'Andorra', bankCodeLength: 4, accountNumberLength: 12, prefix: '' },
  { code: 'AT', name: 'Austria', bankCodeLength: 5, accountNumberLength: 11, prefix: '' },
  { code: 'AZ', name: 'Azerbaijan', bankCodeLength: 4, accountNumberLength: 20, prefix: '' },
  { code: 'BH', name: 'Bahrain', bankCodeLength: 4, accountNumberLength: 14, prefix: '' },
  { code: 'BE', name: 'Belgium', bankCodeLength: 3, accountNumberLength: 9, prefix: '' },
  { code: 'BA', name: 'Bosnia and Herzegovina', bankCodeLength: 3, accountNumberLength: 13, prefix: '' },
  { code: 'BR', name: 'Brazil', bankCodeLength: 8, accountNumberLength: 13, prefix: '' },
  { code: 'BG', name: 'Bulgaria', bankCodeLength: 4, accountNumberLength: 10, prefix: '' },
  { code: 'CR', name: 'Costa Rica', bankCodeLength: 3, accountNumberLength: 14, prefix: '' },
  { code: 'HR', name: 'Croatia', bankCodeLength: 7, accountNumberLength: 10, prefix: '' },
  { code: 'CY', name: 'Cyprus', bankCodeLength: 3, accountNumberLength: 16, prefix: '' },
  { code: 'CZ', name: 'Czech Republic', bankCodeLength: 4, accountNumberLength: 16, prefix: '' },
  { code: 'DK', name: 'Denmark', bankCodeLength: 4, accountNumberLength: 10, prefix: '' },
  { code: 'DO', name: 'Dominican Republic', bankCodeLength: 4, accountNumberLength: 20, prefix: '' },
  { code: 'EE', name: 'Estonia', bankCodeLength: 2, accountNumberLength: 16, prefix: '' },
  { code: 'FO', name: 'Faroe Islands', bankCodeLength: 4, accountNumberLength: 9, prefix: '' },
  { code: 'FI', name: 'Finland', bankCodeLength: 6, accountNumberLength: 7, prefix: '' },
  { code: 'FR', name: 'France', bankCodeLength: 5, accountNumberLength: 11, prefix: '' },
  { code: 'GE', name: 'Georgia', bankCodeLength: 2, accountNumberLength: 16, prefix: '' },
  { code: 'DE', name: 'Germany', bankCodeLength: 8, accountNumberLength: 10, prefix: '' },
  { code: 'GI', name: 'Gibraltar', bankCodeLength: 4, accountNumberLength: 15, prefix: '' },
  { code: 'GR', name: 'Greece', bankCodeLength: 3, accountNumberLength: 16, prefix: '' },
  { code: 'GL', name: 'Greenland', bankCodeLength: 4, accountNumberLength: 9, prefix: '' },
  { code: 'GT', name: 'Guatemala', bankCodeLength: 4, accountNumberLength: 20, prefix: '' },
  { code: 'HU', name: 'Hungary', bankCodeLength: 3, accountNumberLength: 17, prefix: '' },
  { code: 'IS', name: 'Iceland', bankCodeLength: 4, accountNumberLength: 18, prefix: '' },
  { code: 'IE', name: 'Ireland', bankCodeLength: 4, accountNumberLength: 10, prefix: '' },
  { code: 'IL', name: 'Israel', bankCodeLength: 3, accountNumberLength: 19, prefix: '' },
  { code: 'IT', name: 'Italy', bankCodeLength: 5, accountNumberLength: 12, prefix: '' },
  { code: 'JO', name: 'Jordan', bankCodeLength: 4, accountNumberLength: 18, prefix: '' },
  { code: 'KZ', name: 'Kazakhstan', bankCodeLength: 3, accountNumberLength: 13, prefix: '' },
  { code: 'XK', name: 'Kosovo', bankCodeLength: 4, accountNumberLength: 12, prefix: '' },
  { code: 'KW', name: 'Kuwait', bankCodeLength: 4, accountNumberLength: 22, prefix: '' },
  { code: 'LV', name: 'Latvia', bankCodeLength: 4, accountNumberLength: 13, prefix: '' },
  { code: 'LB', name: 'Lebanon', bankCodeLength: 4, accountNumberLength: 20, prefix: '' },
  { code: 'LI', name: 'Liechtenstein', bankCodeLength: 5, accountNumberLength: 12, prefix: '' },
  { code: 'LT', name: 'Lithuania', bankCodeLength: 5, accountNumberLength: 11, prefix: '' },
  { code: 'LU', name: 'Luxembourg', bankCodeLength: 3, accountNumberLength: 13, prefix: '' },
  { code: 'MK', name: 'North Macedonia', bankCodeLength: 3, accountNumberLength: 10, prefix: '' },
  { code: 'MT', name: 'Malta', bankCodeLength: 4, accountNumberLength: 18, prefix: '' },
  { code: 'MR', name: 'Mauritania', bankCodeLength: 5, accountNumberLength: 15, prefix: '' },
  { code: 'MU', name: 'Mauritius', bankCodeLength: 6, accountNumberLength: 19, prefix: '' },
  { code: 'MC', name: 'Monaco', bankCodeLength: 5, accountNumberLength: 11, prefix: '' },
  { code: 'MD', name: 'Moldova', bankCodeLength: 2, accountNumberLength: 18, prefix: '' },
  { code: 'ME', name: 'Montenegro', bankCodeLength: 3, accountNumberLength: 13, prefix: '' },
  { code: 'NL', name: 'Netherlands', bankCodeLength: 4, accountNumberLength: 10, prefix: '' },
  { code: 'NO', name: 'Norway', bankCodeLength: 4, accountNumberLength: 7, prefix: '' },
  { code: 'PK', name: 'Pakistan', bankCodeLength: 4, accountNumberLength: 16, prefix: '' },
  { code: 'PS', name: 'Palestine', bankCodeLength: 4, accountNumberLength: 21, prefix: '' },
  { code: 'PL', name: 'Poland', bankCodeLength: 8, accountNumberLength: 16, prefix: '' },
  { code: 'PT', name: 'Portugal', bankCodeLength: 4, accountNumberLength: 15, prefix: '' },
  { code: 'QA', name: 'Qatar', bankCodeLength: 4, accountNumberLength: 21, prefix: '' },
  { code: 'RO', name: 'Romania', bankCodeLength: 4, accountNumberLength: 16, prefix: '' },
  { code: 'LC', name: 'Saint Lucia', bankCodeLength: 4, accountNumberLength: 24, prefix: '' },
  { code: 'SM', name: 'San Marino', bankCodeLength: 5, accountNumberLength: 12, prefix: '' },
  { code: 'ST', name: 'São Tomé and Príncipe', bankCodeLength: 8, accountNumberLength: 16, prefix: '' },
  { code: 'SA', name: 'Saudi Arabia', bankCodeLength: 2, accountNumberLength: 18, prefix: '' },
  { code: 'RS', name: 'Serbia', bankCodeLength: 3, accountNumberLength: 15, prefix: '' },
  { code: 'SC', name: 'Seychelles', bankCodeLength: 4, accountNumberLength: 16, prefix: '' },
  { code: 'SK', name: 'Slovakia', bankCodeLength: 4, accountNumberLength: 16, prefix: '' },
  { code: 'SI', name: 'Slovenia', bankCodeLength: 5, accountNumberLength: 8, prefix: '' },
  { code: 'ES', name: 'Spain', bankCodeLength: 8, accountNumberLength: 12, prefix: '' },
  { code: 'SE', name: 'Sweden', bankCodeLength: 3, accountNumberLength: 17, prefix: '' },
  { code: 'CH', name: 'Switzerland', bankCodeLength: 5, accountNumberLength: 12, prefix: '' },
  { code: 'TL', name: 'Timor-Leste', bankCodeLength: 3, accountNumberLength: 14, prefix: '' },
  { code: 'TN', name: 'Tunisia', bankCodeLength: 5, accountNumberLength: 15, prefix: '' },
  { code: 'TR', name: 'Turkey', bankCodeLength: 5, accountNumberLength: 16, prefix: '' },
  { code: 'UA', name: 'Ukraine', bankCodeLength: 6, accountNumberLength: 19, prefix: '' },
  { code: 'AE', name: 'United Arab Emirates', bankCodeLength: 3, accountNumberLength: 16, prefix: '' },
  { code: 'GB', name: 'United Kingdom', bankCodeLength: 4, accountNumberLength: 14, prefix: '' },
  { code: 'VG', name: 'British Virgin Islands', bankCodeLength: 4, accountNumberLength: 16, prefix: '' },
];

const selectedCountry = ref('DE');
const bankCode = ref('');
const accountNumber = ref('');
const iban = ref('');
const error = ref('');

function padLeft(str: string, length: number, char = '0') {
  return str.padStart(length, char);
}

function randomDigits(length: number) {
  let digits = '';
  for (let i = 0; i < length; i++) {
    digits += Math.floor(random() * 10).toString();
  }
  return digits;
}

function regenerate() {
  const country = countries.find(c => c.code === selectedCountry.value);
  if (!country) {
    return;
  }
  bankCode.value = randomDigits(country.bankCodeLength);
  accountNumber.value = randomDigits(country.accountNumberLength);
  iban.value = '';
  error.value = '';
}

function generateIban() {
  error.value = '';
  const country = countries.find(c => c.code === selectedCountry.value);
  if (!country) {
    return;
  }
  regenerate();

  const bCode = padLeft(bankCode.value, country.bankCodeLength);
  const aNum = padLeft(accountNumber.value, country.accountNumberLength);
  const bban = country.prefix + bCode + aNum;
  const check = calculateCheckDigits(country.code, bban);
  iban.value = `${country.code}${check}${bban}`;
}

function calculateCheckDigits(countryCode: string, bban: string) {
  // IBAN check digits according to ISO 7064
  let replaced = `${bban + countryCode}00`;
  replaced = replaced.replace(/[A-Z]/g, c => (c.codePointAt(0)! - 55).toString());

  const remainder = BigInt(replaced) % 97n;
  const check = 98n - remainder;
  return check.toString().padStart(2, '0');
}

// Generate Intial IBAN and listen for country changes
generateIban();

watch(selectedCountry, () => {
  generateIban();
});
</script>

<template>
  <div>
    <div mb-3 flex items-center>
      <span w-100px>Country </span>
      <c-select
        v-model:value="selectedCountry"
        searchable
        flex-1
        :options="countries.map(({ name, code }) => ({ label: name, value: code }))"
        data-test-id="iban-generator-country-select"
      />
    </div>

    <c-card
      align-center
      mb-3
      flex
      justify-center
    >
      <c-text-copyable
        style="text-align: center;font-family: monospace"
        :value="iban"
        placeholder="Your IBAN"
      />
    </c-card>

    <div flex justify-center gap-3>
      <c-button @click="generateIban">
        Refresh
      </c-button>
    </div>
  </div>
</template>

<style scoped lang="less">
::v-deep(.iban-display) {
  textarea {
    text-align: center;
    align-items: center;
    align-content: center;
    align-self: center;
  }
}
</style>
