<script setup lang="ts">
import { compareSync, hashSync } from 'bcryptjs';
import { useThemeVars } from 'naive-ui';
import { useCopy } from '@/composable/copy';

const themeVars = useThemeVars();

const input = ref('');
const saltCount = ref(10);
const hashed = computed(() => hashSync(input.value, saltCount.value));
const { copy } = useCopy({ source: hashed, text: '已复制到剪贴板' });

const compareString = ref('');
const compareHash = ref('');
const compareMatch = computed(() => compareSync(compareString.value, compareHash.value));
</script>

<template>
  <c-card title="Hash 哈希">
    <c-input-text
      v-model:value="input"
      placeholder="请输入字符串"
      raw-text
      label="字符串："
      label-position="left"
      label-align="right"
      label-width="120px"
      mb-2
    />
    <n-form-item label="加盐含量：" label-placement="left" label-width="120">
      <n-input-number v-model:value="saltCount" placeholder="加盐含量" :max="10" :min="0" w-full />
    </n-form-item>

    <c-input-text :value="hashed" readonly text-center />

    <div mt-5 flex justify-center>
      <c-button @click="copy()">
        复制
      </c-button>
    </div>
  </c-card>

  <c-card title="比较字符串和哈希值">
    <n-form label-width="120">
      <n-form-item label="字符串：" label-placement="left">
        <c-input-text v-model:value="compareString" placeholder="Your string to compare..." raw-text />
      </n-form-item>
      <n-form-item label="哈希值：" label-placement="left">
        <c-input-text v-model:value="compareHash" placeholder="Your hash to compare..." raw-text />
      </n-form-item>
      <n-form-item label="结果：" label-placement="left" :show-feedback="false">
        <div class="compare-result" :class="{ positive: compareMatch }">
          {{ compareMatch ? '匹配' : '不匹配' }}
        </div>
      </n-form-item>
    </n-form>
  </c-card>
</template>

<style lang="less" scoped>
.compare-result {
  color: v-bind('themeVars.errorColor');

  &.positive {
    color: v-bind('themeVars.successColor');
  }
}
</style>
