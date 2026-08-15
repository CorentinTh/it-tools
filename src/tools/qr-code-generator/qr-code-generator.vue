<script setup lang="ts">
import type { QRCodeErrorCorrectionLevel } from 'qrcode';
import { useQRCode } from './useQRCode';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import CColorPicker from '@/ui/c-color-picker/c-color-picker.vue';

const foreground = ref('#000000ff');
const background = ref('#ffffffff');
const errorCorrectionLevel = ref<QRCodeErrorCorrectionLevel>('medium');

const errorCorrectionLevels = ['low', 'medium', 'quartile', 'high'];

const text = ref('https://it-tools.tech');
const { error, isGenerating, qrcode, status } = useQRCode({
  text,
  color: {
    background,
    foreground,
  },
  errorCorrectionLevel,
  options: { width: 1024 },
});

const statusMessage = computed(() => {
  if (error.value) {
    return error.value;
  }
  if (isGenerating.value) {
    return qrcode.value
      ? 'Updating the QR code. The previous preview remains visible.'
      : 'Generating the QR code…';
  }
  return status.value === 'ready'
    ? 'QR code ready.'
    : 'Enter text to generate a QR code.';
});

const { download } = useDownloadFileFromBase64({ source: qrcode, filename: 'qr-code.png' });
</script>

<template>
  <div class="c-generator-layout">
    <c-card class="c-generator-options" title="Options">
      <div grid grid-cols-1 gap-3>
        <c-input-text
          v-model:value="text"
          label="Text"
          multiline
          rows="4"
          placeholder="Your link or text..."
        />

        <div grid grid-cols-1 gap-3 md:grid-cols-2>
          <c-field label="Foreground color">
            <CColorPicker v-model:value="foreground" aria-label="Foreground color" :modes="['hex']" />
          </c-field>
          <c-field label="Background color">
            <CColorPicker v-model:value="background" aria-label="Background color" :modes="['hex']" />
          </c-field>
        </div>

        <c-select
          v-model:value="errorCorrectionLevel"
          label="Error resistance"
          :options="errorCorrectionLevels.map((value) => ({ label: value, value }))"
        />
      </div>
    </c-card>

    <c-card class="c-generator-output" title="Generated QR code">
      <div flex flex-col items-center gap-3>
        <p
          class="c-task-status"
          data-test-id="qrcode-status"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {{ statusMessage }}
        </p>
        <img v-if="qrcode" :src="qrcode" alt="Generated QR code" width="240">
        <div class="c-generator-actions">
          <c-button data-test-id="qrcode-download" :disabled="!qrcode || isGenerating" @click="download">
            Download QR code
          </c-button>
        </div>
      </div>
    </c-card>
  </div>
</template>
