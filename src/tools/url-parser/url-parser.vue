<template>
  <c-card>
    <n-form-item label="Your url to parse:" :feedback="validation.message" :validation-status="validation.status">
      <n-input v-model:value="urlToParse" placeholder="Your url to parse..." />
    </n-form-item>

    <n-divider style="margin-top: 0" />

    <n-form>
      <n-input-group v-for="{ title, key } in properties" :key="key">
        <n-input-group-label style="flex: 0 0 120px"> {{ title }}: </n-input-group-label>
        <input-copyable :value="(urlParsed?.[key] as string) ?? ''" readonly placeholder=" " />
      </n-input-group>

      <n-input-group
        v-for="[k, v] in Object.entries(Object.fromEntries(urlParsed?.searchParams.entries() ?? []))"
        :key="k"
      >
        <n-input-group-label style="flex: 0 0 120px">
          <n-icon :component="SubdirectoryArrowRightRound" />
        </n-input-group-label>
        <input-copyable :value="k" readonly />
        <input-copyable :value="v" readonly />
      </n-input-group>
    </n-form>
  </c-card>
</template>

<script setup lang="ts">
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';
import { SubdirectoryArrowRightRound } from '@vicons/material';
import { computed, ref } from 'vue';
import InputCopyable from '../../components/InputCopyable.vue';

const urlToParse = ref('https://me:pwd@it-tools.tech:3000/url-parser?key1=value&key2=value2#the-hash');

const urlParsed = computed(() => withDefaultOnError(() => new URL(urlToParse.value), undefined));
const validation = useValidation({
  source: urlToParse,
  rules: [
    {
      validator: (value) => isNotThrowing(() => new URL(value)),
      message: 'Invalid url',
    },
  ],
});

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

<style lang="less" scoped>
.n-input-group-label {
  text-align: right;
}
.n-input-group {
  margin: 2px 0;
}
</style>
