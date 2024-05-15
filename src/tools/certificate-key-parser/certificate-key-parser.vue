<script setup lang="ts">
import { Buffer } from 'node:buffer';

import { getKeyOrCertificateInfosAsync } from './certificate-key-parser.service';
import { type LabelValue } from './certificate-key-parser.infos';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';

const inputKeyOrCertificate = ref('');
const passphrase = ref('');
const fileInput = ref() as Ref<Buffer>;

async function onUpload(file: File) {
  if (file) {
    fileInput.value = Buffer.from(await file.arrayBuffer());
    inputKeyOrCertificate.value = '';
  }
}

const certificateX509DER = ref('');
const { download: downloadX509DER } = useDownloadFileFromBase64(
  {
    source: certificateX509DER,
    extension: 'der',
  });

function downloadX509DERFile() {
  if (certificateX509DER.value === '') {
    return;
  }

  try {
    downloadX509DER();
  }
  catch (_) {
    //
  }
}

const parsedSections = computedAsync<LabelValue[]>(async () => {
  const inputKeyOrCertificateValue
      = inputKeyOrCertificate.value !== ''
        ? inputKeyOrCertificate.value
        : fileInput.value;

  const { values, certificateX509DER: certPEM } = await getKeyOrCertificateInfosAsync(inputKeyOrCertificateValue, passphrase.value);
  certificateX509DER.value = certPEM || '';
  return values;
});
</script>

<template>
  <div>
    <c-card>
      <c-file-upload title="Drag and drop a Certificate file here, or click to select a Certificate file" @file-upload="onUpload" />
      <!-- separator -->
      <div my-4 w-full flex items-center justify-center op-70>
        <div class="h-1px max-w-100px flex-1 bg-gray-300 op-50" />
        <div class="mx-2 text-gray-400">
          or
        </div>
        <div class="h-1px max-w-100px flex-1 bg-gray-300 op-50" />
      </div>
      <c-input-text
        v-model:value="inputKeyOrCertificate"
        label="Paste your Public Key / Private Key / Signature / Fingerprint / Certificate:"
        placeholder="Your Public Key / Private Key / Signature / Fingerprint / Certificate..."
        multiline
        rows="8"
        data-test-id="input"
      />
    </c-card>

    <c-input-text
      v-model:value="passphrase"
      label="Passphrase (for encrypted keys):"
      placeholder="Passphrase (for encrypted keys)..."
      type="password"
      data-test-id="pass"
    />

    <n-divider />

    <input-copyable
      v-for="{ label, value, multiline } of parsedSections"
      :key="label"
      :label="label"
      :data-test-id="label"
      label-position="left"
      label-width="100px"
      label-align="right"

      autosize mb-2
      :multiline="multiline"
      :value="value"
      placeholder="Not Set"
    />

    <div v-if="certificateX509DER !== ''" flex justify-center>
      <c-button @click="downloadX509DERFile()">
        Download X509 DER certificate
      </c-button>
    </div>
  </div>
</template>
