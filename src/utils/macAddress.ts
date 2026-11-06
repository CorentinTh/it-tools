import type { Ref } from 'vue';
import { useValidation } from '@/composable/validation';

const macAddressValidationRules = [
  {
    message: 'Invalid MAC address',
    validator: (value: string) => value.trim().match(/^([0-9A-Fa-f]{2}[:-]){2,5}([0-9A-Fa-f]{2})$/),
  },
];

function macAddressValidation(value: Ref) {
  return useValidation({
    source: value,
    rules: macAddressValidationRules,
  });
}

const partialMacAddressValidationRules = [
  {
    message: 'Invalid partial MAC address',
    validator: (value: string) => value.trim().match(/^([0-9a-f]{2}[:\-. ]){0,5}([0-9a-f]{0,2})$/i),
  },
];

function usePartialMacAddressValidation(value: Ref) {
  return useValidation({
    source: value,
    rules: partialMacAddressValidationRules,
  });
}

export { macAddressValidation, macAddressValidationRules, usePartialMacAddressValidation, partialMacAddressValidationRules };
