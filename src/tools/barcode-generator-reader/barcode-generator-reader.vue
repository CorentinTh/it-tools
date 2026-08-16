<script setup lang="ts">
import {
  type BarcodeFormat,
  encodeBarcode,
  renderBarcodeSvg,
} from './barcode-generator.service';
import {
  BARCODE_MAX_FILE_BYTES,
  type BarcodeReaderResult,
  getBarcodeDetectorFormats,
  readBarcodesFromFile,
} from './barcode-reader.service';
import { downloadTextFile } from '@/composable/downloadText';
import { useCopy } from '@/composable/copy';
import { formatBytes } from '@/utils/convert';

const formatOptions: Array<{ label: string; value: BarcodeFormat }> = [
  { label: 'Code 128', value: 'code128' },
  { label: 'EAN-13', value: 'ean13' },
  { label: 'UPC-A', value: 'upca' },
];
const examples: Record<BarcodeFormat, string> = {
  code128: 'IT-TOOLS-2026',
  ean13: '590123412345',
  upca: '03600029145',
};
const format = ref<BarcodeFormat>('code128');
const value = ref(examples.code128);
const svg = ref('');
const normalizedValue = ref('');
const generatorError = ref('');
const generatedSignature = ref('');
const selectedFile = shallowRef<File>();
const detected = shallowRef<BarcodeReaderResult[]>([]);
const readerFormats = ref<string[]>([]);
const readerStatus = ref('Checking browser barcode support…');
const readerError = ref('');
const isReading = ref(false);

const signature = computed(() => `${format.value}\0${value.value}`);
const generatorIsStale = computed(() => Boolean(svg.value && generatedSignature.value !== signature.value));
const svgDataUrl = computed(() => svg.value ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.value)}` : '');
const detectorAvailable = computed(() => readerFormats.value.length > 0);
const canRead = computed(() => Boolean(
  selectedFile.value
  && selectedFile.value.size > 0
  && selectedFile.value.size <= BARCODE_MAX_FILE_BYTES
  && detectorAvailable.value
  && !isReading.value,
));

watch(format, (nextFormat) => {
  value.value = examples[nextFormat];
  generatorError.value = '';
});
watch(value, () => {
  generatorError.value = '';
});

function generate() {
  generatorError.value = '';
  try {
    const encoded = encodeBarcode(value.value, format.value);
    svg.value = renderBarcodeSvg(encoded);
    normalizedValue.value = encoded.normalizedValue;
    generatedSignature.value = signature.value;
  }
  catch (caught) {
    generatorError.value = caught instanceof Error ? caught.message : 'The barcode could not be generated.';
  }
}

function downloadSvg() {
  downloadTextFile({ content: svg.value, filename: `${format.value}-barcode.svg` });
}

function selectFile(file: File) {
  selectedFile.value = file;
  detected.value = [];
  readerError.value = '';
  if (!file.type.startsWith('image/')) {
    readerStatus.value = 'Select an image file.';
  }
  else if (file.size < 1 || file.size > BARCODE_MAX_FILE_BYTES) {
    readerStatus.value = `Image must be between 1 byte and ${formatBytes(BARCODE_MAX_FILE_BYTES)}.`;
  }
  else {
    readerStatus.value = 'Image selected. Choose Read barcodes to process it locally.';
  }
}

async function readFile() {
  const file = selectedFile.value;
  if (!file || !canRead.value) {
    return;
  }
  isReading.value = true;
  readerError.value = '';
  readerStatus.value = 'Reading barcodes locally with the browser image detector…';
  try {
    detected.value = await readBarcodesFromFile(file, readerFormats.value);
    readerStatus.value = detected.value.length === 0
      ? 'No supported barcode was found in this image.'
      : `Found ${detected.value.length} barcode${detected.value.length === 1 ? '' : 's'}.`;
  }
  catch (caught) {
    readerError.value = caught instanceof Error ? caught.message : 'The image could not be scanned.';
    readerStatus.value = 'Barcode reading failed.';
  }
  finally {
    isReading.value = false;
  }
}

const { copy } = useCopy({ createToast: true });
onMounted(async () => {
  readerFormats.value = await getBarcodeDetectorFormats();
  readerStatus.value = readerFormats.value.length > 0
    ? `Reader available for: ${readerFormats.value.join(', ')}.`
    : 'BarcodeDetector is not available in this browser. Barcode generation still works.';
});

generate();
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-card class="c-tool-panel" title="Generate barcode">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-select v-model:value="format" label="Format" label-position="top" :options="formatOptions" />
        <c-input-text
          v-model:value="value"
          label="Value"
          :maxlength="120"
          test-id="barcode-value"

          raw-text clearable monospace
        />
      </div>
      <p mt-3 text-sm op-70>
        EAN-13 and UPC-A accept a value without its checksum and append it automatically. Code 128 uses printable ASCII subset B.
      </p>
      <c-alert v-if="generatorError" title="Invalid barcode value" mt-3 data-test-id="barcode-generator-error">
        {{ generatorError }}
      </c-alert>
    </c-card>
    <c-alert v-if="generatorIsStale" title="Barcode uses the previous value" data-test-id="barcode-stale">
      Select Generate to apply the current value.
    </c-alert>
    <div class="c-task-actions">
      <c-button type="primary" data-test-id="barcode-generate" @click="generate">
        Generate
      </c-button>
      <c-button :disabled="!svg" data-test-id="barcode-download" @click="downloadSvg">
        Download SVG
      </c-button>
    </div>
    <c-card v-if="svg" class="c-tool-panel barcode-preview" title="Barcode preview" data-test-id="barcode-preview">
      <img :src="svgDataUrl" :alt="`Generated ${format} barcode for ${normalizedValue}`">
    </c-card>

    <c-card class="c-tool-panel" title="Read barcodes from a local image">
      <c-file-upload
        accept="image/*"
        :disabled="isReading"
        title="Drop one local barcode image here, or choose a file"
        @file-upload="selectFile"
      />
      <p v-if="selectedFile" mt-3 data-test-id="barcode-file">
        {{ selectedFile.name }} — {{ formatBytes(selectedFile.size) }}
      </p>
      <p mt-3 text-sm op-70>
        The image is processed only after you select Read barcodes. Nothing is uploaded or stored. Reader format support depends on this browser.
      </p>
      <c-alert v-if="!detectorAvailable" title="Reader unavailable" mt-3 data-test-id="barcode-reader-unavailable">
        {{ readerStatus }}
      </c-alert>
      <c-alert v-if="readerError" title="Reader error" mt-3 data-test-id="barcode-reader-error">
        {{ readerError }}
      </c-alert>
      <div class="c-task-actions mt-3">
        <c-button type="primary" :disabled="!canRead" data-test-id="barcode-read" @click="readFile">
          {{ isReading ? 'Reading…' : 'Read barcodes' }}
        </c-button>
      </div>
      <p class="c-task-status mt-3" data-test-id="barcode-reader-status" role="status" aria-live="polite">
        {{ readerStatus }}
      </p>
    </c-card>

    <c-card v-if="detected.length > 0" class="c-tool-panel" title="Detected barcodes" data-test-id="barcode-results">
      <div v-for="(result, index) in detected" :key="`${result.format}-${index}`" class="detected-row">
        <div min-w-0>
          <strong>{{ result.format }}</strong>
          <code>{{ result.rawValue }}</code>
        </div>
        <c-button size="small" @click="copy(result.rawValue, { notificationMessage: 'Barcode value copied' })">
          Copy
        </c-button>
      </div>
    </c-card>
  </div>
</template>

<style scoped>
.barcode-preview {
  overflow-x: auto;
  text-align: center;
}

.barcode-preview img {
  max-width: 100%;
  min-width: min(100%, 320px);
  height: auto;
}

.detected-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ui-space-3);
  padding: var(--ui-space-2) 0;
}

.detected-row > div {
  display: flex;
  flex-direction: column;
}

code {
  overflow-wrap: anywhere;
}
</style>
