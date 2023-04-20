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
        <input-copyable v-model:value="name" :on-input="(v: string) => onInputUpdated(v, 'name')" />
      </n-form-item>
      <n-form-item label="hex:">
        <input-copyable v-model:value="hex" :on-input="(v: string) => onInputUpdated(v, 'hex')" />
      </n-form-item>
      <n-form-item label="rgb:">
        <input-copyable v-model:value="rgb" :on-input="(v: string) => onInputUpdated(v, 'rgb')" />
      </n-form-item>
      <n-form-item label="hsl:">
        <input-copyable v-model:value="hsl" :on-input="(v: string) => onInputUpdated(v, 'hsl')" />
      </n-form-item>
      <n-form-item label="hwb:">
        <input-copyable v-model:value="hwb" :on-input="(v: string) => onInputUpdated(v, 'hwb')" />
      </n-form-item>
      <n-form-item label="lch:">
        <input-copyable v-model:value="lch" :on-input="(v: string) => onInputUpdated(v, 'lch')" />
      </n-form-item>
      <n-form-item label="cmyk:">
        <input-copyable v-model:value="cmyk" :on-input="(v: string) => onInputUpdated(v, 'cmyk')" />
      </n-form-item>
    </n-form>
  </c-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
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
  const color = colord(value);

  if (omit !== 'name') name.value = color.toName({ closest: true }) ?? '';
  if (omit !== 'hex') hex.value = color.toHex();
  if (omit !== 'rgb') rgb.value = color.toRgbString();
  if (omit !== 'hsl') hsl.value = color.toHslString();
  if (omit !== 'hwb') hwb.value = color.toHwbString();
  if (omit !== 'cmyk') cmyk.value = color.toCmykString();
  if (omit !== 'lch') lch.value = color.toLchString();
}

onInputUpdated(hex.value, 'hex');
</script>
