<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import { rmb } from './rmb-numbers.service';

const themeVars = useThemeVars();
const inputRmb = ref(23);
const outputRmb = computed(() => rmb(inputRmb.value)); ;
</script>

<template>
  <div flex flex-col gap-2>
    <c-card title="Lower Case Amount">
      <n-input-number v-model:value="inputRmb" max="100000000000" min="0" placeholder="Enter the amount in lowercase (example: 1314.52)" :show-button="false" w-full />
    </c-card>

    <div my-16px divider />

    <c-card title="Amount in Capital Letters" flex flex-col>
      <div m-0 m-x-auto>
        <span
          v-for="(item, index) in outputRmb"
          :key="index"
          :class="item.type"
        >
          {{ item.value }}
        </span>
      </div>
    </c-card>
  </div>
</template>

<style lang="less" scoped>
.unit {
  font-size: 1.4em;
  color: v-bind('themeVars.successColor');
}
.number {
  font-size: 2.4em;
}
.cut {
  font-size: 1.4em;
  color: v-bind('themeVars.errorColor');
}
</style>
