<script setup lang="ts">
import type {
  CornerDotType,
  CornerSquareType,
  DotType,
  ErrorCorrectionLevel,
  FileExtension,
} from 'pp-qr-code';
import qrcodeConsole from 'qrcode-terminal-nooctal';
import { useQRCodeStyling } from './useQRCode';
import { useDownloadFileFromBase64Refs } from '@/composable/downloadBase64';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const foreground = useQueryParamOrStorage({ name: 'fg', storageName: 'qr-code-gen:fg', defaultValue: '#000000ff' });
const background = useQueryParamOrStorage({ name: 'bg', storageName: 'qr-code-gen:bg', defaultValue: '#ffffffff' });
const errorCorrectionLevelSelectValue = useQueryParamOrStorage<string>({ name: 'level', storageName: 'qr-code-gen:level', defaultValue: 'medium' });
const errorCorrectionLevel = computed(() => errorCorrectionLevelSelectValue.value.toString()[0].toUpperCase() as ErrorCorrectionLevel);
const width = useQueryParamOrStorage({ name: 'width', storageName: 'qr-code-gen:width', defaultValue: 1024 });
const margin = useQueryParamOrStorage({ name: 'margin', storageName: 'qr-code-gen:margin', defaultValue: 10 });
const imageSize = useQueryParamOrStorage({ name: 'imgsize', storageName: 'qr-code-gen:imsz', defaultValue: 0.4 });
const imageMargin = useQueryParamOrStorage({ name: 'imgmargin', storageName: 'qr-code-gen:immg', defaultValue: 20 });
const outputType = useQueryParamOrStorage<FileExtension>({ name: 'out', storageName: 'qr-code-gen:out', defaultValue: 'png' });
const dotType = useQueryParamOrStorage<DotType>({ name: 'dot', storageName: 'qr-code-gen:dot', defaultValue: 'square' });
const dotColor = useQueryParamOrStorage<string>({ name: 'dotc', storageName: 'qr-code-gen:dotc', defaultValue: '#ffffffff' });
const cornersDotType = useQueryParamOrStorage<CornerDotType>({ name: 'cdt', storageName: 'qr-code-gen:cdt', defaultValue: 'square' });
const cornersDotColor = useQueryParamOrStorage<string>({ name: 'cdtc', storageName: 'qr-code-gen:cdtc', defaultValue: '#ffffffff' });
const cornersSquareType = useQueryParamOrStorage<CornerSquareType>({ name: 'cst', storageName: 'qr-code-gen:cst', defaultValue: 'square' });
const cornersSquareColor = useQueryParamOrStorage<string>({ name: 'cstc', storageName: 'qr-code-gen:cstc', defaultValue: '#ffffffff' });
const smallTerminal = useQueryParamOrStorage<boolean>({ name: 'sml', storageName: 'qr-code-gen:sml', defaultValue: false });
const fileInput = ref() as Ref<File>;
const { base64: imageBase64 } = useBase64(fileInput);
async function onUpload(file: File) {
  if (file) {
    fileInput.value = file;
  }
}

const errorCorrectionLevels = ['low', 'medium', 'quartile', 'high'];
const outputTypes = ['svg', 'png', 'jpeg', 'webp'];
const dotTypes = ['dots',
  'random-dots',
  'rounded',
  'vertical-lines',
  'horizontal-lines',
  'classy',
  'classy-rounded',
  'square',
  'extra-rounded'];
const cornersDotTypes = ['dot', 'square', 'heart'];
const cornersSquareTypes = ['dot', 'square', 'extra-rounded'];

const text = ref('https://it-tools.tech');
const { qrcode } = useQRCodeStyling({
  text,
  color: { background, foreground },
  errorCorrectionLevel,
  imageBase64,
  imageOptions: { imageSize, margin: imageMargin },
  dotOptions: { type: dotType, color: dotColor },
  cornersSquareOptions: { type: cornersSquareType, color: cornersSquareColor },
  cornersDotOptions: { type: cornersDotType, color: cornersDotColor },
  outputType,
  width,
  margin,
});

const qrcodeTerminal = computedAsync(() => {
  const textValue = text.value;
  const level = errorCorrectionLevel.value;
  const small = smallTerminal.value;
  return new Promise<string>((resolve, _reject) => {
    try {
      qrcodeConsole.setErrorLevel(level);
      qrcodeConsole.generate(textValue, { small }, (qrcode: string) => {
        resolve(qrcode);
      });
    }
    catch (_) {
      resolve('');
    }
  });
});

const filename = ref('qr-code');
const extension = computed(() => outputType.value.toString());
const { download } = useDownloadFileFromBase64Refs({ source: qrcode, filename, extension });
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
          label="Text:"
          multiline
          rows="1"
          autosize
          placeholder="Your link or text..."
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
          <n-form-item label="Margin:">
            <n-input-number v-model:value="margin" :min="0" />
          </n-form-item>
          <c-select
            v-model:value="errorCorrectionLevelSelectValue"
            label="Error resistance:"
            label-position="left"
            label-width="130px"
            label-align="right"
            :options="errorCorrectionLevels.map((value) => ({ label: value, value }))"
          />
        </n-form>
        <c-card title="Image" mt-3>
          <c-file-upload title="Drag and drop an image here, or click to select an image" @file-upload="onUpload" />

          <n-form label-width="130" label-placement="left" mt-3>
            <n-form-item label="Size:">
              <n-input-number v-model:value="imageSize" :min="0" step="0.1" />
            </n-form-item>
            <n-form-item label="Margin:">
              <n-input-number v-model:value="imageMargin" :min="0" />
            </n-form-item>
          </n-form>
        </c-card>
        <c-card mt-3>
          <details>
            <summary>Dots Options</summary>
            <n-form label-width="130" label-placement="left">
              <n-form-item label="Color:">
                <n-color-picker v-model:value="dotColor" :modes="['hex']" />
              </n-form-item>
              <c-select
                v-model:value="dotType"
                label="Type:"
                label-position="left"
                label-width="130px"
                label-align="right"
                :options="dotTypes.map((value) => ({ label: value, value }))"
              />
            </n-form>
          </details>
        </c-card>
        <c-card mt-3>
          <details>
            <summary>Corners Dots Options</summary>
            <n-form label-width="130" label-placement="left">
              <n-form-item label="Color:">
                <n-color-picker v-model:value="cornersDotColor" :modes="['hex']" />
              </n-form-item>
              <c-select
                v-model:value="cornersDotType"
                label="Type:"
                label-position="left"
                label-width="130px"
                label-align="right"
                :options="cornersDotTypes.map((value) => ({ label: value, value }))"
              />
            </n-form>
          </details>
        </c-card>
        <c-card mt-3>
          <details>
            <summary>Corners Square Options</summary>
            <n-form label-width="130" label-placement="left">
              <n-form-item label="Color:">
                <n-color-picker v-model:value="cornersSquareColor" :modes="['hex']" />
              </n-form-item>
              <c-select
                v-model:value="cornersSquareType"
                label="Type:"
                label-position="left"
                label-width="130px"
                label-align="right"
                :options="cornersSquareTypes.map((value) => ({ label: value, value }))"
              />
            </n-form>
          </details>
        </c-card>
        <c-select
          v-model:value="outputType"
          mt-3
          label="Output format:"
          label-position="left"
          label-width="130px"
          label-align="right"
          :options="outputTypes.map((value) => ({ label: value.toUpperCase(), value }))"
        />
      </n-gi>
      <n-gi>
        <div flex flex-col items-center gap-3>
          <n-image :src="qrcode" width="200" />
          <c-button @click="download">
            Download qr-code ({{ outputType.toString().toUpperCase() }})
          </c-button>
        </div>

        <n-divider />

        <n-checkbox v-model:checked="smallTerminal">
          Small Terminal
        </n-checkbox>
        <n-form-item label="Terminal output:" mt-1>
          <TextareaCopyable
            :value="qrcodeTerminal"
            multiline
            rows="5"
            mb-1 mt-1
            copy-placement="outside"
          />
        </n-form-item>
      </n-gi>
    </n-grid>
  </c-card>
</template>
