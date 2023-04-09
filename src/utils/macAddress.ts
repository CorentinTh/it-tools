import { useValidation } from '@/composable/validation';
import type { Ref } from 'vue';

function macAddressValidation(value: Ref) {
  return useValidation({
    source: value,
    rules: [
      {
        message: 'Invalid MAC address',
        validator: (value) => value.trim().match(/^([0-9A-Fa-f]{2}[:-]){2,5}([0-9A-Fa-f]{2})$/),
      },
    ],
  });
}

export { macAddressValidation };
