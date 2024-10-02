<script setup lang="ts">
import { mergeIcals } from './ical-merger.service';

const fileInputs = ref<Array<File>>([]);
const mergedOutput = ref('');
const errors = ref('');
//
function onUploads(files: Array<File>) {
  fileInputs.value = [...fileInputs.value, ...files];
}
function deleteFile(index: number) {
  fileInputs.value.splice(index, 1);
}
async function mergeFiles() {
  const fileBuffers: Array<string> = [];
  for (const file of fileInputs.value) {
    fileBuffers.push(await readFileAsString(file));
  }
  errors.value = '';
  try {
    return mergeIcals(fileBuffers);
  }
  catch (e: any) {
    errors.value = e.toString();
  }
}

function readFileAsString(file: File) {
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      resolve(fr.result as string || '');
    };
    fr.onerror = reject;
    fr.readAsText(file);
  });
}
</script>

<template>
  <div>
    <c-file-upload
      title="Drag and drop iCal file here, or click to select a file"
      @file-uploads="onUploads"
    />

    <ul>
      <li v-for="(file, index) in fileInputs" :key="index">
        {{ file.name }}
        <n-button @click="deleteFile(index)">
          Delete
        </n-button>
      </li>
    </ul>

    <n-button @click="mergeFiles">
      Merge iCal files
    </n-button>

    <n-divider />

    <c-alert v-if="errors">
      {{ errors }}
    </c-alert>

    <textarea-copyable
      v-if="mergedOutput"
      download-file-name="merge.ics"
      download-button-text="Download merged iCal"
      label="Merged ICAL"
      mb-2
    />
  </div>
</template>

<style lang="less" scoped>
::v-deep(.n-upload-trigger) {
  width: 100%;
}
</style>
