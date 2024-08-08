<script setup lang="ts">
import type { Colord } from 'colord';
import { colord, extend } from 'colord';
import _ from 'lodash';
import cmykPlugin from 'colord/plugins/cmyk';
import hwbPlugin from 'colord/plugins/hwb';
import namesPlugin from 'colord/plugins/names';
import lchPlugin from 'colord/plugins/lch';
import xyzPlugin from 'colord/plugins/xyz';
import labPlugin from 'colord/plugins/lab';
import { buildColorFormat } from './color-converter.models';

extend([cmykPlugin, hwbPlugin, namesPlugin, lchPlugin, xyzPlugin, labPlugin]);

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
  lab: buildColorFormat({
    label: 'lab',
    format: (v: Colord) => JSON.stringify(v.toLab()),
    placeholder: 'e.g. { l: 14.89, a: 5.77, b: 14.41, alpha: 0.5 }',
    parse: value => colord(JSON.parse(value)),
  }),
  xyz: buildColorFormat({
    label: 'xyz',
    format: (v: Colord) => JSON.stringify(v.toXyz()),
    placeholder: 'e.g. { x: 95.047, y: 100, z: 108.883, a: 1 }',
    parse: value => colord(JSON.parse(value)),
  }),
  name: buildColorFormat({
    label: 'name',
    format: (v: Colord) => v.toName({ closest: true }) ?? 'Unknown',
    placeholder: 'e.g. red',
  }),
};

const saturation = ref(0);
const brightness = ref(0);
const grayscale = ref(false);
const invert = ref(false);

let lastColor = colord('#1ea54c');
watch([saturation, brightness, grayscale, invert],
  () => updateColorValue(lastColor),
);

updateColorValue(lastColor);

function updateColorValue(value: Colord | undefined, omitLabel?: string) {
  if (value === undefined) {
    return;
  }

  if (!value.isValid()) {
    return;
  }

  lastColor = value;

  let correctedValue = value;
  if (grayscale.value) {
    correctedValue = correctedValue.grayscale();
  }
  if (invert.value) {
    correctedValue = correctedValue.invert();
  }

  const saturationFloat = saturation.value / 100.0;
  if (saturationFloat > 0) {
    correctedValue = correctedValue.saturate(saturationFloat);
  }
  else if (saturationFloat < 0) {
    correctedValue = correctedValue.desaturate(-saturationFloat);
  }

  const brightnessFloat = brightness.value / 100.0;
  if (brightnessFloat > 0) {
    correctedValue = correctedValue.lighten(brightnessFloat);
  }
  else if (brightnessFloat < 0) {
    correctedValue = correctedValue.darken(-brightnessFloat);
  }

  _.forEach(formats, ({ value: valueRef, format }, key) => {
    if (key !== omitLabel) {
      valueRef.value = format(correctedValue);
    }
  });
}
</script>

<template>
  <div>
    <c-card title="Transformations">
      <n-form-item label="Saturation" label-placement="left">
        <n-slider v-model:value="saturation" :step="1" :min="-100" :max="100" mr-2 />
        <n-input-number v-model:value="saturation" size="small" />
      </n-form-item>

      <n-form-item label="Brightness" label-placement="left">
        <n-slider v-model:value="brightness" :step="1" :min="-100" :max="100" mr-2 />
        <n-input-number v-model:value="brightness" size="small" />
      </n-form-item>

      <n-space>
        <n-form-item label="Grayscale" label-placement="left">
          <n-checkbox v-model:checked="grayscale" mr-2 />
        </n-form-item>

        <n-form-item label="Invert" label-placement="left">
          <n-checkbox v-model:checked="invert" mr-2 />
        </n-form-item>
      </n-space>
    </c-card>
    <c-card>
      <template v-for="({ label, parse, placeholder, validation, type }, key) in formats" :key="key">
        <input-copyable
          v-if="type === 'text'"
          v-model:value="formats[key].value.value"
          :test-id="`input-${key}`"
          :label="`${label}:`"
          label-position="left"
          label-width="100px"
          label-align="right"
          :placeholder="placeholder"
          :validation="validation"
          raw-text
          clearable
          mt-2
          @update:value="(v:string) => updateColorValue(parse(v), key)"
        />

        <n-form-item v-else-if="type === 'color-picker'" :label="`${label}:`" label-width="100" label-placement="left" :show-feedback="false">
          <n-color-picker
            v-model:value="formats[key].value.value"
            placement="bottom-end"
            @update:value="(v:string) => updateColorValue(parse(v), key)"
          />
        </n-form-item>
      </template>
    </c-card>
  </div>
</template>
