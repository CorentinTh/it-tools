<script setup lang="ts">
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

<template>
  <c-card>
    <n-form label-width="120" label-placement="left" :show-feedback="false">
      <c-input-text
        v-model:value="input"
        label="Your string"
        label-position="left"
        label-width="120px"
        label-align="right"
        placeholder="Your string..."
        raw-text
      />

      <n-divider />

      <n-form-item label="Camelcase:">
        <InputCopyable :value="camelCase(input, baseConfig)" />
      </n-form-item>
      <n-form-item label="Capitalcase:">
        <InputCopyable :value="capitalCase(input, baseConfig)" />
      </n-form-item>
      <n-form-item label="Constantcase:">
        <InputCopyable :value="constantCase(input, baseConfig)" />
      </n-form-item>
      <n-form-item label="Dotcase:">
        <InputCopyable :value="dotCase(input, baseConfig)" />
      </n-form-item>
      <n-form-item label="Headercase:">
        <InputCopyable :value="headerCase(input, baseConfig)" />
      </n-form-item>
      <n-form-item label="Nocase:">
        <InputCopyable :value="noCase(input, baseConfig)" />
      </n-form-item>
      <n-form-item label="Paramcase:">
        <InputCopyable :value="paramCase(input, baseConfig)" />
      </n-form-item>
      <n-form-item label="Pascalcase:">
        <InputCopyable :value="pascalCase(input, baseConfig)" />
      </n-form-item>
      <n-form-item label="Pathcase:">
        <InputCopyable :value="pathCase(input, baseConfig)" />
      </n-form-item>
      <n-form-item label="Sentencecase:">
        <InputCopyable :value="sentenceCase(input, baseConfig)" />
      </n-form-item>
      <n-form-item label="Snakecase:">
        <InputCopyable :value="snakeCase(input, baseConfig)" />
      </n-form-item>
    </n-form>
  </c-card>
</template>

<style lang="less" scoped>
.n-form-item {
  margin: 5px 0;
}
</style>
