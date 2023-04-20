<template>
  <div>
    <c-card>
      <n-input v-model:value="clearText" type="textarea" placeholder="Your string to hash..." rows="3" />

      <n-divider />

      <n-form-item label="Digest encoding">
        <n-select
          v-model:value="encoding"
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
      </n-form-item>

      <div v-for="algo in algoNames" :key="algo" style="margin: 5px 0">
        <n-input-group>
          <n-input-group-label style="flex: 0 0 120px"> {{ algo }} </n-input-group-label>
          <input-copyable :value="hashText(algo, clearText)" readonly />
        </n-input-group>
      </div>
    </c-card>
  </div>
</template>

<script setup lang="ts">
import { useQueryParam } from '@/composable/queryParams';
import { enc, lib, MD5, RIPEMD160, SHA1, SHA224, SHA256, SHA3, SHA384, SHA512 } from 'crypto-js';
import { ref } from 'vue';
import InputCopyable from '../../components/InputCopyable.vue';
import { convertHexToBin } from './hash-text.service';

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
const encoding = useQueryParam<Encoding>({ defaultValue: 'Hex', name: 'encoding' });
const clearText = ref('');

function formatWithEncoding(words: lib.WordArray, encoding: Encoding) {
  if (encoding === 'Bin') {
    return convertHexToBin(words.toString(enc.Hex));
  }

  return words.toString(enc[encoding]);
}

const hashText = (algo: AlgoNames, value: string) => formatWithEncoding(algos[algo](value), encoding.value);
</script>
