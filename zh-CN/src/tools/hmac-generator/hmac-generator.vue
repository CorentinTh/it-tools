<script setup lang="ts">
import type { lib } from 'crypto-js';
import {
  HmacMD5,
  HmacRIPEMD160,
  HmacSHA1,
  HmacSHA224,
  HmacSHA256,
  HmacSHA3,
  HmacSHA384,
  HmacSHA512,
  enc,
} from 'crypto-js';

import { convertHexToBin } from '../hash-text/hash-text.service';
import { useCopy } from '@/composable/copy';

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

<template>
  <div flex flex-col gap-4>
    <c-input-text v-model:value="plainText" multiline raw-text placeholder="用于计算哈希值的纯文本..." rows="3" autosize autofocus label="用于计算哈希值的纯文本" />
    <c-input-text v-model:value="secret" raw-text placeholder="输入密钥..." label="密钥" clearable />

    <div flex gap-2>
      <c-select
        v-model:value="hashFunction" label="哈希函数"
        flex-1
        placeholder="选择哈希函数..."
        :options="Object.keys(algos).map((label) => ({ label, value: label }))"
      />
      <c-select
        v-model:value="encoding" label="结果编码"
        flex-1
        placeholder="选择结果编码..."
        :options="[
          {
            label: '二进制',
            value: 'Bin',
          },
          {
            label: '十六进制',
            value: 'Hex',
          },
          {
            label: 'Base64',
            value: 'Base64',
          },
          {
            label: 'Base64-url（URL编码）',
            value: 'Base64url',
          },
        ]"
      />
    </div>
    <input-copyable v-model:value="hmac" type="textarea" placeholder="HMAC计算结果..." label="HMAC计算结果" />
    <div flex justify-center>
      <c-button @click="copy()">
        复制 HMAC
      </c-button>
    </div>
  </div>
</template>
