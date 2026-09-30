<script setup lang="ts">
import { formatDistanceToNow } from 'date-fns';
import { decodeCertificatePem } from './x509-certificate-decoder.service';
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const rawCertificate = ref('');

const decoded = computed(() =>
  withDefaultOnError(() => decodeCertificatePem(rawCertificate.value), { sections: [] }),
);

const validation = useValidation({
  source: rawCertificate,
  rules: [
    {
      validator: value => value.length === 0 || isNotThrowing(() => decodeCertificatePem(value)),
      message: 'Invalid certificate (paste a PEM CERTIFICATE block)',
    },
  ],
});

const notAfterRow = computed(() =>
  decoded.value.sections
    .find(section => section.title === 'Certificate')
    ?.rows.find(row => row.label === 'Not after'),
);

const expiryRelative = computed(() => {
  const raw = notAfterRow.value?.value;
  if (!raw || !validation.isValid) {
    return undefined;
  }
  const date = new Date(raw.replace(' UTC', 'Z'));
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return formatDistanceToNow(date, { addSuffix: true });
});
</script>

<template>
  <c-card>
    <c-input-text
      v-model:value="rawCertificate"
      label="Certificate (PEM)"
      :validation="validation"
      placeholder="-----BEGIN CERTIFICATE----- ... -----END CERTIFICATE-----"
      rows="8"

      raw-text autofocus multiline mb-3
    />

    <n-alert v-if="rawCertificate.length > 0 && !validation.isValid" type="error" mb-3>
      Paste a PEM certificate (-----BEGIN CERTIFICATE-----), not a private key or CSR.
    </n-alert>

    <template v-if="validation.isValid && rawCertificate.length > 0">
      <n-alert v-if="expiryRelative" type="info" mb-3>
        Expires {{ expiryRelative }}
      </n-alert>

      <n-table>
        <tbody>
          <template v-for="section of decoded.sections" :key="section.title">
            <th colspan="2" class="table-header">
              {{ section.title }}
            </th>
            <tr v-for="row of section.rows" :key="section.title + row.label + row.value">
              <td class="claims" style="vertical-align: top;">
                <span font-bold>{{ row.label }}</span>
                <span v-if="row.hint" ml-2 text-xs op-60>{{ row.hint }}</span>
              </td>
              <td style="word-wrap: break-word; word-break: break-all;">
                {{ row.value }}
              </td>
            </tr>
          </template>
        </tbody>
      </n-table>
    </template>
  </c-card>
</template>

<style scoped lang="less">
.table-header {
  font-weight: bold;
  text-align: left;
}
.claims {
  width: 260px;
}
</style>
