<template>
  <c-card>
    <n-form label-width="120" label-placement="left" :show-feedback="false">
      <n-form-item label="Your string:">
        <n-input v-model:value="input" />
      </n-form-item>

      <n-divider />

      <n-form-item label="Camelcase:">
        <input-copyable :value="camelCase(input, baseConfig)" />
      </n-form-item>
      <n-form-item label="Capitalcase:">
        <input-copyable :value="capitalCase(input, baseConfig)" />
      </n-form-item>
      <n-form-item label="Constantcase:">
        <input-copyable :value="constantCase(input, baseConfig)" />
      </n-form-item>
      <n-form-item label="Dotcase:">
        <input-copyable :value="dotCase(input, baseConfig)" />
      </n-form-item>
      <n-form-item label="Headercase:">
        <input-copyable :value="headerCase(input, baseConfig)" />
      </n-form-item>
      <n-form-item label="Nocase:">
        <input-copyable :value="noCase(input, baseConfig)" />
      </n-form-item>
      <n-form-item label="Paramcase:">
        <input-copyable :value="paramCase(input, baseConfig)" />
      </n-form-item>
      <n-form-item label="Pascalcase:">
        <input-copyable :value="pascalCase(input, baseConfig)" />
      </n-form-item>
      <n-form-item label="Pathcase:">
        <input-copyable :value="pathCase(input, baseConfig)" />
      </n-form-item>
      <n-form-item label="Sentencecase:">
        <input-copyable :value="sentenceCase(input, baseConfig)" />
      </n-form-item>
      <n-form-item label="Snakecase:">
        <input-copyable :value="snakeCase(input, baseConfig)" />
      </n-form-item>
    </n-form>
  </c-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  camelCase,
  capitalCase,
  constantCase,
  dotCase,
  headerCase,
  noCase,
  paramCase,
  pascalCase,
  pathCase,
  sentenceCase,
  snakeCase,
} from 'change-case';
import InputCopyable from '../../components/InputCopyable.vue';

const baseConfig = {
  stripRegexp: /[^A-Za-zÀ-ÖØ-öø-ÿ]+/gi,
};

const input = ref('lorem ipsum dolor sit amet');
</script>

<style lang="less" scoped>
.n-form-item {
  margin: 5px 0;
}
</style>
