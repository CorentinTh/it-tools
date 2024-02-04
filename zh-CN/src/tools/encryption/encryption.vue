<script setup lang="ts">
import { AES, RC4, Rabbit, TripleDES, enc } from 'crypto-js';
import { computedCatch } from '@/composable/computed/catchedComputed';

const algos = { AES, TripleDES, Rabbit, RC4 };

const cypherInput = ref('Lorem ipsum dolor sit amet');
const cypherAlgo = ref<keyof typeof algos>('AES');
const cypherSecret = ref('my secret key');
const cypherOutput = computed(() => algos[cypherAlgo.value].encrypt(cypherInput.value, cypherSecret.value).toString());

const decryptInput = ref('U2FsdGVkX1/EC3+6P5dbbkZ3e1kQ5o2yzuU0NHTjmrKnLBEwreV489Kr0DIB+uBs');
const decryptAlgo = ref<keyof typeof algos>('AES');
const decryptSecret = ref('my secret key');
const [decryptOutput, decryptError] = computedCatch(() => algos[decryptAlgo.value].decrypt(decryptInput.value, decryptSecret.value).toString(enc.Utf8), {
  defaultValue: '',
  defaultErrorMessage: '无法解密文本',
});
</script>

<template>
  <c-card title="加密">
    <div flex gap-3>
      <c-input-text
        v-model:value="cypherInput"
        label="明文："
        placeholder="待加密的明文"
        rows="4"
        multiline raw-text monospace autosize flex-1
      />
      <div flex flex-1 flex-col gap-2>
        <c-input-text v-model:value="cypherSecret" label="秘钥：" clearable raw-text />

        <c-select
          v-model:value="cypherAlgo"
          label="加密算法："
          :options="Object.keys(algos).map((label) => ({ label, value: label }))"
        />
      </div>
    </div>
    <c-input-text
      label="密文："
      :value="cypherOutput"
      rows="3"
      placeholder="加密后的密文"
      multiline monospace readonly autosize mt-5
    />
  </c-card>
  <c-card title="解密">
    <div flex gap-3>
      <c-input-text
        v-model:value="decryptInput"
        label="密文："
        placeholder="待解密的密文"
        rows="4"
        multiline raw-text monospace autosize flex-1
      />
      <div flex flex-1 flex-col gap-2>
        <c-input-text v-model:value="decryptSecret" label="秘钥：" clearable raw-text />

        <c-select
          v-model:value="decryptAlgo"
          label="加密算法："
          :options="Object.keys(algos).map((label) => ({ label, value: label }))"
        />
      </div>
    </div>
    <c-alert v-if="decryptError" type="warning" mt-12 title="解密时出错">
      {{ decryptError }}
    </c-alert>
    <c-input-text
      v-else
      label="明文："
      :value="decryptOutput"
      placeholder="解密后的明文"
      rows="3"
      multiline monospace readonly autosize mt-5
    />
  </c-card>
</template>
