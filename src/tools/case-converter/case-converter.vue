<template>
  <n-card>
    <n-form
      label-width="120"
      label-placement="left"
      :show-feedback="false"
    >
      <n-form-item label="Your string:">
        <n-input v-model:value="input" />
      </n-form-item>

      <n-divider />


      <n-form-item label="Camelcase:">
        <n-input :value="camelCase(input)" />
      </n-form-item>
      <n-form-item label="Capitalcase:">
        <n-input :value="capitalCase(input)" />
      </n-form-item>
      <n-form-item label="Constantcase:">
        <n-input :value="constantCase(input)" />
      </n-form-item>
      <n-form-item label="Dotcase:">
        <n-input :value="dotCase(input)" />
      </n-form-item>
      <n-form-item label="Headercase:">
        <n-input :value="headerCase(input)" />
      </n-form-item>
      <n-form-item label="Nocase:">
        <n-input :value="noCase(input)" />
      </n-form-item>
      <n-form-item label="Paramcase:">
        <n-input :value="paramCase(input)" />
      </n-form-item>
      <n-form-item label="Pascalcase:">
        <n-input :value="pascalCase(input)" />
      </n-form-item>
      <n-form-item label="Pathcase:">
        <n-input :value="pathCase(input)" />
      </n-form-item>
      <n-form-item label="Sentencecase:">
        <n-input :value="sentenceCase(input)" />
      </n-form-item>
      <n-form-item label="Snakecase:">
        <n-input :value="snakeCase(input)" />
      </n-form-item>
    </n-form>
  </n-card>
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
} from "change-case";

const input = ref('lorem ipsum dolor sit amet')

</script>

<style lang="less" scoped>
.n-form-item {
  margin: 5px 0;
}
</style>