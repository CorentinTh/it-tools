<script setup lang="ts">
import JSZip from 'jszip';
import {
  ICON_PRESETS,
  createResizedIcons,
  createWebAppManifest,
  getPresetSizes,
  loadImageFromFile,
  normalizeSizes,
  sanitizeBaseName,
} from './icon-generator.service';
import type { GeneratedIcon, IconFitMode, IconPresetKey } from './icon-generator.service';

const { t } = useI18n();

const selectedSizesModel = ref<number[]>([]);
const customSizeInput = ref<number | null>(null);
const fitMode = ref<IconFitMode>('cover');
const baseName = ref('icon');
const includeManifest = ref(false);

const sourceFile = ref<File | null>(null);
const sourcePreviewUrl = ref('');

const generatedIcons = ref<GeneratedIcon[]>([]);
const isGenerating = ref(false);

const availableSizes = computed(() =>
  normalizeSizes([...ICON_PRESETS.flatMap(preset => preset.sizes), ...selectedSizesModel.value]),
);
const selectedSizes = computed(() => normalizeSizes(selectedSizesModel.value));
const isPwaPresetApplied = computed(() => isPresetApplied('pwa'));

const canGenerate = computed(() => sourceFile.value !== null && selectedSizes.value.length > 0 && !isGenerating.value);

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Unable to read image file.'));
    reader.readAsDataURL(file);
  });
}

async function onUpload(file: File) {
  sourceFile.value = file;
  sourcePreviewUrl.value = await readFileAsDataUrl(file);
  generatedIcons.value = [];
}

function addCustomSize() {
  if (customSizeInput.value == null) {
    return;
  }

  const size = Math.floor(customSizeInput.value);
  if (size <= 0) {
    return;
  }

  selectedSizesModel.value = normalizeSizes([...selectedSizesModel.value, size]);
  customSizeInput.value = null;
}

function applyPreset(presetKey: IconPresetKey) {
  const sizes = getPresetSizes([presetKey]);
  selectedSizesModel.value = normalizeSizes([...selectedSizesModel.value, ...sizes]);
}

function isPresetApplied(presetKey: IconPresetKey) {
  const sizes = getPresetSizes([presetKey]);
  return sizes.every(size => selectedSizesModel.value.includes(size));
}

function clearPresetSizes() {
  const presetSizes = normalizeSizes(ICON_PRESETS.flatMap(preset => preset.sizes));
  selectedSizesModel.value = selectedSizesModel.value.filter(size => !presetSizes.includes(size));
  includeManifest.value = false;
}

function getPresetLabel(presetKey: IconPresetKey) {
  return t(`tools.icon-generator.presetLabels.${presetKey}`);
}

async function generateIcons() {
  if (!sourceFile.value) {
    return;
  }

  isGenerating.value = true;
  try {
    const image = await loadImageFromFile(sourceFile.value);
    generatedIcons.value = createResizedIcons({
      image,
      sizes: selectedSizes.value,
      fitMode: fitMode.value,
      baseName: baseName.value,
    });
  }
  finally {
    isGenerating.value = false;
  }
}

function downloadIcon(icon: GeneratedIcon) {
  const link = document.createElement('a');
  link.href = icon.dataUrl;
  link.download = icon.filename;
  link.click();
}

async function downloadIconsAsZip() {
  const zip = new JSZip();

  generatedIcons.value.forEach((icon) => {
    const [, base64Content] = icon.dataUrl.split(',');
    if (!base64Content) {
      return;
    }
    zip.file(icon.filename, base64Content, { base64: true });
  });

  if (includeManifest.value && isPwaPresetApplied.value) {
    const appName = sanitizeBaseName(baseName.value);
    zip.file('manifest.json', createWebAppManifest({
      appName,
      icons: generatedIcons.value.map(icon => ({ filename: icon.filename, size: icon.size })),
    }));
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const zipUrl = URL.createObjectURL(zipBlob);
  const link = document.createElement('a');
  link.href = zipUrl;
  link.download = `${sanitizeBaseName(baseName.value)}-icons.zip`;
  link.click();
  URL.revokeObjectURL(zipUrl);
}

watch(isPwaPresetApplied, (pwaEnabled) => {
  if (!pwaEnabled) {
    includeManifest.value = false;
  }
});
</script>

<template>
  <div>
    <c-card :title="t('tools.icon-generator.presets')">
      <n-space vertical :size="12">
        <div class="flex flex-wrap gap-2">
          <c-button
            v-for="preset in ICON_PRESETS"
            :key="preset.key"
            :type="isPresetApplied(preset.key) ? 'primary' : 'default'"
            @click="applyPreset(preset.key)"
          >
            {{ getPresetLabel(preset.key) }}
          </c-button>
          <c-button secondary @click="clearPresetSizes">
            {{ t('tools.icon-generator.clearPresetSizes') }}
          </c-button>
        </div>

        <c-buttons-select
          v-model:value="fitMode"
          :label="`${t('tools.icon-generator.fitMode')}:`"
          label-position="left"
          :options="[
            { label: t('tools.icon-generator.cover'), value: 'cover' },
            { label: t('tools.icon-generator.contain'), value: 'contain' },
          ]"
        />

        <div class="flex items-center gap-2">
          <n-input-number v-model:value="customSizeInput" :min="16" :max="2048" placeholder="256" />
          <c-button @click="addCustomSize">
            {{ t('tools.icon-generator.addSize') }}
          </c-button>
        </div>

        <c-input-text
          v-model:value="baseName"
          :label="`${t('tools.icon-generator.baseName')}:`"
          placeholder="icon"
          label-position="left"
        />
        <n-text depth="3">
          {{ t('tools.icon-generator.baseNameHint') }}
        </n-text>

        <n-checkbox v-model:checked="includeManifest" :disabled="!isPwaPresetApplied">
          {{ t('tools.icon-generator.includeManifest') }}
        </n-checkbox>

        <n-checkbox-group v-model:value="selectedSizesModel">
          <n-space>
            <n-checkbox
              v-for="size in availableSizes"
              :key="size"
              :value="size"
              :label="`${size}x${size}`"
            />
          </n-space>
        </n-checkbox-group>

        <n-text depth="3">
          {{ t('tools.icon-generator.selectedSizes') }}: {{ selectedSizes.join(', ') || '-' }}
        </n-text>
      </n-space>
    </c-card>

    <c-card>
      <c-file-upload
        :title="t('tools.icon-generator.uploadTitle')"
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon,image/vnd.microsoft.icon"
        @file-upload="onUpload"
      />

      <div mt-4 flex flex-col items-center gap-3>
        <n-image v-if="sourcePreviewUrl" :src="sourcePreviewUrl" width="180" />
        <n-text v-else depth="3">
          {{ t('tools.icon-generator.noImage') }}
        </n-text>

        <div flex flex-wrap justify-center gap-2>
          <c-button :disabled="!canGenerate" @click="generateIcons">
            {{ t('tools.icon-generator.generate') }}
          </c-button>
          <c-button :disabled="generatedIcons.length === 0" secondary @click="downloadIconsAsZip">
            {{ t('tools.icon-generator.downloadZip') }}
          </c-button>
        </div>
      </div>
    </c-card>

    <c-card v-if="generatedIcons.length > 0" :title="`${t('tools.icon-generator.output')} (${generatedIcons.length})`">
      <n-grid cols="1 520:2 760:3" :x-gap="12" :y-gap="12">
        <n-gi v-for="icon in generatedIcons" :key="icon.filename">
          <div class="generated-item">
            <n-image :src="icon.dataUrl" width="96" preview-disabled />
            <div class="text-center">
              <n-text strong>
                {{ icon.size }}x{{ icon.size }}
              </n-text>
            </div>
            <c-button size="small" @click="downloadIcon(icon)">
              {{ t('tools.icon-generator.download') }}
            </c-button>
          </div>
        </n-gi>
      </n-grid>
    </c-card>
  </div>
</template>

<style lang="less" scoped>
.generated-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid var(--c-border-color);
  border-radius: 8px;
}
</style>
