<template>
  <div>
    <n-card>
      <n-input v-model:value="clearText" type="textarea" placeholder="Your string..." :autosize="{ minRows: 3 }" />

      <n-divider />

      <div v-for="algo in algoNames" :key="algo" style="margin: 5px 0">
        <n-input-group>
          <n-input-group-label style="flex: 0 0 120px"> {{ algo }} </n-input-group-label>
          <input-copyable :value="hashText(algo, clearText)" readonly />
        </n-input-group>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import InputCopyable from '../../components/InputCopyable.vue';
import { ref } from 'vue';
import { MD5, SHA1, SHA256, SHA224, SHA512, SHA384, SHA3, RIPEMD160 } from 'crypto-js';

const algos = {
  MD5,
  SHA1,
  SHA256,
  SHA224,
  SHA512,
  SHA384,
  SHA3,
  RIPEMD160,
} as const;

type AlgoNames = keyof typeof algos;
const algoNames = Object.keys(algos) as AlgoNames[];

const clearText = ref(
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus metus blandit dolor lacus natoque ad fusce aliquam velit.'
);
const hashText = (algo: AlgoNames, value: string) => (value ? algos[algo](value).toString() : '');
</script>
