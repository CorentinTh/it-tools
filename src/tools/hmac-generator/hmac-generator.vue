<template>
  <div>
    <n-form-item label="Plain text to compute the hash">
      <n-input v-model:value="plainText" type="textarea" placeholder="Enter the text to compute the hash..." />
    </n-form-item>
    <n-form-item label="Secret key">
      <n-input v-model:value="secret" placeholder="Enter the secret key..." />
    </n-form-item>
    <n-space item-style="flex:1 1 0">
      <n-form-item label="Hashing function">
        <n-select
          v-model:value="hashFunction"
          placeholder="Select an hashing function..."
          :options="Object.keys(algos).map((label) => ({ label, value: label }))"
        />
      </n-form-item>
      <n-form-item label="Output encoding">
        <n-select
          v-model:value="encoding"
          placeholder="Select the result encoding..."
          :options="[
            {
              label: 'Binary (base 2)',
              value: 'Bin',
            },
            {
              label: 'Hexadecimal (base 16)',
              value: 'Hex',
            },
            {
              label: 'Base64 (base 64)',
              value: 'Base64',
            },
            {
              label: 'Base64-url (base 64 with url safe chars)',
              value: 'Base64url',
            },
          ]"
        />
      </n-form-item>
    </n-space>
    <n-form-item label="HMAC of your text">
      <n-input readonly :value="hmac" type="textarea" placeholder="The result of the HMAC..." />
    </n-form-item>
    <n-space justify="center">
      <c-button @click="copy()">Copy HMAC</c-button>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import {
  enc,
  HmacMD5,
  HmacRIPEMD160,
  HmacSHA1,
  HmacSHA224,
  HmacSHA256,
  HmacSHA3,
  HmacSHA384,
  HmacSHA512,
  lib,
} from 'crypto-js';
import { computed, ref } from 'vue';
import { convertHexToBin } from '../hash-text/hash-text.service';

const algos = {
  MD5: HmacMD5,
  RIPEMD160: HmacRIPEMD160,
  SHA1: HmacSHA1,
  SHA3: HmacSHA3,
  SHA224: HmacSHA224,
  SHA256: HmacSHA256,
  SHA384: HmacSHA384,
  SHA512: HmacSHA512,
} as const;

type Encoding = keyof typeof enc | 'Bin';

function formatWithEncoding(words: lib.WordArray, encoding: Encoding) {
  if (encoding === 'Bin') {
    return convertHexToBin(words.toString(enc.Hex));
  }
  return words.toString(enc[encoding]);
}

const plainText = ref('');
const secret = ref('');
const hashFunction = ref<keyof typeof algos>('SHA256');
const encoding = ref<Encoding>('Hex');
const hmac = computed(() =>
  formatWithEncoding(algos[hashFunction.value](plainText.value, secret.value), encoding.value),
);
const { copy } = useCopy({ source: hmac });
</script>
