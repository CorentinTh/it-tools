<script setup lang="ts">
import { computed, ref } from 'vue';
import { decodeCert } from './x509-certificate-decoder.service';
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const rawCert = ref('-----BEGIN CERTIFICATE-----\\nMIICyTCCAjICAQAwTjELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWEx\\nEzARBgNVBAcMClNhbnRhIENsYXJhMQ8wDQYDVQQKDAZleGFtcGxlMA0GCSqGSIb3\\nDQEBAQUAA4IBADANBgkqhkiG9w0BAQEFAASCAQAwggEAAoIBAQDN...\\n-----END CERTIFICATE-----');

const decodedCert = computed(() =>
  withDefaultOnError(() => decodeCert(rawCert.value.trim()), null),
);

const validation = useValidation({
  source: rawCert,
  rules: [
    {
      validator: value => value.trim().length > 0 && isNotThrowing(() => decodeCert(value.trim())),
      message: 'Invalid PEM Certificate',
    },
  ],
});
</script>

<template>
  <c-card>
    <c-input-text v-model:value="rawCert" label="PEM Certificate" :validation="validation" placeholder="-----BEGIN CERTIFICATE-----..." rows="10" multiline raw-text autofocus mb-3 />

    <n-table v-if="validation.isValid && decodedCert">
      <tbody>
        <th colspan="2" class="table-header">
          Certificate Details
        </th>
        <tr>
          <td class="claims">
            <strong>Subject</strong>
          </td>
          <td class="value">
            {{ decodedCert.subject }}
          </td>
        </tr>
        <tr>
          <td class="claims">
            <strong>Issuer</strong>
          </td>
          <td class="value">
            {{ decodedCert.issuer }}
          </td>
        </tr>
        <tr>
          <td class="claims">
            <strong>Valid From</strong>
          </td>
          <td class="value">
            {{ new Date(decodedCert.validFrom).toLocaleString() }}
          </td>
        </tr>
        <tr>
          <td class="claims">
            <strong>Valid To</strong>
          </td>
          <td class="value">
            {{ new Date(decodedCert.validTo).toLocaleString() }}
          </td>
        </tr>
        <tr>
          <td class="claims">
            <strong>Serial Number</strong>
          </td>
          <td class="value">
            {{ decodedCert.serialNumber }}
          </td>
        </tr>
        <tr>
          <td class="claims">
            <strong>SHA-1 Fingerprint</strong>
          </td>
          <td class="value">
            {{ decodedCert.fingerprint }}
          </td>
        </tr>
        <tr v-if="decodedCert.sans">
          <td class="claims">
            <strong>Subject Alternative Names</strong>
          </td>
          <td class="value">
            {{ decodedCert.sans }}
          </td>
        </tr>
      </tbody>
    </n-table>
  </c-card>
</template>

<style lang="less" scoped>
.table-header {
  text-align: center;
}
.claims {
  vertical-align: top;
  width: 250px;
}
.value {
  word-wrap: break-word;
  word-break: break-all;
}
</style>
