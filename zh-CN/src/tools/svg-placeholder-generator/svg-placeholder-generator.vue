<script setup lang="ts">
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useCopy } from '@/composable/copy';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
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

const { download } = useDownloadFileFromBase64({ source: base64, filename: '图片占位' });
</script>

<template>
  <div>
    <n-form label-placement="left" label-width="100">
      <div flex gap-3>
        <n-form-item label="宽度 (px)" flex-1>
          <n-input-number v-model:value="width" placeholder="SVG 宽度" min="1" />
        </n-form-item>
        <n-form-item label="背景" flex-1>
          <n-color-picker v-model:value="bgColor" :modes="['hex']" />
        </n-form-item>
      </div>
      <div flex gap-3>
        <n-form-item label="高度 (px)" flex-1>
          <n-input-number v-model:value="height" placeholder="SVG 高度" min="1" />
        </n-form-item>
        <n-form-item label="文字颜色" flex-1>
          <n-color-picker v-model:value="fgColor" :modes="['hex']" />
        </n-form-item>
      </div>
      <div flex gap-3>
        <n-form-item label="文字大小" flex-1>
          <n-input-number v-model:value="fontSize" placeholder="文字大小" min="1" />
        </n-form-item>

        <c-input-text
          v-model:value="customText"
          label="填充文本"
          :placeholder="`默认 ${width}x${height}`"
          label-position="left"
          label-width="100px"
          label-align="right"
          flex-1
        />
      </div>
      <n-form-item label="使用精确尺寸" label-placement="left">
        <n-switch v-model:value="useExactSize" />
      </n-form-item>
    </n-form>

    <n-form-item label="SVG HTML代码">
      <TextareaCopyable :value="svgString" copy-placement="none" />
    </n-form-item>
    <n-form-item label="SVG Base64代码">
      <TextareaCopyable :value="base64" copy-placement="none" />
    </n-form-item>

    <div flex justify-center gap-3>
      <c-button @click="download()">
        下载 svg 文件
      </c-button>
    </div>
  </div>

  <div>
    <img :src="base64" :width="width" alt="Image" />
  </div>
</template>

<style lang="less" scoped>
.n-input-number {
  width: 100%;
}
</style>
