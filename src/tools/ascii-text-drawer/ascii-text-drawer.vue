<script setup lang="ts">
import figlet from 'figlet';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const input = ref('Ascii ART');
const font = useStorage('ascii-text-drawer:font', 'Standard');
const width = useStorage('ascii-text-drawer:width', 80);
const output = ref('');
const errored = ref(false);
const processing = ref(false);

// Fonts are bundled with the app and loaded on demand. The previous setup
// fetched them from unpkg at runtime, which broke on self-hosted instances
// without external network access and 404ed on some CDN path encodings.
const fontLoaders = import.meta.glob<string>('./fonts/*.flf', { query: '?raw', import: 'default' });
const fonts = Object.keys(fontLoaders)
  .map(key => key.replace(/^\.\/fonts\//, '').replace(/\.flf$/, ''))
  .sort((a, b) => a.localeCompare(b));

let renderId = 0;

watchEffect(async () => {
  const id = ++renderId;
  processing.value = true;
  errored.value = false;
  try {
    const loader = fontLoaders[`./fonts/${font.value}.flf`];
    if (!loader) {
      throw new Error(`Unknown font: ${font.value}`);
    }

    figlet.parseFont(font.value, await loader());

    const text = await new Promise<string>((resolve, reject) =>
      figlet.text(input.value, {
        font: font.value as figlet.Fonts,
        width: width.value,
        whitespaceBreak: true,
      }, (err, data) => (err ? reject(err) : resolve(data ?? ''))),
    );

    if (id !== renderId) {
      return; // a newer render superseded this one
    }
    output.value = text;
  }
  catch {
    if (id !== renderId) {
      return;
    }
    errored.value = true;
  }
  if (id === renderId) {
    processing.value = false;
  }
});
</script>

<template>
  <c-card style="max-width: 600px;">
    <c-input-text
      v-model:value="input"
      label="Your text:"
      placeholder="Your text to draw"
      raw-text
      multiline
      rows="4"
    />

    <n-divider />

    <n-grid cols="4" x-gap="12" w-full>
      <n-gi span="2">
        <c-select
          v-model:value="font"
          label-position="top"
          label="Font:"
          :options="fonts"
          searchable="true"
          placeholder="Select font to use"
        />
      </n-gi>
      <n-gi span="2">
        <n-form-item label="Width:" label-placement="top" label-width="100" :show-feedback="false">
          <n-input-number v-model:value="width" min="0" max="10000" w-full placeholder="Width of the text" />
        </n-form-item>
      </n-gi>
    </n-grid>

    <n-divider />

    <div v-if="processing" flex items-center justify-center>
      <n-spin size="medium" />
      <span class="ml-2">Loading font...</span>
    </div>

    <c-alert v-if="errored" mt-1 text-center type="error">
      Current settings resulted in error.
    </c-alert>

    <n-form-item v-if="!processing && !errored" label="Ascii Art text:">
      <TextareaCopyable
        :value="output"
        mb-1 mt-1
        copy-placement="outside"
      />
    </n-form-item>
  </c-card>
</template>
