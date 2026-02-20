<script setup lang="ts">
import { useRafFn } from '@vueuse/core';

import { formatMs } from './chronometer.service';

const isRunning = ref(false);
const counter = ref(0);
const { t } = useI18n();

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

<template>
  <div>
    <c-card>
      <div class="duration">
        {{ formatMs(counter) }}
      </div>
    </c-card>
    <div mt-5 flex justify-center gap-3>
      <c-button v-if="!isRunning" type="primary" @click="resume">
        {{ t('tools.chronometer.button.start') }}
      </c-button>
      <c-button v-else type="warning" @click="pause">
        {{ t('tools.chronometer.button.stop') }}
      </c-button>

      <c-button @click="counter = 0">
        {{ t('tools.chronometer.button.reset') }}
      </c-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.duration {
  text-align: center;
  font-size: 40px;
  font-family: monospace;
  margin: 20px 0;
}
</style>
