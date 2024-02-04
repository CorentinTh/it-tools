<script setup lang="ts">
import { rmb } from './rmb-d.models';
import { useThemeVars } from 'naive-ui';

const themeVars = useThemeVars();
const inputRmb = ref(23);
const outputRmb = computed(() => rmb(inputRmb.value));;
</script>

<template>
  <div flex flex-col gap-2>
    <c-card title="小写金额">
      <n-input-number v-model:value="inputRmb" max="100000000000" min="0" placeholder="输入小写金额 (例：1314.52)" :show-button="false" w-full />
    </c-card>

    <div my-16px divider />

    <c-card title="大写金额" flex flex-col>
      <div m-0 m-x-auto>
        <span :class="item.type"
          v-for="(item, index) in outputRmb" 
          :key="index"
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