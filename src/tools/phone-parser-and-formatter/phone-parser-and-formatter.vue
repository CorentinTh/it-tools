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
import { useQueryParamOrStorage } from '@/composable/queryParams';

const rawPhone = ref('');
const defaultCountryCode = useQueryParamOrStorage({ name: 'country', storageName: 'phone-parser:country', defaultValue: getDefaultCountryCode() });
const validation = useValidation({
  source: rawPhone,
  rules: [
    {
      validator: value => value === '' || /^[0-9 +\-()]+$/.test(value),
      message: 'Invalid phone number',
    },
  ],
});

const parsedRaw = computed(() => {
  if (!validation.isValid) {
    return undefined;
  }

  return withDefaultOnError(() => parsePhoneNumber(rawPhone.value, defaultCountryCode.value), undefined);
});

const parsedDetails = computed(() => {
  const parsed = parsedRaw.value;
  if (!parsed) {
    return undefined;
  }

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

const countriesOptions = getCountries().map(code => ({
  label: `${lookup.byIso(code)?.country || code} (+${getCountryCallingCode(code)})`,
  value: code,
}));

const messageToSend = ref('');
const whatsAppLink = computed(() => {
  const parsed = parsedRaw.value;
  if (!parsed) {
    return undefined;
  }

  const internationalNoPunts = parsed.formatInternational().replace(/^\+0*/g, '').replace(/\D/g, '');

  return `https://wa.me/${internationalNoPunts}?text=${encodeURIComponent(messageToSend.value)}`;
});
const smsLink = computed(() => {
  const parsed = parsedRaw.value;
  if (!parsed) {
    return undefined;
  }

  const internationalNoSpaces = parsed.formatInternational().replace(/\s/g, '');
  return `sms:${internationalNoSpaces}&body=${encodeURIComponent(messageToSend.value)}`;
});
</script>

<template>
  <div>
    <c-select v-model:value="defaultCountryCode" label="Default country code:" :options="countriesOptions" searchable mb-5 />

    <c-input-text
      v-model:value="rawPhone"
      placeholder="Enter a phone number"
      label="Phone number:"
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
              Unknown
            </span>
          </td>
        </tr>
      </tbody>
    </n-table>

    <n-divider />

    <c-input-text
      v-model:value="messageToSend"
      multiline
      rows="4"
      placeholder="Enter a message to send"
      label="Message to send:"
      mb-2
    />

    <c-card v-if="whatsAppLink" title="WhatsApp Send link" mb-2>
      <input-copyable :value="whatsAppLink" mb-2 />
      <div flex justify-center>
        <!-- //NOSONAR --><c-button :href="whatsAppLink" target="_blank">
          Send via WhatsApp
        </c-button>
      </div>
    </c-card>

    <c-card v-if="smsLink" title="SMS Send link">
      <input-copyable :value="smsLink" mb-2 />
      <div flex justify-center>
        <!-- //NOSONAR --><c-button :href="smsLink" target="_blank">
          Send via SMS
        </c-button>
      </div>
    </c-card>
  </div>
</template>
