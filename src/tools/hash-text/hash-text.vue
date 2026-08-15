<script setup lang="ts">
import type { lib } from 'crypto-js';
import { MD5, RIPEMD160, SHA1, SHA224, SHA256, SHA3, SHA384, SHA512, enc } from 'crypto-js';

import InputCopyable from '../../components/InputCopyable.vue';
import { convertHexToBin } from './hash-text.service';
import { useQueryParam } from '@/composable/queryParams';

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

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-card title="Input">
      <c-input-text
        v-model:value="clearText"
        label="Text to hash"
        placeholder="Your string to hash..."
        rows="8"

        raw-text autofocus multiline
      />

      <c-select
        v-model:value="encoding"
        class="mt-4"
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
    </c-card>

    <c-card title="Digests">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <InputCopyable
          v-for="algo in algoNames"
          :key="algo"
          :value="hashText(algo, clearText)"
          :label="algo"
          readonly
          monospace
        />
      </div>
    </c-card>
  </div>
</template>
