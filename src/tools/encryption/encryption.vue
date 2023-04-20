<template>
  <n-card title="Encrypt">
    <n-space item-style="flex: 1 1 0">
      <n-form-item label="Your text:" :show-feedback="false">
        <n-input
          v-model:value="cypherInput"
          type="textarea"
          placeholder="The string to cypher"
          :autosize="{ minRows: 4 }"
        />
      </n-form-item>
      <n-space vertical>
        <n-form-item label="Your secret key:" :show-feedback="false">
          <n-input v-model:value="cypherSecret" />
        </n-form-item>
        <n-form-item label="Encryption algorithm:" :show-feedback="false">
          <n-select
            v-model:value="cypherAlgo"
            :options="Object.keys(algos).map((label) => ({ label, value: label }))"
          />
        </n-form-item>
        <n-form-item
          v-if="cypherAlgo === 'AES' || cypherAlgo === 'TripleDES'"
          label="Initialization vector:"
          :show-feedback="false"
        >
          <n-input v-model:value="cypherInitializationVector" />
        </n-form-item>
      </n-space>
    </n-space>
    <br />
    <n-form-item label="Your text encrypted:" :show-feedback="false">
      <n-input
        :value="cypherOutput"
        type="textarea"
        placeholder="Your string hash"
        :autosize="{ minRows: 2 }"
        readonly
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
      />
    </n-form-item>
  </n-card>
  <n-card title="Decrypt">
    <n-space item-style="flex: 1 1 0">
      <n-form-item label="Your encrypted text:" :show-feedback="false">
        <n-input
          v-model:value="decryptInput"
          type="textarea"
          placeholder="The string to cypher"
          :autosize="{ minRows: 4 }"
        />
      </n-form-item>
      <n-space vertical>
        <n-form-item label="Your secret key:" :show-feedback="false">
          <n-input v-model:value="decryptSecret" />
        </n-form-item>
        <n-form-item label="Encryption algorithm:" :show-feedback="false">
          <n-select
            v-model:value="decryptAlgo"
            :options="Object.keys(algos).map((label) => ({ label, value: label }))"
          />
        </n-form-item>
        <n-form-item
          v-if="decryptAlgo === 'AES' || decryptAlgo === 'TripleDES'"
          label="Initialization vector:"
          :show-feedback="false"
        >
          <n-input v-model:value="decryptInitializationVector" />
        </n-form-item>
      </n-space>
    </n-space>
    <br />
    <n-form-item label="Your decrypted text:" :show-feedback="false">
      <n-input
        :value="decryptOutput"
        type="textarea"
        placeholder="Your string hash"
        :autosize="{ minRows: 2 }"
        readonly
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
      />
    </n-form-item>
  </n-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { AES, TripleDES, Rabbit, RC4, enc } from 'crypto-js';

const algos = { AES, TripleDES, Rabbit, RC4 };

const cypherInput = ref('Hello World!');
const cypherAlgo = ref<keyof typeof algos>('AES');
const cypherSecret = ref('16bit secret key');
const cypherInitializationVector = ref('1234567812345678');
const cypherOutput = computed(() => {
  var cfg = {};
  if (cypherAlgo.value === 'AES' || cypherAlgo.value === 'TripleDES') {
    cfg = { iv: enc.Utf8.parse(cypherInitializationVector.value) };
  }
  return algos[cypherAlgo.value].encrypt(cypherInput.value, enc.Utf8.parse(cypherSecret.value), cfg).toString();
});

const decryptInput = ref('DX+W8WBHbt08XoJNV8bcoQ==');
const decryptAlgo = ref<keyof typeof algos>('AES');
const decryptSecret = ref('16bit secret key');
const decryptInitializationVector = ref('1234567812345678');
const decryptOutput = computed(() => {
  var cfg = {};
  if (decryptAlgo.value === 'AES' || decryptAlgo.value === 'TripleDES') {
    cfg = { iv: enc.Utf8.parse(decryptInitializationVector.value) };
  }
  return algos[decryptAlgo.value]
    .decrypt(decryptInput.value, enc.Utf8.parse(decryptSecret.value), cfg)
    .toString(enc.Utf8);
});
</script>
