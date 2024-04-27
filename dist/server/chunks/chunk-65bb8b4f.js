import { u as useValidation } from './chunk-35c3d701.js';

const macAddressValidationRules = [
  {
    message: "Invalid MAC address",
    validator: (value) => value.trim().match(/^([0-9A-Fa-f]{2}[:-]){2,5}([0-9A-Fa-f]{2})$/)
  }
];
function macAddressValidation(value) {
  return useValidation({
    source: value,
    rules: macAddressValidationRules
  });
}
const partialMacAddressValidationRules = [
  {
    message: "Invalid partial MAC address",
    validator: (value) => value.trim().match(/^([0-9a-f]{2}[:\-. ]){0,5}([0-9a-f]{0,2})$/i)
  }
];
function usePartialMacAddressValidation(value) {
  return useValidation({
    source: value,
    rules: partialMacAddressValidationRules
  });
}

export { macAddressValidationRules as a, macAddressValidation as m, usePartialMacAddressValidation as u };
