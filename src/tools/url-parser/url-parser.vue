<script setup lang="ts">
import InputCopyable from '../../components/InputCopyable.vue';
import { getUrlProperties, getUrlQueryParameters, parseUrl } from './url-parser.model';

const urlToParse = ref('https://me:pwd@it-tools.tech:3000/url-parser?key1=value&key2=value2#the-hash');

const urlParsed = computed(() => parseUrl(urlToParse.value));
const urlProperties = computed(() => getUrlProperties(urlParsed.value));
const queryParameters = computed(() => getUrlQueryParameters(urlParsed.value));
const urlValidationRules = [
  {
    validator: (value: string) => parseUrl(value) !== undefined,
    message: 'Invalid url',
  },
];
</script>

<template>
  <c-card>
    <c-input-text
      v-model:value="urlToParse"
      label="Your url to parse:"
      placeholder="Your url to parse..."
      raw-text
      :validation-rules="urlValidationRules"
    />

    <n-divider />

    <InputCopyable
      v-for="{ title, key, value } in urlProperties"
      :key="key"
      :label="title"
      :value="value"
      readonly
      label-position="left"
      label-width="110px"
      mb-2
      placeholder=" "
    />

    <div
      v-for="{ id, name, value } in queryParameters"
      :key="id"
      mb-2
      w-full
      flex
    >
      <div style="flex: 1 0 110px">
        <icon-mdi-arrow-right-bottom />
      </div>

      <InputCopyable :value="name" readonly />
      <InputCopyable :value="value" readonly />
    </div>
  </c-card>
</template>

<style lang="less" scoped>
.n-input-group-label {
  text-align: right;
}
.n-input-group {
  margin: 2px 0;
}
</style>
