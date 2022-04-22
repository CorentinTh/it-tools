<template>
  <n-card>
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
  </n-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { SubdirectoryArrowRightRound } from '@vicons/material';
import InputCopyable from '../../components/InputCopyable.vue';
import { useValidation } from '@/composable/validation';

const urlToParse = ref('https://me:pwd@it-tools.tech:3000/url-parser?key1=value&key2=value2#the-hash');
const urlParsed = computed<URL | undefined>(() => {
  try {
    return new URL(urlToParse.value);
  } catch (_) {
    return undefined;
  }
});
const validation = useValidation({
  source: urlToParse,
  rules: [
    {
      validator: (value) => {
        try {
          new URL(value);
          return true;
        } catch (_) {
          return false;
        }
      },
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
