<script setup lang="ts">
import type { Ref } from 'vue';
import parseTorrent, { toMagnetURI } from 'parse-torrent';
import { withDefaultOnError } from '@/utils/defaults';
import { useValidation } from '@/composable/validation';

const inputType = ref<'file' | 'content'>('file');
const torrentContent = ref('');
const fileInput = ref() as Ref<File | null>;
const torrentInfosRaw = computedAsync(async () => {
  const file = fileInput.value;
  const content = torrentContent.value;
  try {
    if (inputType.value === 'file' && file) {
      return await parseTorrent(new Uint8Array(await file.arrayBuffer()));
    }
    else {
      return await parseTorrent(content);
    }
  }
  catch (e: any) {
    return {
      error: e.toString(),
    };
  }
});
const torrentInfos = computed(() => withDefaultOnError(() => {
  return Object.entries(torrentInfosRaw.value).map(([k, v]) => {
    return {
      label: k?.toString() || '',
      value: JSON.stringify(v),
    };
  });
}, []));
const magnetURI = computed(() => withDefaultOnError(() => toMagnetURI(torrentInfosRaw.value), []));

async function onUpload(file: File) {
  if (file) {
    fileInput.value = file;
  }
}

watch(torrentContent, (_, newValue) => {
  if (newValue !== '') {
    fileInput.value = null;
  }
});

const { attrs: validationAttrs } = useValidation({
  source: torrentInfos,
  rules: [{ message: 'Invalid torrent content', validator: torrent => torrent?.length > 0 }],
});
</script>

<template>
  <div>
    <n-radio-group v-model:value="inputType" name="radiogroup" mb-2 flex justify-center>
      <n-space>
        <n-radio
          value="file"
          label="File"
        />
        <n-radio
          value="content"
          label="Content"
        />
      </n-space>
    </n-radio-group>

    <c-file-upload
      v-if="inputType === 'file'"
      title="Drag and drop torrent file here, or click to select a file"
      @file-upload="onUpload"
    />

    <c-input-text
      v-if="inputType === 'content'"
      v-model:value="torrentContent"
      label="Torrent/Magnet Content"
      placeholder="Paste your Torrent/Magnet content here"
      multiline
      mb-2
    />

    <n-divider />

    <input-copyable
      label="Magnet URI"
      label-position="left"
      label-width="100px"
      label-align="right"
      mb-2
      :value="validationAttrs.validationStatus === 'error' ? '' : magnetURI"
      placeholder="Please use a correct torrent"
    />

    <input-copyable
      v-for="{ label, value } of torrentInfos"
      :key="label"
      :label="label"
      label-position="left"
      label-width="100px"
      label-align="right"
      mb-2
      :value="validationAttrs.validationStatus === 'error' ? '' : value"
      placeholder="Please use a correct torrent"
    />
  </div>
</template>

<style lang="less" scoped>
::v-deep(.n-upload-trigger) {
  width: 100%;
}
</style>
