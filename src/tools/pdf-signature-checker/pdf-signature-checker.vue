<script setup lang="ts">
import verifyPDF from 'pdf-signature-reader';
import type { SignatureInfo } from './pdf-signature-checker.types';
import { formatBytes } from '@/utils/convert';

const signatures = ref<SignatureInfo[]>([]);
const status = ref<'idle' | 'parsed' | 'error' | 'loading'>('idle');
const file = ref<File | null>(null);

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
  <div class="c-task-layout">
    <c-card title="Local PDF">
      <c-file-upload title="Drag and drop a PDF file here, or click to select a file" accept=".pdf" @file-upload="onVerifyClicked" />

      <div v-if="file" mt-4 flex flex-wrap gap-2>
        <div font-bold>
          {{ file.name }}
        </div>

        <div>
          {{ formatBytes(file.size) }}
        </div>
      </div>

      <p v-if="status === 'loading'" class="c-task-status mt-4" role="status" aria-live="polite">
        Checking PDF signatures…
      </p>
      <c-alert v-else-if="status === 'error'" mt-4>
        No signatures found in the provided file.
      </c-alert>
    </c-card>

    <div v-if="status === 'parsed' && signatures.length" class="c-task-results c-form-layout">
      <c-card v-for="(signature, index) of signatures" :key="index" :title="`Signature ${index + 1} certificates`">
        <pdf-signature-details :signature="signature" />
      </c-card>
    </div>
  </div>
</template>
