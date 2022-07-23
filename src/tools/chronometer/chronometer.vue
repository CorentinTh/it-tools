<template>
  <div>
    <n-card>
      <div class="duration">{{ formatChronometerTime({ elapsed: counter, msPerUnit }) }}</div>
    </n-card>
    <br />
    <n-space justify="center">
      <n-button v-if="!isActive" secondary type="primary" @click="resume">Start</n-button>
      <n-button v-else secondary type="warning" @click="pause">Stop</n-button>

      <n-button secondary @click="counter = 0">Reset</n-button>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { useInterval } from '@vueuse/core';
import { formatChronometerTime } from './chronometer.service';

const msPerUnit = 10;

const { counter, pause, resume, isActive } = useInterval(msPerUnit, { controls: true, immediate: false });
</script>

<style lang="less" scoped>
.duration {
  text-align: center;
  font-size: 40px;
  font-family: monospace;
  margin: 20px 0;
}
</style>
