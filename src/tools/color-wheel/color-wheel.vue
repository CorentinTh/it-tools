<script setup lang="ts">
import { colord, extend } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';

import { computed, ref, watch } from 'vue';
import { useDebounce } from '@vueuse/core';
import type { Harmony, HarmonyType } from 'vue-color-wheel';
import { VueColorWheel } from 'vue-color-wheel';

extend([a11yPlugin]);

const wheelColor = useDebounce(ref('#40ffff')); // { hue: 0, saturation: 0.68, value: 1 }
const colors = ref<Array<Harmony>>([]);
const currentType = ref<HarmonyType>('analogous');
const isColorReadable = ref(false);
const isDarkTheme = useDark();

const harmonyTypes: { type: HarmonyType; label: string }[] = [
  { type: 'monochromatic', label: 'Monochromatic' },
  { type: 'complementary', label: 'Complementary' },
  { type: 'analogous', label: 'Analogous' },
  { type: 'triad', label: 'Triad' },
  { type: 'split', label: 'Split' },
  { type: 'compound', label: 'Compound' },
  { type: 'tetradic', label: 'Tetradic' },
  { type: 'square', label: 'Square' },
  { type: 'doubleSplit', label: 'Double Split' },
];

const colorList = computed(() => {
  return colors.value.map(item => colord(item.rgb).toHex());
});

function handleChangeGradient(harmonyColors: Harmony[]) {
  const newColors = harmonyColors.map(color => colord(color.rgb).toHex());

  const [base, secondary] = newColors;

  const rootEl = document.documentElement;

  // change the colors variables
  harmonyColors.map((color, index) => {
    const { r, g, b } = colord(color.rgb).toRgb();
    rootEl.style.setProperty(`--color${index + 1}`, `${r}, ${g}, ${b}`);
    return null;
  });
  const secondaryRgb = colord(secondary).toRgb();
  rootEl.style.setProperty(
    '--color-interactive',
    `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`,
  );
  if (newColors.length === 3) {
    const lightColor = colord(base).saturate(0.25).toRgb();
    const darkColor = colord(base).desaturate(0.25).toRgb();
    rootEl.style.setProperty(
      '--color4',
      `${lightColor.r}, ${lightColor.g}, ${lightColor.b}`,
    );
    rootEl.style.setProperty(
      '--color5',
      `${darkColor.r}, ${darkColor.g}, ${darkColor.b}`,
    );
  }

  isColorReadable.value = colord(base).isReadable(
    isDarkTheme.value ? '#fff' : '#000',
    { level: 'AAA' },
  );
}

function handleChangeColors(harmonyColors: Harmony[]) {
  colors.value = harmonyColors;
}

watch(
  () => colors.value,
  (newColors) => {
    handleChangeGradient(newColors);
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div style="max-width: 600px">
    <c-card title="Pick a color" mb-2>
      <n-color-picker :value="wheelColor" :show-alpha="false" />
      <div
        :style="{ backgroundColor: wheelColor }"
      />
    </c-card>

    <c-card title="Pick a palette type" mb-2>
      <n-radio-group v-model:value="currentType" name="radiogroup">
        <n-space>
          <n-radio
            v-for="v in harmonyTypes"
            :key="v.type"
            :value="v.type"
            :label="v.label"
          />
        </n-space>
      </n-radio-group>
    </c-card>
    <c-card title="Wheel" mb-2 style="text-align: center">
      <div style="display: inline-block">
        <VueColorWheel
          v-model:color="wheelColor"
          wheel="aurora"
          :harmony="currentType"
          :radius="160"
          :default-color="wheelColor"
          :show-brightness="false"
          @change="handleChangeColors"
        />
      </div>
    </c-card>
    <div
      v-for="(color, i) in colorList"
      :key="i"
      mt-1 flex items-center justify-center gap-1
    >
      <div
        p-1
        :style="{
          backgroundColor: `${color}`,
          color: isColorReadable ? '#000' : '#fff',
        }"
      >
        {{ color }}
      </div>
      <input-copyable :value="color" />
    </div>
  </div>
</template>
