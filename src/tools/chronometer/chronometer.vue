<template>
  <div>
    <n-card>
      <div class="duration">{{ formatMs(counter) }}</div>
    </n-card>
    <br />
    <n-space justify="center">
      <n-button v-if="!isRunning" secondary type="primary" @click="resume">Start</n-button>
      <n-button v-else secondary type="warning" @click="pause">Stop</n-button>

      <n-button secondary @click="counter = 0">Reset</n-button>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { useRafFn } from '@vueuse/core';
import { ref } from 'vue';
import { formatMs } from './chronometer.service';

const isRunning = ref(false);
const counter = ref(0);

let previousRafDate = Date.now();
const { pause: pauseRaf, resume: resumeRaf } = useRafFn(
  () => {
    const deltaMs = Date.now() - previousRafDate;
    previousRafDate = Date.now();
    counter.value += deltaMs;
  },
  { immediate: false },
);

function resume() {
  previousRafDate = Date.now();
  resumeRaf();
  isRunning.value = true;
}

function pause() {
  pauseRaf();
  isRunning.value = false;
}
</script>

<style lang="less" scoped>
.duration {
  text-align: center;
  font-size: 40px;
  font-family: monospace;
  margin: 20px 0;
}
</style>
