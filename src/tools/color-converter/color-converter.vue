<script setup lang="ts">
import type { Colord } from 'colord';
import { colord, extend } from 'colord';
import _ from 'lodash';
import cmykPlugin from 'colord/plugins/cmyk';
import hwbPlugin from 'colord/plugins/hwb';
import namesPlugin from 'colord/plugins/names';
import lchPlugin from 'colord/plugins/lch';
import { buildColorFormat, formatOklch, mapOklchToSrgb, oklchToSrgb, parseOklch, srgbToOklch } from './color-converter.models';
import CColorPicker from '@/ui/c-color-picker/c-color-picker.vue';

extend([cmykPlugin, hwbPlugin, namesPlugin, lchPlugin]);

const formats = {
  picker: buildColorFormat({
    label: 'color picker',
    format: (v: Colord) => v.toHex(),
    type: 'color-picker',
  }),
  hex: buildColorFormat({
    label: 'hex',
    format: (v: Colord) => v.toHex(),
    placeholder: 'e.g. #ff0000',
  }),
  rgb: buildColorFormat({
    label: 'rgb',
    format: (v: Colord) => v.toRgbString(),
    placeholder: 'e.g. rgb(255, 0, 0)',
  }),
  hsl: buildColorFormat({
    label: 'hsl',
    format: (v: Colord) => v.toHslString(),
    placeholder: 'e.g. hsl(0, 100%, 50%)',
  }),
  hwb: buildColorFormat({
    label: 'hwb',
    format: (v: Colord) => v.toHwbString(),
    placeholder: 'e.g. hwb(0, 0%, 0%)',
  }),
  lch: buildColorFormat({
    label: 'lch',
    format: (v: Colord) => v.toLchString(),
    placeholder: 'e.g. lch(53.24, 104.55, 40.85)',
  }),
  cmyk: buildColorFormat({
    label: 'cmyk',
    format: (v: Colord) => v.toCmykString(),
    placeholder: 'e.g. cmyk(0, 100%, 100%, 0)',
  }),
  name: buildColorFormat({
    label: 'name',
    format: (v: Colord) => v.toName({ closest: true }) ?? 'Unknown',
    placeholder: 'e.g. red',
  }),
};

const oklchValue = ref('oklch(62.8% 0.2577 142.5)');
const oklchError = ref('');
const gamutStatus = ref('');
const mappedOklch = ref('');

updateColorValue(colord('#1ea54c'));

function updateColorValue(value: Colord | undefined, omitLabel?: string) {
  if (value === undefined) {
    return;
  }

  if (!value.isValid()) {
    return;
  }

  _.forEach(formats, ({ value: valueRef, format }, key) => {
    if (key !== omitLabel) {
      valueRef.value = format(value);
    }
  });
  if (omitLabel !== 'oklch') {
    const rgb = value.toRgb();
    oklchValue.value = formatOklch(srgbToOklch({ r: rgb.r, g: rgb.g, b: rgb.b, alpha: rgb.a }));
    gamutStatus.value = 'The converted color is inside sRGB.';
    mappedOklch.value = oklchValue.value;
    oklchError.value = '';
  }
}

function updateFromOklch(value: string) {
  try {
    const parsed = parseOklch(value);
    const direct = oklchToSrgb(parsed);
    const mapped = mapOklchToSrgb(parsed);
    const rgb = mapped.rgb;
    updateColorValue(colord({ r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b), a: rgb.alpha }), 'oklch');
    mappedOklch.value = formatOklch(mapped.color);
    gamutStatus.value = direct.inGamut
      ? 'Inside sRGB; no gamut mapping was needed.'
      : 'Outside sRGB; the other fields use bounded constant-lightness/hue chroma reduction. The original OKLCH value is preserved above.';
    oklchError.value = '';
  }
  catch (caught) {
    oklchError.value = caught instanceof Error ? caught.message : 'Invalid OKLCH value.';
    gamutStatus.value = '';
  }
}
</script>

<template>
  <c-card class="c-form-layout">
    <div grid grid-cols-1 gap-3 md:grid-cols-2>
      <template v-for="({ label, parse, placeholder, validation, type }, key) in formats" :key="key">
        <input-copyable
          v-if="type === 'text'"
          v-model:value="formats[key].value.value"
          :test-id="`input-${key}`"
          :label="label"
          :placeholder="placeholder"
          :validation="validation"
          raw-text
          clearable
          @update:value="(v:string) => updateColorValue(parse(v), key)"
        />

        <c-field v-else-if="type === 'color-picker'" :label="label">
          <CColorPicker
            v-model:value="formats[key].value.value"
            :aria-label="label"
            placement="bottom-end"
            @update:value="(v:string) => updateColorValue(parse(v), key)"
          />
        </c-field>
      </template>
    </div>
    <c-field mt-4 label="CSS OKLCH" label-for="color-converter-oklch">
      <c-input-text id="color-converter-oklch" v-model:value="oklchValue" raw-text placeholder="oklch(62.8% 0.2577 29.23)" data-test-id="input-oklch" @update:value="updateFromOklch" />
      <p v-if="oklchError" mt-1 text-sm text-red role="alert">
        {{ oklchError }}
      </p>
      <p v-else mt-1 text-sm op-75 data-test-id="oklch-gamut-status">
        {{ gamutStatus }}
      </p>
    </c-field>
    <c-input-text v-if="mappedOklch && mappedOklch !== oklchValue" :value="mappedOklch" label="sRGB gamut-mapped OKLCH" raw-text readonly mt-3 />
    <c-alert mt-4 title="OKLCH gamut guidance">
      Conversion follows CSS Color 4 Oklab matrices. For an out-of-sRGB color this tool reduces chroma with fixed lightness and hue until it enters sRGB; it does not claim the specification's Local MINDE gamut-mapping algorithm or predict a particular display profile.
    </c-alert>
  </c-card>
</template>
