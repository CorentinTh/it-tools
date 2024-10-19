<script setup lang="ts">
import { useBase64 } from '@vueuse/core';
import type { Ref } from 'vue';
import { useCopy } from '@/composable/copy';
import { getExtensionFromMimeType, getMimeTypeFromBase64, previewImageFromBase64, useDownloadFileFromBase64Refs } from '@/composable/downloadBase64';
import { useValidation } from '@/composable/validation';
import { isValidBase64 } from '@/utils/base64';

const { t } = useI18n();

const fileName = ref('file');
const fileExtension = ref('');
const base64Input = ref('');
const { download } = useDownloadFileFromBase64Refs(
  {
    source: base64Input,
    filename: fileName,
    extension: fileExtension,
  });
const base64InputValidation = useValidation({
  source: base64Input,
  rules: [
    {
      message: t('tools.base64-file-converter.invalidMessage'),
      validator: value => isValidBase64(value.trim()),
    },
  ],
});

watch(
  base64Input,
  (newValue, _) => {
    const { mimeType } = getMimeTypeFromBase64({ base64String: newValue });
    if (mimeType) {
      fileExtension.value = getExtensionFromMimeType(mimeType) || fileExtension.value;
    }
  },
);

function previewImage() {
  if (!base64InputValidation.isValid) {
    return;
  }
  try {
    const image = previewImageFromBase64(base64Input.value);
    image.style.maxWidth = '100%';
    image.style.maxHeight = '400px';
    const previewContainer = document.getElementById('previewContainer');
    if (previewContainer) {
      previewContainer.innerHTML = '';
      previewContainer.appendChild(image);
    }
  }
  catch (_) {
    //
  }
}

function downloadFile() {
  if (!base64InputValidation.isValid) {
    return;
  }

  try {
    download();
  }
  catch (_) {
    //
  }
}

const fileInput = ref() as Ref<File>;
const { base64: fileBase64 } = useBase64(fileInput);
const { copy: copyFileBase64 } = useCopy({ source: fileBase64, text: t('tools.base64-file-converter.copied') });

async function onUpload(file: File) {
  if (file) {
    fileInput.value = file;
  }
}
</script>

<template>
  <c-card :title="t('tools.base64-file-converter.base64ToFile.title')">
    <n-grid cols="3" x-gap="12">
      <n-gi span="2">
        <c-input-text
          v-model:value="fileName"
          :label="t('tools.base64-file-converter.base64ToFile.fileName')"
          :placeholder="t('tools.base64-file-converter.base64ToFile.downloadFilename')"
          mb-2
        />
      </n-gi>
      <n-gi>
        <c-input-text
          v-model:value="fileExtension"
          :label="t('tools.base64-file-converter.base64ToFile.extension')"
          :placeholder="t('tools.base64-file-converter.base64ToFile.extension')"
          mb-2
        />
      </n-gi>
    </n-grid>
    <c-input-text
      v-model:value="base64Input"
      multiline
      :placeholder="t('tools.base64-file-converter.base64ToFile.placeholder')"
      rows="5"
      :validation="base64InputValidation"
      mb-2
    />

    <div flex justify-center py-2>
      <div id="previewContainer" />
    </div>

    <div flex justify-center gap-3>
      <c-button :disabled="base64Input === '' || !base64InputValidation.isValid" @click="previewImage()">
        {{ t('tools.base64-file-converter.buttons.previewImage') }}
      </c-button>
      <c-button :disabled="base64Input === '' || !base64InputValidation.isValid" @click="downloadFile()">
        {{ t('tools.base64-file-converter.buttons.downloadFile') }}
      </c-button>
    </div>
  </c-card>

  <c-card :title="t('tools.base64-file-converter.fileToBase64.title')">
    <c-file-upload :title="t('tools.base64-file-converter.fileToBase64.uploadTip')" @file-upload="onUpload" />
    <c-input-text :value="fileBase64" multiline readonly :placeholder="t('tools.base64-file-converter.fileToBase64.placeholder')" rows="5" my-2 />

    <div flex justify-center>
      <c-button @click="copyFileBase64()">
        {{ t('tools.base64-file-converter.buttons.copy') }}
      </c-button>
    </div>
  </c-card>
</template>

<style lang="less" scoped>
::v-deep(.n-upload-trigger) {
  width: 100%;
}
</style>
