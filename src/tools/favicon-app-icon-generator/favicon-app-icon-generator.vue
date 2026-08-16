<script setup lang="ts">
import { APP_ICON_MAX_FILE_BYTES, type GeneratedAppIcon, createAppIconTar, createAppManifest, generateAppIcons } from './favicon-app-icon-generator.service';
import CColorPicker from '@/ui/c-color-picker/c-color-picker.vue';
import CInputNumber from '@/ui/c-input-number/c-input-number.vue';
import CSwitch from '@/ui/c-switch/c-switch.vue';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';
import { formatBytes } from '@/utils/convert';
import { downloadBlobFile } from '@/utils/standalone-host';

interface PreviewIcon extends GeneratedAppIcon {
  url: string
}

const selectedFile = shallowRef<File>();
const background = ref('#ffffff');
const paddingPercent = ref(8);
const transparent = ref(false);
const icons = shallowRef<PreviewIcon[]>([]);
const manifest = ref('');
const error = ref('');
const status = ref('Select one local image.');
const isRunning = ref(false);
const completedSignature = ref('');
let generationId = 0;

const signature = computed(() => `${selectedFile.value?.name ?? ''}\0${selectedFile.value?.size ?? 0}\0${selectedFile.value?.lastModified ?? 0}\0${background.value}\0${paddingPercent.value}\0${transparent.value}`);
const stale = computed(() => Boolean(icons.value.length > 0 && completedSignature.value !== signature.value));
const canGenerate = computed(() => Boolean(selectedFile.value && selectedFile.value.size <= APP_ICON_MAX_FILE_BYTES && !isRunning.value));

function clearIcons() {
  for (const icon of icons.value) {
    URL.revokeObjectURL(icon.url);
  }
  icons.value = [];
  manifest.value = '';
}

function selectFile(file: File) {
  generationId += 1;
  clearIcons();
  selectedFile.value = file;
  error.value = '';
  status.value = file.size <= APP_ICON_MAX_FILE_BYTES
    ? 'Image selected. Choose Generate icons.'
    : 'The selected image exceeds the 10 MiB limit.';
}

watch([background, paddingPercent, transparent], () => {
  error.value = '';
  if (stale.value) {
    status.value = 'Options changed. Generate again to refresh the icons.';
  }
});

async function generate() {
  const file = selectedFile.value;
  if (!file || !canGenerate.value) {
    return;
  }
  const currentGeneration = ++generationId;
  isRunning.value = true;
  error.value = '';
  status.value = 'Decoding and drawing locally…';
  try {
    const generated = await generateAppIcons(file, {
      background: background.value,
      paddingPercent: paddingPercent.value,
      transparent: transparent.value,
    });
    if (currentGeneration !== generationId) {
      return;
    }
    clearIcons();
    icons.value = generated.map(icon => ({ ...icon, url: URL.createObjectURL(icon.blob) }));
    manifest.value = createAppManifest(generated);
    completedSignature.value = signature.value;
    status.value = `Generated ${generated.length} PNG icons locally.`;
  }
  catch (caught) {
    if (currentGeneration === generationId) {
      error.value = caught instanceof Error ? caught.message : 'Icon generation failed.';
      status.value = 'Generation failed.';
    }
  }
  finally {
    if (currentGeneration === generationId) {
      isRunning.value = false;
    }
  }
}

async function downloadBundle() {
  if (icons.value.length === 0) {
    return;
  }
  try {
    status.value = 'Building a local TAR bundle…';
    await downloadBlobFile(await createAppIconTar(icons.value, manifest.value), 'app-icons.tar');
    status.value = 'Downloaded app-icons.tar.';
  }
  catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'The icon bundle could not be created.';
    status.value = 'Bundle creation failed.';
  }
}

function downloadManifest() {
  downloadTextFile({ content: manifest.value, filename: 'manifest.webmanifest' });
}

const { copy } = useCopy({ source: manifest, text: 'Web app manifest copied to the clipboard' });
onBeforeUnmount(() => {
  generationId += 1;
  clearIcons();
  selectedFile.value = undefined;
});
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Local image pipeline">
      The source image never leaves this browser and is not persisted. PNG, JPEG, and WebP files are limited to 10 MiB; decoded sources are limited to 4096×4096 and 16 megapixels. Maskable output always gets at least 10% safe padding and an opaque background.
    </c-alert>

    <c-card title="Source image">
      <c-file-upload
        accept="image/png,image/jpeg,image/webp"
        data-test-id="app-icon-upload"
        title="Drop one PNG, JPEG, or WebP image here, or click to select (maximum 10 MiB)"
        @file-upload="selectFile"
      />
      <div v-if="selectedFile" mt-3 data-test-id="app-icon-selection">
        <p><span font-600>Name:</span> <bdi>{{ selectedFile.name }}</bdi></p>
        <p><span font-600>Size:</span> {{ formatBytes(selectedFile.size) }}</p>
      </div>
    </c-card>

    <c-card class="c-task-options" title="Rendering options">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-field label="Background color">
          <CColorPicker v-model:value="background" aria-label="Icon background color" :modes="['hex']" />
        </c-field>
        <c-field label="Padding (%)" label-for="app-icon-padding">
          <CInputNumber id="app-icon-padding" v-model:value="paddingPercent" :min="0" :max="30" placeholder="8" />
        </c-field>
        <CSwitch v-model:value="transparent" label="Transparent non-maskable backgrounds" md:col-span-2 />
      </div>
    </c-card>

    <div class="c-task-actions">
      <c-button type="primary" :disabled="!canGenerate" data-test-id="app-icon-generate" @click="generate">
        {{ isRunning ? 'Generating…' : 'Generate icons' }}
      </c-button>
    </div>
    <p class="c-task-status" data-test-id="app-icon-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="error" title="Icon generation error" data-test-id="app-icon-error">
      {{ error }}
    </c-alert>
    <c-alert v-if="stale" title="Icons use previous options">
      Select Generate icons to apply the current rendering options.
    </c-alert>

    <c-card v-if="icons.length" title="Generated PNG files" data-test-id="app-icon-results">
      <div grid grid-cols-2 gap-4 lg:grid-cols-4 sm:grid-cols-3>
        <div v-for="icon in icons" :key="icon.name" flex flex-col items-center gap-2>
          <div bg-checkerboard h-28 w-full flex items-center justify-center rounded>
            <img :src="icon.url" :alt="`${icon.size} pixel generated icon`" max-h-24>
          </div>
          <code text-xs>{{ icon.name }}</code>
          <c-button size="small" @click="downloadBlobFile(icon.blob, icon.name)">
            Download
          </c-button>
        </div>
      </div>
    </c-card>

    <c-input-text :value="manifest" label="Web app manifest" test-id="app-icon-manifest" raw-text readonly monospace multiline :rows="16" />
    <div class="c-task-actions">
      <c-button :disabled="!manifest" @click="copy()">
        Copy manifest
      </c-button>
      <c-button :disabled="!manifest" @click="downloadManifest">
        Download manifest
      </c-button>
      <c-button :disabled="!manifest" data-test-id="app-icon-bundle" @click="downloadBundle">
        Download TAR bundle
      </c-button>
    </div>
  </div>
</template>
