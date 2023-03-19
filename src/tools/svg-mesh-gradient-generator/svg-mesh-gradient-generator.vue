<template>
  <svg viewBox="0 0 3000 2000" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient
        v-for="{ id, cx, cy, fx, fy, color } of gradients"
        :id="id"
        :key="id"
        :cx="cx"
        :cy="cy"
        r="100%"
        :fx="fx"
        :fy="fy"
        gradientUnits="objectBoundingBox"
      >
        <stop offset="0" :stop-color="color" stop-opacity="1"></stop>
        <stop offset="0.5" :stop-color="color + '00'" stop-opacity="0"></stop>
      </radialGradient>
    </defs>
    <rect v-for="{ id, fill } of gradients" :key="id" x="0" y="0" width="100%" height="100%" :fill="fill"></rect>
  </svg>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { ref, computed } from 'vue';

const randomPercent = () => `${Math.random() * 100}%`;
const randomColor = () => '#' + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, '0');

const quantity = ref(5);

const gradients = computed(() =>
  Array.from({ length: quantity.value }, () => {
    const id = _.uniqueId('id-');

    return {
      id,
      fill: `url(#${id})`,
      cx: randomPercent(),
      cy: randomPercent(),
      fx: randomPercent(),
      fy: randomPercent(),
      color: randomColor(),
    };
  }),
);
</script>

<style lang="less" scoped></style>
