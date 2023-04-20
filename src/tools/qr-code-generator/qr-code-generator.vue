<template>
  <c-card>
    <n-grid x-gap="12" y-gap="12" cols="1 600:3">
      <n-gi span="2">
        <n-form label-width="130" label-placement="left">
          <n-form-item label="Text:">
            <n-input
              v-model:value="text"
              type="textarea"
              :autosize="{ minRows: 1 }"
              placeholder="Your link or text..."
            />
          </n-form-item>
          <n-form-item label="Foreground color:">
            <n-color-picker v-model:value="foreground" :modes="['hex']" />
          </n-form-item>
          <n-form-item label="Background color:">
            <n-color-picker v-model:value="background" :modes="['hex']" />
          </n-form-item>
          <n-form-item label="Error resistance:">
            <n-select
              v-model:value="errorCorrectionLevel"
              :options="errorCorrectionLevels.map((value) => ({ label: value, value }))"
            />
          </n-form-item>
        </n-form>
      </n-gi>
      <n-gi>
        <n-space justify="center" align="center" vertical>
          <n-image :src="qrcode" width="200" />
          <c-button @click="download"> Download qr-code </c-button>
        </n-space>
      </n-gi>
    </n-grid>
  </c-card>
</template>

<script setup lang="ts">
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { ref } from 'vue';
import type { QRCodeErrorCorrectionLevel } from 'qrcode';
import { useQRCode } from './useQRCode';

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
