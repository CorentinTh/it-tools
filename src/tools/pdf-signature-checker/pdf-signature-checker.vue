<script setup lang="ts">
import verifyPDF from 'pdf-signature-reader';
import type { SignatureInfo } from './pdf-signature-checker.types';
import { formatBytes } from '@/utils/convert';

const signatures = ref<SignatureInfo[]>([]);
const status = ref<'idle' | 'parsed' | 'error' | 'loading'>('idle');
const file = ref<File | null>(null);

const { t } = useI18n();

async function onVerifyClicked(uploadedFile: File) {
  file.value = uploadedFile;
  const fileBuffer = await uploadedFile.arrayBuffer();

  status.value = 'loading';
  try {
    const { signatures: parsedSignatures } = verifyPDF(fileBuffer);
    signatures.value = parsedSignatures;
    status.value = 'parsed';
  }
  catch (e) {
    signatures.value = [];
    status.value = 'error';
  }
}
</script>

<template>
  <div style="flex: 0 0 100%">
    <div mx-auto max-w-600px>
      <c-file-upload :title="t('tools.pdf-signature-checker.upload.tip')" accept=".pdf" @file-upload="onVerifyClicked" />

      <c-card v-if="file" mt-4 flex gap-2>
        <div font-bold>
          {{ file.name }}
        </div>

        <div>
          {{ formatBytes(file.size) }}
        </div>
      </c-card>

      <div v-if="status === 'error'">
        <c-alert mt-4>
          {{ t('tools.pdf-signature-checker.upload.error') }}
        </c-alert>
      </div>
    </div>
  </div>

  <div v-if="status === 'parsed' && signatures.length" style="flex: 0 0 100%" mt-5 flex flex-col gap-4>
    <div v-for="(signature, index) of signatures" :key="index">
      <div mb-2 font-bold>
        {{ t('tools.pdf-signature-checker.upload.parsed', { index: index + 1 }) }}
      </div>

      <pdf-signature-details :signature="signature" />
    </div>
  </div>
</template>
