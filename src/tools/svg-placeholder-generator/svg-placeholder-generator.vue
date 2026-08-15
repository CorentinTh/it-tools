<script setup lang="ts">
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useCopy } from '@/composable/copy';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import CColorPicker from '@/ui/c-color-picker/c-color-picker.vue';
import CInputNumber from '@/ui/c-input-number/c-input-number.vue';
import CSwitch from '@/ui/c-switch/c-switch.vue';
import { textToBase64 } from '@/utils/base64';

const width = ref(600);
const height = ref(350);
const fontSize = ref(26);
const bgColor = ref('#cccccc');
const fgColor = ref('#333333');
const useExactSize = ref(true);
const customText = ref('');
const svgString = computed(() => {
  const w = width.value;
  const h = height.value;
  const text = customText.value.length > 0 ? customText.value : `${w}x${h}`;
  const size = useExactSize.value ? ` width="${w}" height="${h}"` : '';

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"${size}>
  <rect width="${w}" height="${h}" fill="${bgColor.value}"></rect>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="${fontSize.value}px" fill="${fgColor.value}">${text}</text>   
</svg>
  `.trim();
});
const base64 = computed(() => `data:image/svg+xml;base64,${textToBase64(svgString.value)}`);

const { copy: copySVG } = useCopy({ source: svgString });
const { copy: copyBase64 } = useCopy({ source: base64 });
const { download } = useDownloadFileFromBase64({ source: base64 });
</script>

<template>
  <div class="c-generator-layout">
    <c-card class="c-generator-options">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-field label="Width (px)" label-for="svg-placeholder-width">
          <CInputNumber id="svg-placeholder-width" v-model:value="width" :min="1" placeholder="SVG width" />
        </c-field>
        <c-field label="Height (px)" label-for="svg-placeholder-height">
          <CInputNumber id="svg-placeholder-height" v-model:value="height" :min="1" placeholder="SVG height" />
        </c-field>
        <c-field label="Font size (px)" label-for="svg-placeholder-font-size">
          <CInputNumber id="svg-placeholder-font-size" v-model:value="fontSize" :min="1" placeholder="Font size" />
        </c-field>
        <c-input-text
          v-model:value="customText"
          label="Custom text"
          :placeholder="`Default is ${width}x${height}`"
        />

        <c-field label="Background color">
          <CColorPicker v-model:value="bgColor" aria-label="Background color" :modes="['hex']" />
        </c-field>
        <c-field label="Text color">
          <CColorPicker v-model:value="fgColor" aria-label="Text color" :modes="['hex']" />
        </c-field>

        <CSwitch
          id="svg-placeholder-exact-size"
          v-model:value="useExactSize"
          label="Use exact width and height"
          label-position="top"
          md:col-span-2
        />
      </div>
    </c-card>

    <c-card flex justify-center overflow-auto>
      <img :src="base64" alt="Generated SVG placeholder preview" max-w-full>
    </c-card>

    <c-field class="c-generator-output" label="SVG HTML element">
      <TextareaCopyable :value="svgString" copy-placement="none" />
    </c-field>
    <c-field label="SVG data URL">
      <TextareaCopyable :value="base64" copy-placement="none" />
    </c-field>

    <div class="c-generator-actions">
      <c-button @click="copySVG()">
        Copy SVG
      </c-button>
      <c-button @click="copyBase64()">
        Copy data URL
      </c-button>
      <c-button @click="download()">
        Download SVG
      </c-button>
    </div>
  </div>
</template>
