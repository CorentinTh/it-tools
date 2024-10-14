<script setup lang="ts">
import { mergeIcals } from './ical-merger.service';

const fileInputs = ref<Array<File>>([]);
const mergedOutput = ref('');
const calendarName = ref('');
const calendarDescription = ref('');
const errors = ref('');

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
  mergedOutput.value = '';
  try {
    mergedOutput.value = mergeIcals(fileBuffers);
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
      multiple
      mb-2
      @files-upload="onUploads"
    />

    <n-form-item label="Title:" label-placement="left">
      <n-input v-model:value="calendarName" placeholder="Please input merge calendar title..." />
    </n-form-item>

    <n-form-item label="Description:">
      <n-input v-model:value="calendarDescription" placeholder="Please input merged calendar description..." />
    </n-form-item>

    <ul>
      <li v-for="(file, index) in fileInputs" :key="index" mb-1>
        <n-button mr-2 @click="deleteFile(index)">
          Delete
        </n-button>
        File to merge: {{ file.name }}
      </li>
    </ul>

    <div flex justify-center>
      <n-button @click="mergeFiles">
        Merge iCal files
      </n-button>
    </div>

    <n-divider />

    <c-alert v-if="errors" mb-2>
      {{ errors }}
    </c-alert>

    <textarea-copyable
      v-if="mergedOutput"
      v-model:value="mergedOutput"
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
