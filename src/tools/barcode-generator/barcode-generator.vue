<script setup lang="ts">
import VueBarcode from '@chenfengyuan/vue-barcode';
import JsBarcode from 'jsbarcode';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const foreground = useQueryParamOrStorage({ name: 'fg', storageName: 'barcode-gen:fg', defaultValue: '#000000ff' });
const background = useQueryParamOrStorage({ name: 'bg', storageName: 'barcode-gen:bg', defaultValue: '#ffffffff' });
const width = useQueryParamOrStorage({ name: 'width', storageName: 'barcode-gen:width', defaultValue: 2 });
const height = useQueryParamOrStorage({ name: 'height', storageName: 'barcode-gen:height', defaultValue: 100 });
const margin = useQueryParamOrStorage({ name: 'margin', storageName: 'barcode-gen:margin', defaultValue: 10 });
const format = useQueryParamOrStorage({ name: 'format', storageName: 'barcode-gen:format', defaultValue: 'auto' });
const displayValue = useQueryParamOrStorage({ name: 'display', storageName: 'barcode-gen:display', defaultValue: true });
const ean128 = useQueryParamOrStorage({ name: 'ean128', storageName: 'barcode-gen:ean128', defaultValue: false });
const value = ref('123456789');

const options = computed(() => ({
  lineColor: foreground.value,
  background: background.value,
  width: width.value,
  height: height.value,
  margin: margin.value,
  format: format.value === 'auto' ? 'CODE128' : format.value,
  displayValue: displayValue.value,
  ean128: ean128.value,
  text: value.value,
}));

const formats = [
  'auto',
  'CODE39',
  'CODE128', 'CODE128A', 'CODE128B', 'CODE128C',
  'EAN13', 'EAN8', 'EAN5', 'EAN2', 'UPC', 'UPCE',
  'ITF14',
  'ITF',
  'MSI', 'MSI10', 'MSI11', 'MSI1010', 'MSI1110',
  'pharmacode',
  'codabar',
  'GenericBarcode',
];

const barcodePNG = computed(() => {
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, value.value, options.value);
  return canvas.toDataURL('image/png');
});

const { download } = useDownloadFileFromBase64({ source: barcodePNG, filename: 'barcode.png' });
</script>

<template>
  <c-card>
    <n-grid x-gap="12" y-gap="12" cols="1 600:3">
      <n-gi span="2">
        <c-input-text
          v-model:value="value"
          label-position="left"
          label-width="130px"
          label-align="right"
          label="Text:"
          multiline
          rows="1"
          autosize
          placeholder="Your text..."
          mb-6
        />
        <n-form label-width="130" label-placement="left">
          <n-form-item label="Foreground color:">
            <n-color-picker v-model:value="foreground" :modes="['hex']" />
          </n-form-item>
          <n-form-item label="Background color:">
            <n-color-picker v-model:value="background" :modes="['hex']" />
          </n-form-item>
          <n-form-item label="Width:">
            <n-input-number v-model:value="width" :min="0" />
          </n-form-item>
          <n-form-item label="Height:">
            <n-input-number v-model:value="height" :min="0" />
          </n-form-item>
          <n-form-item label="Margin:">
            <n-input-number v-model:value="margin" :min="0" />
          </n-form-item>
          <n-form-item label="Display text:">
            <n-checkbox v-model:checked="displayValue" />
          </n-form-item>
          <c-select
            v-model:value="format"
            label="Format:"
            label-position="left"
            label-width="130px"
            label-align="right"
            :options="formats.map((value) => ({ label: value, value }))"
          />
        </n-form>
      </n-gi>
      <n-gi>
        <div flex flex-col items-center gap-3>
          <VueBarcode
            :options="options"
            :value="value"
          />
          <c-button @click="download">
            Download barcode
          </c-button>
        </div>
      </n-gi>
    </n-grid>
  </c-card>
</template>
