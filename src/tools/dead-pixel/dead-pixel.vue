<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';

const showIframe = ref(false);
const iframeRef = ref<HTMLIFrameElement | null>(null);

async function startDeadPixel() {
  showIframe.value = true;
  await nextTick();

  const iframe = iframeRef.value;
  if (!iframe) {
    return;
  }

  iframe.onload = async () => {
    try {
      await iframe.requestFullscreen();
    }
    catch (e) {
      console.warn('Fullscreen failed', e);
    }
  };
}

function handleFullscreenChange() {
  if (!document.fullscreenElement && showIframe.value) {
    showIframe.value = false;
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
});

const iframeHTML = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    html, body {
      margin: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      outline: none;
    }
  </style>
</head>
<body tabindex="0">
<script>
(function () {
  const colors = ["#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff"];
  let i = 0;

  function setColor() {
    document.body.style.background = colors[i];
  }

  function next() {
    i = (i + 1) % colors.length;
    setColor();
  }

  function prev() {
    i = (i - 1 + colors.length) % colors.length;
    setColor();
  }

  function focusBody() {
    document.body.focus();
  }

  setColor();
  focusBody();

  document.body.addEventListener("click", () => {
    focusBody();
    next();
  });

  document.addEventListener("fullscreenchange", focusBody);

  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
      case " ":
        e.preventDefault();
        next();
        break;

      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        prev();
        break;
    }
  });
})();
<\/script>
</body>
</html>
`;
</script>

<template>
  <div class="flex flex-col">
    <p>
      Keyboard shortcuts:
      <ul>
        <li><strong>Arrow Right, Arrow Down, Space</strong>: Next color</li>
        <li><strong>Arrow Left, Arrow Up</strong>: Previous color</li>
        <li><strong>ESC</strong>: Exit Dead Pixel Mode</li>
      </ul>
    </p>
    <c-button v-if="!showIframe" class="mx-auto" @click="startDeadPixel">
      Start Dead Pixel
    </c-button>
  </div>

  <iframe v-if="showIframe" ref="iframeRef" class="dead-pixel-iframe" :srcdoc="iframeHTML" allow="fullscreen" />
</template>

<style scoped>
  .dead-pixel-iframe {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    border: none;
    z-index: 9999;
  }
</style>
