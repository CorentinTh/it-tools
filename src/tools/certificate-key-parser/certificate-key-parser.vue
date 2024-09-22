<script setup lang="ts">
import { Buffer } from 'node:buffer';

import { getKeyOrCertificateInfosAsync } from './certificate-key-parser.service';
import { type LabelValue } from './certificate-key-parser.infos';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';

const inputKeyOrCertificate = ref('');
const passphrase = ref('');
const fileInput = ref() as Ref<Buffer>;
const inputType = ref<'file' | 'content'>('file');

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
  const inputContent = inputKeyOrCertificate.value;
  const file = fileInput.value;
  let inputKeyOrCertificateValue: string | Buffer = '';
  if (inputType.value === 'file' && file) {
    inputKeyOrCertificateValue = file;
  }
  else if (inputType.value === 'content' && inputContent) {
    inputKeyOrCertificateValue = inputContent;
  }
  const { values, certificateX509DER: certPEM } = await getKeyOrCertificateInfosAsync(inputKeyOrCertificateValue, passphrase.value);
  certificateX509DER.value = certPEM || '';
  return values;
});
</script>

<template>
  <div>
    <c-card>
      <n-radio-group v-model:value="inputType" name="radiogroup" mb-2 flex justify-center>
        <n-space>
          <n-radio
            value="file"
            label="File"
          />
          <n-radio
            value="content"
            label="Content"
          />
        </n-space>
      </n-radio-group>

      <c-file-upload
        v-if="inputType === 'file'"
        title="Drag and drop a Certificate file here, or click to select a Certificate file"
        @file-upload="onUpload"
      />

      <c-input-text
        v-if="inputType === 'content'"
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
