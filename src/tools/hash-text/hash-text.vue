<script setup lang="ts">
import type { lib } from 'crypto-js';
import { MD5, RIPEMD160, SHA1, SHA224, SHA256, SHA3, SHA384, SHA512, enc } from 'crypto-js';

import {
  adler32,
  argon2d,
  argon2i,
  argon2id,
  blake2b,
  blake2s,
  blake3,
  crc32,
  crc32c,
  createSHA256,
  keccak,
  pbkdf2,
  sm3,
  whirlpool,
  xxhash128,
  xxhash3,
  xxhash32,
  xxhash64,
} from 'hash-wasm';

import InputCopyable from '../../components/InputCopyable.vue';
import { convertHexToBin } from './hash-text.service';
import { useQueryParamOrStorage } from '@/composable/queryParams';

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
type Encoding = keyof typeof enc | 'Bin';
const algoNames = Object.keys(algos) as AlgoNames[];

const algosWasm = {
  adler32,
  crc32,
  crc32c,
  blake2b,
  blake2s,
  blake3,
  keccak,
  xxhash32,
  xxhash64,
  xxhash3,
  xxhash128,
  sm3,
  whirlpool,
} as const;

type AlgoWasmNames = keyof typeof algosWasm;
const algoWasmNames = Object.keys(algosWasm) as AlgoWasmNames[];

const encoding = useQueryParamOrStorage<Encoding>({ defaultValue: 'Hex', storageName: 'hash-text:encoding', name: 'encoding' });
const clearText = ref('');

function formatWithEncoding(words: lib.WordArray, encoding: Encoding) {
  if (encoding === 'Bin') {
    return convertHexToBin(words.toString(enc.Hex));
  }

  return words.toString(enc[encoding]);
}

const hashText = (algo: AlgoNames, value: string) => formatWithEncoding(algos[algo](value), encoding.value);

const defaultHashWasmValues = {
  adler32: '',
  crc32: '',
  crc32c: '',
  blake2b: '',
  blake2s: '',
  blake3: '',
  keccak: '',
  xxhash32: '',
  xxhash64: '',
  xxhash3: '',
  xxhash128: '',
  sm3: '',
  whirlpool: '',
};
const hashWasmValues = computedAsync(async () => {
  const encodingValue = encoding.value;
  const clearTextValue = clearText.value;
  const ret = defaultHashWasmValues;
  for (const algo of algoWasmNames) {
    ret[algo] = formatWithEncoding(enc.Hex.parse(await algosWasm[algo](clearTextValue)), encodingValue);
  }
  return ret;
}, defaultHashWasmValues);

const salt = new Uint8Array(16);
window.crypto.getRandomValues(salt);
const hashWasmArgon2i = computedAsync(async () => {
  const clearTextValue = clearText.value;
  return await argon2i({
    password: clearTextValue,
    salt,
    parallelism: 1,
    memorySize: 128,
    iterations: 4,
    hashLength: 16,
    outputType: 'encoded',
  });
});
const hashWasmArgon2d = computedAsync(async () => {
  const clearTextValue = clearText.value;
  return await argon2d({
    password: clearTextValue,
    salt,
    parallelism: 1,
    memorySize: 128,
    iterations: 4,
    hashLength: 16,
    outputType: 'encoded',
  });
});
const hashWasmArgon2id = computedAsync(async () => {
  const clearTextValue = clearText.value;
  return await argon2id({
    password: clearTextValue,
    salt,
    parallelism: 1,
    memorySize: 128,
    iterations: 4,
    hashLength: 16,
    outputType: 'encoded',
  });
});
const hashWasmPBKDF2 = computedAsync(async () => {
  const clearTextValue = clearText.value;
  return await pbkdf2({
    password: clearTextValue,
    salt,
    iterations: 16,
    hashLength: 32,
    hashFunction: createSHA256(),
  });
});
</script>

<template>
  <div>
    <c-card>
      <c-input-text
        v-model:value="clearText"
        multiline raw-text
        placeholder="Your string to hash..." rows="3"
        autosize autofocus label="Your text to hash:"
      />

      <n-divider />

      <c-select
        v-model:value="encoding"
        mb-4
        label="Digest encoding"
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
            label: 'Base64url (base 64 with url safe chars)',
            value: 'Base64url',
          },
        ]"
      />

      <div v-for="algo in algoNames" :key="algo" style="margin: 5px 0">
        <n-input-group>
          <n-input-group-label style="flex: 0 0 120px">
            {{ algo }}
          </n-input-group-label>
          <InputCopyable :value="hashText(algo, clearText)" readonly />
        </n-input-group>
      </div>

      <div v-for="algo in algoWasmNames" :key="algo" style="margin: 5px 0">
        <n-input-group>
          <n-input-group-label style="flex: 0 0 120px">
            {{ algo.toUpperCase() }}
          </n-input-group-label>
          <InputCopyable :value="hashWasmValues[algo]" readonly />
        </n-input-group>
      </div>

      <n-divider />

      <div style="margin: 5px 0">
        <n-input-group>
          <n-input-group-label style="flex: 0 0 120px">
            Argon2d
          </n-input-group-label>
          <InputCopyable :value="hashWasmArgon2d" readonly />
        </n-input-group>
        <n-input-group>
          <n-input-group-label style="flex: 0 0 120px">
            Argon2i
          </n-input-group-label>
          <InputCopyable :value="hashWasmArgon2i" readonly />
        </n-input-group>
        <n-input-group>
          <n-input-group-label style="flex: 0 0 120px">
            Argon2id
          </n-input-group-label>
          <InputCopyable :value="hashWasmArgon2id" readonly />
        </n-input-group>
        <n-input-group>
          <n-input-group-label style="flex: 0 0 120px">
            PBKDF2
          </n-input-group-label>
          <InputCopyable :value="hashWasmPBKDF2" readonly />
        </n-input-group>
      </div>
    </c-card>
  </div>
</template>
