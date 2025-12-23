<script setup lang="ts">
import type { SignatureInfo } from '../pdf-signature-checker.types';

const props = defineProps<{ signature: SignatureInfo }>();
const { signature } = toRefs(props);

const tableHeaders = {
  validityPeriod: 'Validity period',
  issuedBy: 'Issued by',
  issuedTo: 'Issued to',
  pemCertificate: 'PEM certificate',
};

const certs = computed(() => signature.value.meta.certs.map((certificate, index) => ({
  ...certificate,
  validityPeriod: {
    notBefore: new Date(certificate.validityPeriod.notBefore).toLocaleString(),
    notAfter: new Date(certificate.validityPeriod.notAfter).toLocaleString(),
  },
  certificateName: `Certificate ${index + 1}`,
})),
);
</script>

<template>
  <div flex flex-col gap-2>
    <c-table :data="certs" :headers="tableHeaders">
      <template #validityPeriod="{ value }">        <c-key-value-list
          :items="[{
            label: 'Not before',
            value: (value as any).notBefore,
          }, {
            label: 'Not after',
            value: (value as any).notAfter,
          }]"
        />
      </template>

      <template #issuedBy="{ value }">
        <c-key-value-list
          :items="[{
            label: 'Common name',
            value: (value as any).commonName,
          }, {
            label: 'Organization name',
            value: (value as any).organizationName,
          }, {
            label: 'Country name',
            value: (value as any).countryName,
          }, {
            label: 'Locality name',
            value: (value as any).localityName,
          }, {
            label: 'Organizational unit name',
            value: (value as any).organizationalUnitName,
          }, {
            label: 'State or province name',
            value: (value as any).stateOrProvinceName,
          }]"
        />
      </template>

      <template #issuedTo="{ value }">
        <c-key-value-list
          :items="[{
            label: 'Common name',
            value: (value as any).commonName,
          }, {
            label: 'Organization name',
            value: (value as any).organizationName,
          }, {
            label: 'Country name',
            value: (value as any).countryName,
          }, {
            label: 'Locality name',
            value: (value as any).localityName,
          }, {
            label: 'Organizational unit name',
            value: (value as any).organizationalUnitName,
          }, {
            label: 'State or province name',
            value: (value as any).stateOrProvinceName,
          }]"
        />
      </template>

      <template #pemCertificate="{ value }">
        <c-modal-value :value="value as string" label="View PEM cert">
          <template #value>
            <div break-all text-xs>
              {{ value }}
            </div>
          </template>
        </c-modal-value>
      </template>
    </c-table>
  </div>
</template>
