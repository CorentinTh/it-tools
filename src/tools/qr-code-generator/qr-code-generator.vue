<script setup lang="ts">
import type { QRCodeErrorCorrectionLevel } from 'qrcode';
import { useQRCode } from './useQRCode';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';

const { t } = useI18n();
const foreground = ref('#000000ff');
const background = ref('#ffffffff');
const errorCorrectionLevel = ref<QRCodeErrorCorrectionLevel>(t('tools.qrcode-generator.medium') as 'medium');

const errorCorrectionLevels = [t('tools.qrcode-generator.low'), t('tools.qrcode-generator.medium'), t('tools.qrcode-generator.quartile'), t('tools.qrcode-generator.high')];

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
  <c-card>
    <n-grid x-gap="12" y-gap="12" cols="1 600:3">
      <n-gi span="2">
        <c-input-text
          v-model:value="text"
          label-position="left"
          label-width="130px"
          label-align="right"
          :label="t('tools.qrcode-generator.textLabel')"
          multiline
          rows="1"
          autosize
          :placeholder="t('tools.qrcode-generator.textPlaceholder')"
          mb-6
        />
        <n-form label-width="130" label-placement="left">
          <n-form-item :label="t('tools.qrcode-generator.foreground')">
            <n-color-picker v-model:value="foreground" :modes="['hex']" />
          </n-form-item>
          <n-form-item :label="t('tools.qrcode-generator.background')">
            <n-color-picker v-model:value="background" :modes="['hex']" />
          </n-form-item>
          <c-select
            v-model:value="errorCorrectionLevel"
            :label="t('tools.qrcode-generator.errorCorrectionLevels')"
            label-position="left"
            label-width="130px"
            label-align="right"
            :options="errorCorrectionLevels.map((value) => ({ label: value, value }))"
          />
        </n-form>
      </n-gi>
      <n-gi>
        <div flex flex-col items-center gap-3>
          <n-image :src="qrcode" width="200" />
          <c-button @click="download">
            {{ t('tools.qrcode-generator.downloadBtn') }}
          </c-button>
        </div>
      </n-gi>
    </n-grid>
  </c-card>
</template>
