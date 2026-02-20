<script setup lang="ts">
import InputCopyable from '../../components/InputCopyable.vue';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const urlToParse = ref('https://me:pwd@it-tools.tech:3000/url-parser?key=value&keyarr=value1&keyarr=value2&otherarg#the-hash');

const urlParsed = computed(() => withDefaultOnError(() => new URL(urlToParse.value), undefined));
const urlParsedParams = computed(() => {
  const params: { key: string; value: string }[] = [];
  const usedKeys = new Set();
  for (const key of (urlParsed.value?.searchParams.keys() ?? [])) {
    // searchParams.keys() reports as many times the key as it appears in the params, so use only first occurrence
    if (usedKeys.has(key)) {
      continue;
    }
    usedKeys.add(key);
    const values = urlParsed.value?.searchParams.getAll(key) ?? [];
    if (values.length > 1) {
      // print out multiple values at the place of the first occurrence of param
      let index = 0;
      values.forEach((value) => {
        params.push({ key: `${key}[${index}]`, value: (value ?? '') });
        index += 1;
      });
      continue;
    }
    params.push({ key, value: (urlParsed.value?.searchParams.get(key) ?? '') });
  }
  return params;
});
const urlValidationRules = [
  {
    validator: (value: string) => isNotThrowing(() => new URL(value)),
    message: 'Invalid url',
  },
];

const properties: { title: string; key: keyof URL }[] = [
  { title: 'Protocol', key: 'protocol' },
  { title: 'Username', key: 'username' },
  { title: 'Password', key: 'password' },
  { title: 'Hostname', key: 'hostname' },
  { title: 'Port', key: 'port' },
  { title: 'Path', key: 'pathname' },
  { title: 'Params', key: 'search' },
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
      v-for="{ title, key } in properties"
      :key="key"
      :label="title"
      :value="(urlParsed?.[key] as string) ?? ''"
      readonly
      label-position="left"
      label-width="110px"
      mb-2
      placeholder=" "
    />

    <div
      v-for="param in urlParsedParams"
      :key="param.key"
      mb-2
      w-full
      flex
    >
      <div style="flex: 1 0 110px">
        <icon-mdi-arrow-right-bottom />
      </div>

      <InputCopyable :value="param.key" readonly />
      <InputCopyable :value="param.value" readonly />
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
