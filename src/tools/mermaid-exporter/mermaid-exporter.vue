<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: false });

const mermaidCode = ref<string>(`graph TD
A[Start] --> B{Is it working?}
B -- Yes --> C[Great!]
B -- No --> D[Fix it!]
`);

const mermaidContainer = ref<HTMLElement | null>(null);

async function renderMermaid(): Promise<void> {
  if (mermaidContainer.value) {
    mermaidContainer.value.innerHTML = '';
    try {
      mermaid.parse(mermaidCode.value);
      const { svg } = await mermaid.render('graphDiv', mermaidCode.value);
      mermaidContainer.value.innerHTML = svg;
    }
    catch (error: unknown) {
      mermaidContainer.value.innerHTML = '<p class="error">Invalid Mermaid syntax</p>';
      console.error('Mermaid error:', error);
    }
  }
}

watch(mermaidCode, () => {
  nextTick(() => {
    renderMermaid();
  });
});

onMounted(() => {
  renderMermaid();
});

function fixSvgSize(svg: string): string {
  const match = svg.match(/viewBox="([\d\s.-]+)"/);
  if (!match) {
    return svg;
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [minX, minY, width, height] = match[1].split(/\s+/).map(Number);

  svg = svg.replace(/width="[^"]*"/, `width="${width}"`);
  svg = svg.replace(/height="[^"]*"/, `height="${height}"`);

  if (!/width="/.test(svg)) {
    svg = svg.replace('<svg', `<svg width="${width}"`);
  }
  if (!/height="/.test(svg)) {
    svg = svg.replace('<svg', `<svg height="${height}"`);
  }

  return svg;
}

function exportAs(format: 'svg' | 'png' | 'jpg'): void {
  const container = mermaidContainer.value;
  if (!container) {
    return;
  }

  const svgElement = container.querySelector('svg');
  if (!svgElement) {
    return;
  }

  let svgData = new XMLSerializer().serializeToString(svgElement);

  if (!svgData.includes('xmlns=')) {
    svgData = svgData.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  svgData = fixSvgSize(svgData);

  if (format === 'svg') {
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'diagram.svg';
    link.click();
    URL.revokeObjectURL(url);
    return;
  }

  const blob = new Blob([svgData], { type: 'image/svg+xml' });
  const reader = new FileReader();
  const scaleFactor = 3;

  reader.onloadend = () => {
    const base64data = reader.result as string;
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width * scaleFactor;
      canvas.height = image.height * scaleFactor;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }

      ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
      ctx.drawImage(image, 0, 0);

      const mime = format === 'png' ? 'image/png' : 'image/jpeg';
      const link = document.createElement('a');
      link.download = `diagram.${format}`;
      link.href = canvas.toDataURL(mime);
      link.click();
    };

    image.src = base64data;
  };

  reader.readAsDataURL(blob);
}
</script>

<template>
  <div>
    <c-input-text
      v-model:value="mermaidCode"
      class=""
      multiline raw-text
      placeholder="Write your Mermaid code here..."
      rows="8"
      autofocus
      label="Your Mermaid to convert:"
    />
    <n-divider />
    <div flex justify-center class="diagram-container">
      <div ref="mermaidContainer" />
    </div>

    <div flex justify-center class="buttons">
      <n-button @click="exportAs('png')">
        Export as PNG
      </n-button>
      <n-button @click="exportAs('jpg')">
        Export as JPG
      </n-button>
      <n-button @click="exportAs('svg')">
        Export as SVG
      </n-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.diagram-container {
    border: 1px solid var(--theme-default-color);
    padding: 15px;
    border-radius: 6px;
    background-color: var(--theme-default-color);
    overflow-x: auto;
    margin-bottom: 20px;

    .error {
      color: var(--theme-error-color);
      font-weight: bold;
    }
  }

  .buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
</style>
