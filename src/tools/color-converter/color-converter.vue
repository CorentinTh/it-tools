<template>
  <n-card>
    <n-form label-width="100" label-placement="left">
      <n-form-item label="color picker:">
        <n-color-picker v-model:value="hex" @update:value="(v: string) => onInputUpdated(v, 'hex')"
          placement="bottom-end" />
      </n-form-item>
      <n-form-item label="color name:">
        <n-input v-model:value="name" :on-input="(v: string) => onInputUpdated(v, 'name')" />
      </n-form-item>
      <n-form-item label="hex:">
        <n-input v-model:value="hex" :on-input="(v: string) => onInputUpdated(v, 'hex')" />
      </n-form-item>
      <n-form-item label="rgb:">
        <n-input v-model:value="rgb" :on-input="(v: string) => onInputUpdated(v, 'rgb')" />
      </n-form-item>
      <n-form-item label="hsl:">
        <n-input v-model:value="hsl" :on-input="(v: string) => onInputUpdated(v, 'hsl')" />
      </n-form-item>
      <n-form-item label="hwb:">
        <n-input v-model:value="hwb" :on-input="(v: string) => onInputUpdated(v, 'hwb')" />
      </n-form-item>
      <n-form-item label="cmyk:">
        <n-input v-model:value="cmyk" :on-input="(v: string) => onInputUpdated(v, 'cmyk')" />
      </n-form-item>
    </n-form>
  </n-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { colord, extend } from "colord";

import cmykPlugin from "colord/plugins/cmyk";
import hwbPlugin from "colord/plugins/hwb";
import namesPlugin from "colord/plugins/names";

extend([cmykPlugin, hwbPlugin, namesPlugin]);

const name = ref('')
const hex = ref('#1ea54cff')
const rgb = ref('')
const hsl = ref('')
const hwb = ref('')
const cmyk = ref('')

function onInputUpdated(value: string, omit: string) {
  const color = colord(value);

  omit !== 'name' && (name.value = color.toName({ closest: true }) ?? '');
  omit !== 'hex' && (hex.value = color.toHex());
  omit !== 'rgb' && (rgb.value = color.toRgbString());
  omit !== 'hsl' && (hsl.value = color.toHslString());
  omit !== 'hwb' && (hwb.value = color.toHwbString());
  omit !== 'cmyk' && (cmyk.value = color.toCmykString());
}

onInputUpdated(hex.value, 'hex')

</script>

<style lang="less" scoped>
</style>