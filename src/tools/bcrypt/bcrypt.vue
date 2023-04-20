<template>
  <c-card title="Hash">
    <n-form label-width="120">
      <n-form-item label="Your string: " label-placement="left">
        <n-input
          v-model:value="input"
          placeholder="Your string to bcrypt..."
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        />
      </n-form-item>
      <n-form-item label="Salt count: " label-placement="left">
        <n-input-number v-model:value="saltCount" placeholder="Salt rounds..." :max="10" :min="0" w-full />
      </n-form-item>
      <n-input :value="hashed" readonly style="text-align: center" />
    </n-form>
    <n-space justify="center" mt-5>
      <c-button @click="copy"> Copy hash </c-button>
    </n-space>
  </c-card>

  <c-card title="Compare string with hash">
    <n-form label-width="120">
      <n-form-item label="Your string: " label-placement="left">
        <n-input
          v-model:value="compareString"
          placeholder="Your string to compare..."
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        />
      </n-form-item>
      <n-form-item label="Your hash: " label-placement="left">
        <n-input
          v-model:value="compareHash"
          placeholder="Your hahs to compare..."
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        />
      </n-form-item>
      <n-form-item label="Do they match ? " label-placement="left" :show-feedback="false">
        <div class="compare-result" :class="{ positive: compareMatch }">
          {{ compareMatch ? 'Yes' : 'No' }}
        </div>
      </n-form-item>
    </n-form>
  </c-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { hashSync, compareSync } from 'bcryptjs';
import { useCopy } from '@/composable/copy';
import { useThemeVars } from 'naive-ui';

const themeVars = useThemeVars();

const input = ref('');
const saltCount = ref(10);
const hashed = computed(() => hashSync(input.value, saltCount.value));
const { copy } = useCopy({ source: hashed, text: 'Hashed string copied to the clipboard' });

const compareString = ref('');
const compareHash = ref('');
const compareMatch = computed(() => compareSync(compareString.value, compareHash.value));
</script>

<style lang="less" scoped>
.compare-result {
  color: v-bind('themeVars.errorColor');

  &.positive {
    color: v-bind('themeVars.successColor');
  }
}
</style>
