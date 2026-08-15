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
const { qrcode } = useQRCode({
  text,
  color: {
    background,
    foreground,
  },
  errorCorrectionLevel,
  options: { width: 1024 },
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
        <img :src="qrcode" alt="Generated QR code" width="240">
        <div class="c-generator-actions">
          <c-button @click="download">
            Download QR code
          </c-button>
        </div>
      </div>
    </c-card>
  </div>
</template>
