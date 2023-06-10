<script setup lang="ts">
import { colord, extend } from 'colord';

import cmykPlugin from 'colord/plugins/cmyk';
import hwbPlugin from 'colord/plugins/hwb';
import namesPlugin from 'colord/plugins/names';
import lchPlugin from 'colord/plugins/lch';
import InputCopyable from '../../components/InputCopyable.vue';

extend([cmykPlugin, hwbPlugin, namesPlugin, lchPlugin]);

const name = ref('');
const hex = ref('#1ea54cff');
const rgb = ref('');
const hsl = ref('');
const hwb = ref('');
const cmyk = ref('');
const lch = ref('');

function onInputUpdated(value: string, omit: string) {
  try {
    const color = colord(value);

    if (omit !== 'name') {
      name.value = color.toName({ closest: true }) ?? '';
    }
    if (omit !== 'hex') {
      hex.value = color.toHex();
    }
    if (omit !== 'rgb') {
      rgb.value = color.toRgbString();
    }
    if (omit !== 'hsl') {
      hsl.value = color.toHslString();
    }
    if (omit !== 'hwb') {
      hwb.value = color.toHwbString();
    }
    if (omit !== 'cmyk') {
      cmyk.value = color.toCmykString();
    }
    if (omit !== 'lch') {
      lch.value = color.toLchString();
    }
  }
  catch {
    //
  }
}

onInputUpdated(hex.value, 'hex');
</script>

<template>
  <c-card>
    <n-form label-width="100" label-placement="left">
      <n-form-item label="color picker:">
        <n-color-picker
          v-model:value="hex"
          placement="bottom-end"
          @update:value="(v: string) => onInputUpdated(v, 'hex')"
        />
      </n-form-item>
      <n-form-item label="color name:">
        <InputCopyable v-model:value="name" @update:value="(v: string) => onInputUpdated(v, 'name')" />
      </n-form-item>
      <n-form-item label="hex:">
        <InputCopyable v-model:value="hex" @update:value="(v: string) => onInputUpdated(v, 'hex')" />
      </n-form-item>
      <n-form-item label="rgb:">
        <InputCopyable v-model:value="rgb" @update:value="(v: string) => onInputUpdated(v, 'rgb')" />
      </n-form-item>
      <n-form-item label="hsl:">
        <InputCopyable v-model:value="hsl" @update:value="(v: string) => onInputUpdated(v, 'hsl')" />
      </n-form-item>
      <n-form-item label="hwb:">
        <InputCopyable v-model:value="hwb" @update:value="(v: string) => onInputUpdated(v, 'hwb')" />
      </n-form-item>
      <n-form-item label="lch:">
        <InputCopyable v-model:value="lch" @update:value="(v: string) => onInputUpdated(v, 'lch')" />
      </n-form-item>
      <n-form-item label="cmyk:">
        <InputCopyable v-model:value="cmyk" @update:value="(v: string) => onInputUpdated(v, 'cmyk')" />
      </n-form-item>
    </n-form>
  </c-card>
</template>
