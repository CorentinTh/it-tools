<template>
  <div>
    <n-card>
      <n-input v-model:value="clearText" type="textarea" placeholder="Your string..." :autosize="{ minRows: 3 }" />

      <n-divider />

      <div v-for="algo in list" :key="algo" style="margin: 5px 0">
        <n-input-group>
          <n-input-group-label style="flex: 0 0 120px"> {{ algo }} </n-input-group-label>
          <input-copyable :value="hashedText(algo, clearText)" readonly />
        </n-input-group>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import InputCopyable from '../../components/InputCopyable.vue';
import { ref, computed } from 'vue';
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

type Algo = keyof typeof algos;
const list = Object.keys(algos) as Algo[];

const clearText = ref(
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus metus blandit dolor lacus natoque ad fusce aliquam velit.'
);
const hashedText = (algo: Algo, value: string) => (value ? algos[algo](value).toString() : '');
</script>
