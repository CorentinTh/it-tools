<script setup lang="ts">
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useCopy } from '@/composable/copy';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import { textToBase64 } from '@/utils/base64';

const { t } = useI18n();
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
  <div>
    <n-form label-placement="left" label-width="100">
      <div flex gap-3>
        <n-form-item :label="t('tools.svg-placeholder-generator.widthLabel')" flex-1>
          <n-input-number v-model:value="width" :placeholder="t('tools.svg-placeholder-generator.widthPlaceholder')" min="1" />
        </n-form-item>
        <n-form-item :label="t('tools.svg-placeholder-generator.backgroundLabel')" flex-1>
          <n-color-picker v-model:value="bgColor" :modes="['hex']" />
        </n-form-item>
      </div>
      <div flex gap-3>
        <n-form-item :label="t('tools.svg-placeholder-generator.heightLabel')" flex-1>
          <n-input-number v-model:value="height" :placeholder="t('tools.svg-placeholder-generator.heightPlaceholder')" min="1" />
        </n-form-item>
        <n-form-item :label="t('tools.svg-placeholder-generator.textColorLabel')" flex-1>
          <n-color-picker v-model:value="fgColor" :modes="['hex']" />
        </n-form-item>
      </div>
      <div flex gap-3>
        <n-form-item :label="t('tools.svg-placeholder-generator.fontSizeLabel')" flex-1>
          <n-input-number v-model:value="fontSize" :placeholder="t('tools.svg-placeholder-generator.fontSizePlaceholder')" min="1" />
        </n-form-item>

        <c-input-text
          v-model:value="customText"
          :label="t('tools.svg-placeholder-generator.customTextLabel')"
          :placeholder="t('tools.svg-placeholder-generator.customTextPlaceholder', { width, height })"
          label-position="left"
          label-width="100px"
          label-align="right"
          flex-1
        />
      </div>
      <n-form-item :label="t('tools.svg-placeholder-generator.useExactSize')" label-placement="left">
        <n-switch v-model:value="useExactSize" />
      </n-form-item>
    </n-form>

    <n-form-item :label="t('tools.svg-placeholder-generator.svgString')">
      <TextareaCopyable :value="svgString" copy-placement="none" />
    </n-form-item>
    <n-form-item :label="t('tools.svg-placeholder-generator.base64')">
      <TextareaCopyable :value="base64" copy-placement="none" />
    </n-form-item>

    <div flex justify-center gap-3>
      <c-button @click="copySVG()">
        {{ t('tools.svg-placeholder-generator.copySvg') }}
      </c-button>
      <c-button @click="copyBase64()">
        {{ t('tools.svg-placeholder-generator.copyBase64') }}
      </c-button>
      <c-button @click="download()">
        {{ t('tools.svg-placeholder-generator.downloadSvg') }}
      </c-button>
    </div>
  </div>

  <img :src="base64" alt="Image">
</template>

<style lang="less" scoped>
.n-input-number {
  width: 100%;
}
</style>
