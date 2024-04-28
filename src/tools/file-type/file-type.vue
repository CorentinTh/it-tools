<script setup lang="ts">
import type { FileTypeResult } from 'file-type';
import { fileTypeFromBuffer } from 'file-type';
import InputCopyable from '../../components/InputCopyable.vue';

const status = ref<'idle' | 'done' | 'error' | 'processing'>('idle');
const file = ref<File | null>(null);
const type = ref<FileTypeResult | undefined>(undefined);

async function onFileUploaded(uploadedFile: File) {
  file.value = uploadedFile;
  const fileBuffer = await uploadedFile.arrayBuffer();

  status.value = 'processing';
  try {
    type.value = await fileTypeFromBuffer(new Uint8Array(fileBuffer.slice(0, 4096)));
    status.value = 'done';
  }
  catch (e) {
    status.value = 'error';
  }
}
</script>

<template>
  <div>
    <div style="flex: 0 0 100%" mb-3>
      <div mx-auto max-w-600px>
        <c-file-upload
          title="Drag and drop a file here, or click to select a file"
          @file-upload="onFileUploaded"
        />
      </div>
    </div>

    <div mt-3 flex justify-center>
      <c-card v-if="status === 'done'" title="Information">
        <InputCopyable
          :value="file?.name || ''"
          label="File name:"
          label-position="left"
          label-width="100px"
          label-align="right"
          readonly
          mt-2
        />

        <InputCopyable
          :value="type?.ext || '<unknown>'"
          label="Extension:"
          label-position="left"
          label-width="100px"
          label-align="right"
          readonly
          mt-2
        />
        <InputCopyable
          :value="type?.mime || '<unknown>'"
          label="MIME Type:"
          label-position="left"
          label-width="100px"
          label-align="right"
          readonly
          mt-2
        />
      </c-card>
      <c-alert v-if="status === 'error'" type="error">
        An error occured processing {{ file?.name }}.
      </c-alert>
      <n-spin
        v-if="status === 'processing'"
        size="small"
      />
    </div>
  </div>
</template>
