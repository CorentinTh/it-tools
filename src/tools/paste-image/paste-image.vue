<script setup lang="ts">
import type { OutputFormat } from './paste-image.service';
import { useMessage } from 'naive-ui';
import { useCopy } from '@/composable/copy';
import { formatBytes } from '@/utils/convert';
import {
  clampQuality,
  convertImage,
  defaultOutputFormat,
  defaultQuality,
  formatSizeDelta,
  getDefaultFileName,
  getFileExtension,
  getImageFromDataTransfer,
  getTypeLabel,
  getUniqueFileName,
  isFallbackOutput,
  isOutputFormat,

  outputFormats,
  readImageDimensions,
  readImageFromClipboard,
  writeDataUrlToClipboard,
  writeImageToClipboard,
} from './paste-image.service';

interface PastedImage {
  id: number
  source: Blob
  width: number
  height: number
  defaultFileName: string
  fileName: string
  output?: Blob
  outputFormat?: OutputFormat
  outputUrl?: string
  conversionError?: string
  conversionId: number
}

const message = useMessage();
const { copy } = useCopy({ createToast: false });

// Stored values come from the viewer's browser and can be stale or edited, so they are validated on read.
const storedFormat = useStorage<string>('paste-image:format', defaultOutputFormat);
const format = computed<OutputFormat>({
  get: () => (isOutputFormat(storedFormat.value) ? storedFormat.value : defaultOutputFormat),
  set: (value) => {
    storedFormat.value = value;
  },
});
const storedQuality = useStorage<number>('paste-image:quality', defaultQuality);
const quality = computed<number>({
  get: () => clampQuality(storedQuality.value),
  set: (value) => {
    storedQuality.value = value;
  },
});

const images = ref<PastedImage[]>([]);
let nextImageId = 0;
let isUnmounted = false;
// Conversions run one at a time, so a format change does not decode the whole history at once.
let conversionQueue = Promise.resolve();

const formatOptions = Object.entries(outputFormats).map(([value, { label }]) => ({ value: value as OutputFormat, label }));
const isLossyFormat = computed(() => outputFormats[format.value].isLossy);
const pasteShortcut = /Mac|iPhone|iPad/.test(navigator.userAgent) ? '⌘ + V' : 'Ctrl + V';
const noImageWarning = 'The clipboard has no image. Copy an image, then try again.';

function isEditableTarget(target: EventTarget | null) {
  return target instanceof HTMLElement
    && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
}

function revokeOutputUrl(image: PastedImage) {
  if (image.outputUrl) {
    URL.revokeObjectURL(image.outputUrl);
  }
}

// A conversion is current while the image's conversionId still matches the one it was scheduled with.
// Scheduling a newer conversion or removing the image changes the conversionId, so stale results are dropped.
function invalidateOutput(image: PastedImage) {
  return ++image.conversionId;
}

async function updateOutput(image: PastedImage, conversionId: number) {
  if (conversionId !== image.conversionId) {
    return;
  }

  const outputFormat = format.value;

  try {
    const output = await convertImage({ source: image.source, format: outputFormat, quality: quality.value });

    if (conversionId !== image.conversionId) {
      return;
    }

    revokeOutputUrl(image);
    image.output = markRaw(output);
    image.outputFormat = outputFormat;
    image.outputUrl = URL.createObjectURL(output);
    image.conversionError = undefined;
  }
  catch (error) {
    if (conversionId === image.conversionId) {
      image.conversionError = error instanceof Error ? error.message : 'The browser could not convert the image.';
    }
  }
}

function scheduleOutput(image: PastedImage) {
  const conversionId = invalidateOutput(image);
  conversionQueue = conversionQueue.then(() => updateOutput(image, conversionId));
}

async function addImage(source: Blob) {
  let dimensions: { width: number; height: number };

  try {
    dimensions = await readImageDimensions(source);
  }
  catch {
    message.error('The browser could not read the pasted image.');
    return;
  }

  if (isUnmounted) {
    return;
  }

  const defaultFileName = getUniqueFileName({
    fileName: getDefaultFileName({ date: new Date() }),
    existingFileNames: images.value.flatMap(({ fileName, defaultFileName }) => [fileName, defaultFileName]),
  });

  images.value.unshift({
    id: nextImageId++,
    source: markRaw(source),
    ...dimensions,
    defaultFileName,
    fileName: defaultFileName,
    conversionId: 0,
  });

  scheduleOutput(images.value[0]);
}

function releaseImage(image: PastedImage) {
  invalidateOutput(image);
  revokeOutputUrl(image);
}

function removeImage(image: PastedImage) {
  releaseImage(image);
  images.value = images.value.filter(({ id }) => id !== image.id);
}

function clearImages() {
  images.value.forEach(releaseImage);
  images.value = [];
}

useEventListener(document, 'paste', (event: ClipboardEvent) => {
  const image = getImageFromDataTransfer(event.clipboardData);

  if (image) {
    event.preventDefault();
    addImage(image);
    return;
  }

  // Text pasted into a field, such as the file name, is not meant for this tool.
  if (!isEditableTarget(event.target)) {
    message.warning(noImageWarning);
  }
});

async function pasteFromClipboard() {
  if (!navigator.clipboard?.read) {
    message.error(`Your browser cannot read images from the clipboard with a button. Press ${pasteShortcut} instead.`);
    return;
  }

  try {
    const image = await readImageFromClipboard();

    if (!image) {
      message.warning(noImageWarning);
      return;
    }

    await addImage(image);
  }
  catch (error) {
    if (error instanceof DOMException && error.name === 'NotAllowedError') {
      message.error(`The browser blocked clipboard access. Allow it in the site settings, or press ${pasteShortcut}.`);
      return;
    }

    message.error('The browser could not read the clipboard.');
  }
}

watch(format, () => images.value.forEach(scheduleOutput));
watchDebounced(quality, () => images.value.forEach(scheduleOutput), { debounce: 200 });

onBeforeUnmount(() => {
  isUnmounted = true;
  clearImages();
});

function getOutputExtension(image: PastedImage) {
  return getFileExtension(image.output?.type ?? outputFormats[format.value].mimeType);
}

function downloadImage(image: PastedImage) {
  if (!image.outputUrl) {
    return;
  }

  const link = document.createElement('a');
  link.href = image.outputUrl;
  link.download = `${image.fileName.trim() || image.defaultFileName}.${getOutputExtension(image)}`;
  link.click();
}

async function copyImage(image: PastedImage) {
  try {
    await writeImageToClipboard({ source: image.source });
    message.success('Image copied to the clipboard');
  }
  catch {
    message.error('The browser could not copy the image to the clipboard.');
  }
}

async function copyDataUrl(image: PastedImage) {
  if (!image.output) {
    return;
  }

  try {
    await writeDataUrlToClipboard({ source: image.output, writeText: copy });
    message.success('Base64 data URL copied to the clipboard');
  }
  catch {
    message.error('The browser could not copy the base64 data URL to the clipboard.');
  }
}
</script>

<template>
  <div>
    <c-card>
      <div flex flex-wrap items-center justify-between gap-3>
        <div>
          Press <n-text code>
            {{ pasteShortcut }}
          </n-text> anywhere on this page to paste an image.
          <div op-60>
            The image stays in your browser. Nothing is uploaded.
          </div>
        </div>

        <c-button type="primary" data-test-id="paste-from-clipboard" @click="pasteFromClipboard">
          <span mr-2><icon-mdi-content-paste /></span>
          Paste from clipboard
        </c-button>
      </div>

      <n-divider />

      <c-buttons-select v-model:value="format" :options="formatOptions" label="Format:" label-width="70px" />

      <n-form-item v-if="isLossyFormat" label="Quality:" :show-feedback="false" label-width="70px" label-placement="left" mt-3>
        <n-slider v-model:value="quality" :step="1" :min="1" :max="100" :format-tooltip="(value: number) => `${value}%`" />
        <div ml-3 w-12 text-right>
          {{ quality }}%
        </div>
      </n-form-item>
    </c-card>

    <div v-if="images.length > 0" mt-5 flex items-center justify-between>
      <div op-60>
        {{ images.length }} {{ images.length === 1 ? 'image' : 'images' }} pasted in this session
      </div>
      <c-button variant="text" @click="clearImages">
        <span mr-2><icon-mdi-delete-sweep-outline /></span>
        Clear all
      </c-button>
    </div>

    <c-card v-for="image in images" :key="image.id" mt-3 data-test-id="pasted-image">
      <div class="preview" flex justify-center>
        <img v-if="image.outputUrl" :src="image.outputUrl" :alt="image.fileName" max-h-400px max-w-full>
      </div>

      <div mt-3 flex flex-wrap gap-x-4 gap-y-1 op-80>
        <span>{{ image.width }} × {{ image.height }} px</span>
        <span>Original: {{ getTypeLabel(image.source.type) }}, {{ formatBytes(image.source.size) }}</span>
        <span v-if="image.output" data-test-id="output-info">
          Output: {{ getTypeLabel(image.output.type) }}, {{ formatBytes(image.output.size) }}
          <template v-if="image.output !== image.source">
            ({{ formatSizeDelta({ originalSize: image.source.size, outputSize: image.output.size }) }})
          </template>
        </span>
      </div>

      <c-alert v-if="image.conversionError" type="error" mt-3>
        {{ image.conversionError }}
      </c-alert>

      <c-alert v-else-if="image.output && image.outputFormat && isFallbackOutput({ output: image.output, format: image.outputFormat })" type="warning" mt-3>
        Your browser cannot encode {{ outputFormats[image.outputFormat].label }}. The image downloads as {{ getTypeLabel(image.output.type) }}.
      </c-alert>

      <div mt-3 flex flex-wrap items-center gap-2>
        <c-input-text
          v-model:value="image.fileName"
          :placeholder="image.defaultFileName"
          test-id="file-name"
          min-w-200px flex-1
        />
        <div op-60>
          .{{ getOutputExtension(image) }}
        </div>
      </div>

      <div mt-3 flex flex-wrap justify-end gap-2>
        <c-button :disabled="!image.output" @click="copyDataUrl(image)">
          Copy as base64
        </c-button>
        <c-button @click="copyImage(image)">
          <span mr-2><icon-mdi-content-copy /></span>
          Copy image
        </c-button>
        <c-button type="primary" :disabled="!image.outputUrl" data-test-id="download" @click="downloadImage(image)">
          <span mr-2><icon-mdi-download /></span>
          Download
        </c-button>
        <c-tooltip tooltip="Remove from the list">
          <c-button circle variant="text" aria-label="Remove" @click="removeImage(image)">
            <icon-mdi-delete-outline />
          </c-button>
        </c-tooltip>
      </div>
    </c-card>
  </div>
</template>

<style lang="less" scoped>
// A checkerboard behind the preview makes transparent areas visible.
.preview img {
  background-image: conic-gradient(rgba(128, 128, 128, 0.2) 25%, transparent 0 50%, rgba(128, 128, 128, 0.2) 0 75%, transparent 0);
  background-size: 16px 16px;
}
</style>
