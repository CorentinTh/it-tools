<script setup lang="ts">
import type { QRCodeErrorCorrectionLevel } from 'qrcode';
import { useQRCode } from './useQRCode';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';

const foreground = ref('#000000ff');
const background = ref('#ffffffff');
const errorCorrectionLevel = ref<QRCodeErrorCorrectionLevel>('medium');

const errorCorrectionLevels = [
  {
    label: '7%',
    value: 'low',
  },
  {
    label: '15%',
    value: 'medium',
  },
  {
    label: '25%',
    value: 'quartile',
  },
  {
    label: '30%',
    value: 'high',
  },
];

const text = ref('https://it-tools.haokudelei.com');
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
          label="内容:"
          multiline
          rows="1"
          autosize
          placeholder="链接或文字"
          mb-6
        />
        <n-form label-width="130" label-placement="left">
          <n-form-item label="前景色:">
            <n-color-picker v-model:value="foreground" :modes="['hex']" />
          </n-form-item>
          <n-form-item label="背景色:">
            <n-color-picker v-model:value="background" :modes="['hex']" />
          </n-form-item>
          <n-form-item label="容错率:">
            <n-radio-group v-model:value="errorCorrectionLevel" name="radiogroup">
              <n-space>
                <n-radio v-for="item in errorCorrectionLevels" :key="item.value" :value="item.value">
                  {{ item.label }}
                </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <!-- <c-select
            v-model:value="errorCorrectionLevel"
            label="容错率:"
            label-position="left"
            label-width="130px"
            label-align="right"
            :options="errorCorrectionLevels"
          /> -->
        </n-form>
      </n-gi>
      <n-gi>
        <div flex flex-col items-center gap-3>
          <n-image :src="qrcode" width="200" />
          <c-button @click="download">
            下载二维码
          </c-button>
        </div>
      </n-gi>
    </n-grid>
  </c-card>
</template>
