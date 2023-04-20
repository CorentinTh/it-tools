<template>
  <c-card title="Base64 to file">
    <n-form-item
      :feedback="base64InputValidation.message"
      :validation-status="base64InputValidation.status"
      :show-label="false"
    >
      <n-input v-model:value="base64Input" type="textarea" placeholder="Put your base64 file string here..." rows="5" />
    </n-form-item>
    <n-space justify="center">
      <c-button :disabled="base64Input === '' || !base64InputValidation.isValid" @click="downloadFile()">
        Download file
      </c-button>
    </n-space>
  </c-card>

  <c-card title="File to base64">
    <n-upload v-model:file-list="fileList" :show-file-list="true" :on-before-upload="onUpload" list-type="image">
      <n-upload-dragger>
        <div mb-2>
          <n-icon size="35" :depth="3" :component="Upload" />
        </div>
        <n-text style="font-size: 14px"> Click or drag a file to this area to upload </n-text>
      </n-upload-dragger>
    </n-upload>

    <n-input :value="fileBase64" type="textarea" readonly placeholder="File in base64 will be here" />
    <n-space justify="center">
      <c-button @click="copyFileBase64()"> Copy </c-button>
    </n-space>
  </c-card>
</template>

<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { useValidation } from '@/composable/validation';
import { isValidBase64 } from '@/utils/base64';
import { Upload } from '@vicons/tabler';
import { useBase64 } from '@vueuse/core';
import type { UploadFileInfo } from 'naive-ui';
import { ref, type Ref } from 'vue';

const base64Input = ref('');
const { download } = useDownloadFileFromBase64({ source: base64Input });
const base64InputValidation = useValidation({
  source: base64Input,
  rules: [
    {
      message: 'Invalid base 64 string',
      validator: (value) => isValidBase64(value.trim()),
    },
  ],
});

function downloadFile() {
  if (!base64InputValidation.isValid) return;

  try {
    download();
  } catch (_) {
    //
  }
}

const fileList = ref();
const fileInput = ref() as Ref<File>;
const { base64: fileBase64 } = useBase64(fileInput);
const { copy: copyFileBase64 } = useCopy({ source: fileBase64, text: 'Base64 string copied to the clipboard' });

async function onUpload({ file: { file } }: { file: UploadFileInfo }) {
  if (file) {
    fileList.value = [];
    fileInput.value = file;
  }
}
</script>

<style lang="less" scoped>
.n-input,
.n-upload {
  margin-bottom: 15px;
}

::v-deep(.n-upload-trigger) {
  width: 100%;
}
</style>
