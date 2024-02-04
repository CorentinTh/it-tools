<script setup lang="ts">
import InputCopyable from '../../components/InputCopyable.vue';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const urlToParse = ref('https://cn.bing.com/search?q=URL%E8%A7%A3%E6%9E%90&form=QBLH&sp=-1&lq=0&pq=urljiex&sc=10-7&qs=n&sk=&cvid=1DB3F89659C040B296A799066212A03D&ghsh=0&ghacc=0&ghpl=');

const urlParsed = computed(() => withDefaultOnError(() => new URL(urlToParse.value), undefined));
const urlValidationRules = [
  {
    validator: (value: string) => isNotThrowing(() => new URL(value)),
    message: '无效的URL',
  },
];

const properties: { title: string; key: keyof URL }[] = [
  { title: '协议', key: 'protocol' },
  { title: '域名', key: 'hostname' },
  { title: '路径', key: 'pathname' },
  { title: '参数', key: 'search' },
];
</script>

<template>
  <c-card>
    <c-input-text
      v-model:value="urlToParse"
      label="URL链接:"
      placeholder="输入URL链接"
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
      v-for="[k, v] in Object.entries(Object.fromEntries(urlParsed?.searchParams.entries() ?? []))"
      :key="k"
      mb-2
      w-full
      flex
    >
      <div style="flex: 1 0 110px">
        <icon-mdi-arrow-right-bottom />
      </div>

      <InputCopyable :value="k" readonly placeholder="" />
      <InputCopyable :value="v" readonly placeholder="" />
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
