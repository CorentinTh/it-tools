<script setup lang="ts">
import { checkContrast, formatRgb, parseColor } from './color-contrast-checker.models';

const foregroundInput = useStorage('color-contrast:fg', '#1e88e5');
const backgroundInput = useStorage('color-contrast:bg', '#ffffff');

const foreground = computed(() => parseColor(foregroundInput.value));
const background = computed(() => parseColor(backgroundInput.value));

const inputsValid = computed(() => Boolean(foreground.value && background.value));

const result = computed(() =>
  inputsValid.value ? checkContrast(foreground.value!, background.value!) : undefined,
);

const levels = computed(() =>
  result.value
    ? [
        { label: 'AA · normal text', pass: result.value.aaNormal, threshold: '4.5:1' },
        { label: 'AAA · normal text', pass: result.value.aaaNormal, threshold: '7:1' },
        { label: 'AA · large text', pass: result.value.aaLarge, threshold: '3:1' },
        { label: 'AAA · large text', pass: result.value.aaaLarge, threshold: '4.5:1' },
        { label: 'UI components & graphics', pass: result.value.uiComponents, threshold: '3:1' },
      ]
    : [],
);

function hexFor(color: { r: number; g: number; b: number }): string {
  return `#${[color.r, color.g, color.b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
}
</script>

<template>
  <div style="max-width: 640px; margin: 0 auto;">
    <c-card mb-3>
      <n-grid cols="2" x-gap="12">
        <n-gi>
          <c-input-text
            v-model:value="foregroundInput"
            label="Foreground (text)"
            placeholder="#1e88e5 or rgb(30, 136, 229)"
            mb-2
          />
        </n-gi>
        <n-gi>
          <c-input-text
            v-model:value="backgroundInput"
            label="Background"
            placeholder="#ffffff"
            mb-2
          />
        </n-gi>
      </n-grid>

      <n-alert v-if="!inputsValid" type="error">
        Use a valid #hex or rgb() color.
      </n-alert>

      <div
        v-else-if="result"
        class="preview"
        :style="{ background: formatRgb(background!), color: formatRgb(foreground!) }"
      >
        Sample text at 16px and <span style="font-size: 24px">24px</span>
      </div>
    </c-card>

    <c-card v-if="result">
      <div mb-3 flex items-baseline justify-between>
        <span text-3xl font-bold data-test-id="contrast-ratio">{{ result.ratio }}:1</span>
        <span text-sm op-70>{{ formatRgb(foreground!) }} on {{ formatRgb(background!) }}</span>
      </div>

      <div v-for="level of levels" :key="level.label" flex items-center justify-between py-1>
        <span>{{ level.label }}</span>
        <span flex items-center gap-2>
          <span text-xs op-60>{{ level.threshold }}</span>
          <n-tag :type="level.pass ? 'success' : 'error'" size="small">
            {{ level.pass ? 'Pass' : 'Fail' }}
          </n-tag>
        </span>
      </div>

      <div mt-2 text-xs op-60>
        Lighter: {{ hexFor(result.lighter) }} · Darker: {{ hexFor(result.darker) }} · WCAG 2.1
      </div>
    </c-card>
  </div>
</template>

<style scoped lang="less">
.preview {
  padding: 16px;
  border-radius: 6px;
  border: 1px solid rgba(128, 128, 128, 0.3);
}
</style>
