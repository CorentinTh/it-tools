<template>
  <div>
    <n-card title="Arabic to roman">
      <n-space align="center" justify="space-between">
        <n-input-number v-model:value="inputNumeral" :min="1" style="width: 200px" :show-button="false" />
        <div class="result">
          {{ outputRoman }}
        </div>
        <n-button secondary autofocus @click="copyRoman"> Copy </n-button>
      </n-space>
    </n-card>
    <br />
    <n-card title="Roman to arabic">
      <n-space align="center" justify="space-between">
        <n-input v-model:value="inputRoman" style="width: 200px" />
        <div class="result">
          {{ outputNumeral }}
        </div>
        <n-button secondary autofocus @click="copyArabic"> Copy </n-button>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { ref, computed } from 'vue';
import { arabicToRoman, romanToArabic } from './roman-numeral-converter.service';

const inputNumeral = ref(42);
const outputRoman = computed(() => arabicToRoman(inputNumeral.value));

const inputRoman = ref('IVX');
const outputNumeral = computed(() => romanToArabic(inputRoman.value));

const { copy: copyRoman } = useCopy({ source: outputRoman, text: 'Roman number copied to the clipboard' });
const { copy: copyArabic } = useCopy({ source: outputNumeral, text: 'Arabic number copied to the clipboard' });
</script>

<style lang="less" scoped>
.result {
  font-size: 22px;
}
</style>
