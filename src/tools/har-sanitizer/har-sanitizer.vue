<script setup lang="ts">
import { downloadFile } from './lib/downloadFile';
import { defaultScrubItems, getHarInfo, sanitize } from './lib/har_sanitize';

type ScrubState = Record<ScrubType, Record<string, boolean>>;
type ScrubType =
 | 'cookies'
 | 'headers'
 | 'queryArgs'
 | 'postParams'
 | 'mimeTypes';

const typeMap: Record<ScrubType, string> = {
  cookies: 'Cookies',
  mimeTypes: 'Mime Types',
  headers: 'Headers',
  postParams: 'Post Body Params',
  queryArgs: 'Query String Parameters',
};

const defaulScrubState: ScrubState = {
  cookies: {},
  headers: {},
  queryArgs: {},
  postParams: {},
  mimeTypes: {},
};
const scrubItemsToClean = ref<ScrubState>(defaulScrubState);

function getScrubableItems(input: string): ScrubState {
  const rawItems = getHarInfo(input);
  const output = { ...defaulScrubState };
  Object.entries(rawItems).forEach(([key, items]: [string, string[]]) => {
    output[key as ScrubType] = items.reduce(
      (acc, curr) => {
        if (!curr) {
          return acc;
        }
        acc[curr] = defaultScrubItems.includes(curr);
        return acc;
      },
      {} as Record<string, boolean>,
    );
    return null;
  });
  return output;
}

function sanitizeHar(input: string, scrubItems: ScrubState) {
  const words = new Set<string>();
  Object.entries(scrubItems.cookies).forEach(([key, val]) => {
    if (val) {
      words.add(key);
    }
  });
  Object.entries(scrubItems.headers).forEach(([key, val]) => {
    if (val) {
      words.add(key);
    }
  });
  Object.entries(scrubItems.queryArgs).forEach(([key, val]) => {
    if (val) {
      words.add(key);
    }
  });
  Object.entries(scrubItems.postParams).forEach(([key, val]) => {
    if (val) {
      words.add(key);
    }
  });

  const mimeTypes = new Set<string>();
  Object.entries(scrubItems.mimeTypes).forEach(([key, val]) => {
    if (val) {
      mimeTypes.add(key);
    }
  });
  return sanitize(input, {
    scrubWords: [...words],
    scrubMimetypes: [...mimeTypes],
  });
}

const file = ref<File | null>(null);

const error = ref('');

function readAsTextAsync(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => resolve(reader.result?.toString() ?? '');
    reader.onerror = error => reject(error);
  });
}

const harContent = ref('');
async function onFileUploaded(uploadedFile: File) {
  file.value = uploadedFile;
  harContent.value = await readAsTextAsync(uploadedFile);

  error.value = '';
  try {
    scrubItemsToClean.value = getScrubableItems(harContent.value);
  }
  catch (e: any) {
    error.value = e.toString();
  }
}

function processHar() {
  downloadFile(sanitizeHar(harContent.value, scrubItemsToClean.value), `sanitized-${file.value?.name}`);
}
</script>

<template>
  <div>
    <div style="flex: 0 0 100%" mb-3>
      <div mx-auto max-w-600px>
        <c-file-upload
          title="Drag and drop a HAR file here, or click to select a file"
          accept=".har" @file-upload="onFileUploaded"
        />
      </div>
    </div>

    <c-alert v-if="error" title="Error">
      {{ error }}
    </c-alert>

    <div v-for="(title, key) in typeMap" :key="key" mb-1>
      <c-card v-if="Object.keys(scrubItemsToClean[key]).length" :title="title">
        <n-checkbox font-size-5 @update:checked="(allChecked: boolean) => Object.keys(scrubItemsToClean[key]).forEach((name) => scrubItemsToClean[key][name] = allChecked)">
          All {{ title }}
        </n-checkbox>
        <n-space size="large">
          <n-checkbox v-for="(checked, name) in scrubItemsToClean[key]" :key="name" v-model:checked="scrubItemsToClean[key][name]" style="width: 150px">
            {{ name }}
          </n-checkbox>
        </n-space>
      </c-card>
    </div>

    <div v-if="!error" mt-3 flex justify-center>
      <c-button @click="processHar()">
        Sanitize and download
      </c-button>
    </div>
  </div>
</template>
