<script setup lang="ts">
import { Buffer } from 'node:buffer';
import { convertCertificate } from './ssl-cert-converter.service';

const inputKeyOrCertificate = ref('');
const fileInput = ref() as Ref<Buffer>;
const passphrase = ref('');
const inputType = ref<'file' | 'content'>('file');

async function onUpload(file: File) {
  if (file) {
    fileInput.value = Buffer.from(await file.arrayBuffer());
    inputKeyOrCertificate.value = '';
  }
}

function downloadFile(data: ArrayBuffer | string, fileName: string, fileType?: string) {
  const blob = new Blob(
    [typeof data === 'string' ? new TextEncoder().encode(data) : data],
    { type: fileType || 'application/octet-stream' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(downloadUrl);
}

const convertedCertificates = computed(() => {
  const inputContent = inputKeyOrCertificate.value;
  const file = fileInput.value;
  let inputKeyOrCertificateValue: string | Buffer = '';
  if (inputType.value === 'file' && file) {
    inputKeyOrCertificateValue = file;
  }
  else if (inputType.value === 'content' && inputContent) {
    inputKeyOrCertificateValue = inputContent;
  }

  return convertCertificate(inputKeyOrCertificateValue, passphrase.value);
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
        title="Drag and drop a PEM, DER, JKS or PKCS#12 file here, or click to select a file"
        @file-upload="onUpload"
      />

      <c-input-text
        v-if="inputType === 'content'"
        v-model:value="inputKeyOrCertificate"
        label="Paste your Certificate/Store:"
        placeholder="Your Certificate/Store..."
        multiline
        rows="8"
        data-test-id="input"
      />
    </c-card>

    <c-input-text
      v-model:value="passphrase"
      label="Passphrase (for encrypted certificate/store):"
      placeholder="Passphrase (for encrypted certificate/store)..."
      type="password"
      data-test-id="pass"
    />

    <n-divider />

    <c-alert v-if="!convertedCertificates">
      Please provide an input or enter the good password!
    </c-alert>

    <c-card v-for="(cert, ix) in convertedCertificates" :key="ix" :title="cert.alias">
      <n-form-item v-if="cert.key" label="Key (PEM)">
        <textarea-copyable :value="cert.key" />
      </n-form-item>
      <n-form-item v-if="cert.pem" label="Certificate (PEM)">
        <textarea-copyable :value="cert.pem" />
      </n-form-item>
      <div flex justify-center gap-1>
        <c-button v-if="cert.der" @click="downloadFile(cert.der, `${cert.alias}.der`)">
          Download DER
        </c-button>
        <c-button v-if="cert.pem" @click="downloadFile(cert.pem, `${cert.alias}.pem`)">
          Download PEM
        </c-button>
        <c-button v-if="cert.key" @click="downloadFile(cert.key, `${cert.alias}.key.pem`)">
          Download Key (PEM)
        </c-button>
      </div>
    </c-card>
  </div>
</template>
