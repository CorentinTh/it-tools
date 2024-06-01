<script setup lang="ts">
import {
  createAdler32, // (): Promise<IHasher>
  createBLAKE2b, // (bits?: number, key?: IDataType): Promise<IHasher> // default is 512 bits
  createBLAKE2s, // (bits?: number, key?: IDataType): Promise<IHasher> // default is 256 bits
  createBLAKE3, // (bits?: number, key?: IDataType): Promise<IHasher> // default is 256 bits
  createCRC32, // (): Promise<IHasher>
  createCRC32C, // (): Promise<IHasher>
  createKeccak, // (bits?: 224 | 256 | 384 | 512): Promise<IHasher> // default is 512 bits
  createMD4, // (): Promise<IHasher>
  createMD5, // (): Promise<IHasher>
  createRIPEMD160, // (): Promise<IHasher>
  createSHA1, // (): Promise<IHasher>
  createSHA224, // (): Promise<IHasher>
  createSHA256, // (): Promise<IHasher>
  createSHA3, // (bits?: 224 | 256 | 384 | 512): Promise<IHasher> // default is 512 bits
  createSHA384, // (): Promise<IHasher>
  createSHA512, // (): Promise<IHasher>
  createSM3, // (): Promise<IHasher>
  createWhirlpool, // (): Promise<IHasher>
// createXXHash32, //(seed: number): Promise<IHasher>
// createXXHash64, //(seedLow: number, seedHigh: number): Promise<IHasher>
// createXXHash3, //(seedLow: number, seedHigh: number): Promise<IHasher>
// createXXHash128, //(seedLow: number, seedHigh: number): Promise<IHasher>
} from 'hash-wasm';
import type { lib } from 'crypto-js';
import { enc } from 'crypto-js';

import type { IHasher } from 'hash-wasm/dist/lib/WASMInterface';
import InputCopyable from '../../components/InputCopyable.vue';
import { convertHexToBin } from '../hash-text/hash-text.service';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { withDefaultOnError } from '@/utils/defaults';

const status = ref<'idle' | 'done' | 'error' | 'processing'>('idle');
const file = ref<File | null>(null);

async function getHashersAsync() {
  return {
    adler32: await createAdler32(), // (): Promise<IHasher>
    BLAKE2b: await createBLAKE2b(), // (bits?: number, key?: IDataType): Promise<IHasher> // default is 512 bits
    BLAKE2s: await createBLAKE2s(), // (bits?: number, key?: IDataType): Promise<IHasher> // default is 256 bits
    BLAKE3: await createBLAKE3(), // (bits?: number, key?: IDataType): Promise<IHasher> // default is 256 bits
    CRC32: await createCRC32(), // (): Promise<IHasher>
    CRC32C: await createCRC32C(), // (): Promise<IHasher>
    Keccak_224: await createKeccak(224), // (bits?: 224 | 256 | 384 | 512): Promise<IHasher> // default is 512 bits
    Keccak_256: await createKeccak(256), // (bits?: 224 | 256 | 384 | 512): Promise<IHasher> // default is 512 bits
    Keccak_384: await createKeccak(384), // (bits?: 224 | 256 | 384 | 512): Promise<IHasher> // default is 512 bits
    Keccak_512: await createKeccak(512), // (bits?: 224 | 256 | 384 | 512): Promise<IHasher> // default is 512 bits
    MD4: await createMD4(), // (): Promise<IHasher>
    MD5: await createMD5(), // (): Promise<IHasher>
    RIPEMD160: await createRIPEMD160(), // (): Promise<IHasher>
    SHA1: await createSHA1(), // (): Promise<IHasher>
    SHA224: await createSHA224(), // (): Promise<IHasher>
    SHA256: await createSHA256(), // (): Promise<IHasher>
    SHA3_224: await createSHA3(224), // (bits?: 224 | 256 | 384 | 512): Promise<IHasher> // default is 512 bits
    SHA3_256: await createSHA3(256), // (bits?: 224 | 256 | 384 | 512): Promise<IHasher> // default is 512 bits
    SHA3_384: await createSHA3(384), // (bits?: 224 | 256 | 384 | 512): Promise<IHasher> // default is 512 bits
    SHA3_512: await createSHA3(512), // (bits?: 224 | 256 | 384 | 512): Promise<IHasher> // default is 512 bits
    SHA384: await createSHA384(), // (): Promise<IHasher>
    SHA512: await createSHA512(), // (): Promise<IHasher>
    SM3: await createSM3(), // (): Promise<IHasher>
    Whirlpool: await createWhirlpool(), // (): Promise<IHasher>
  };
}

const defaultHashWasmValues = {
  adler32: '',
  BLAKE2b: '',
  BLAKE2s: '',
  BLAKE3: '',
  CRC32: '',
  CRC32C: '',
  Keccak_224: '',
  Keccak_256: '',
  Keccak_384: '',
  Keccak_512: '',
  MD4: '',
  MD5: '',
  RIPEMD160: '',
  SHA1: '',
  SHA224: '',
  SHA256: '',
  SHA3_224: '',
  SHA3_256: '',
  SHA3_384: '',
  SHA3_512: '',
  SHA384: '',
  SHA512: '',
  SM3: '',
  Whirlpool: '',
};
const chunkSize = 64 * 1024 * 1024;
const fileReader = new FileReader();

async function hashChunkAsync(chunk: Blob, hashers: IHasher[]) {
  return new Promise<void>((resolve, _reject) => {
    fileReader.onload = async (e) => {
      const view = new Uint8Array((e.target?.result as ArrayBuffer)!);
      for (const hasher of hashers) {
        hasher.update(view);
      }
      resolve();
    };

    fileReader.readAsArrayBuffer(chunk);
  });
}

type AlgoWasmNames = keyof typeof defaultHashWasmValues;
const algoWasmNames = Object.keys(defaultHashWasmValues) as AlgoWasmNames[];

async function hashFileAsync(file: File) {
  const chunkNumber = Math.floor(file.size / chunkSize);

  const hashers = await getHashersAsync();
  for (let i = 0; i <= chunkNumber; i++) {
    const chunk = file.slice(
      chunkSize * i,
      Math.min(chunkSize * (i + 1), file.size),
    );
    await hashChunkAsync(chunk, Object.values(hashers));
  }

  const ret = { ...defaultHashWasmValues };
  for (const algo of algoWasmNames) {
    ret[algo as AlgoWasmNames] = hashers[algo as AlgoWasmNames].digest();
  }
  return Promise.resolve(ret);
}

const hashes = ref(defaultHashWasmValues);
async function onUpload(uploadedFile: File) {
  file.value = uploadedFile;

  status.value = 'processing';
  try {
    status.value = 'done';

    hashes.value = await hashFileAsync(uploadedFile);
  }
  catch (e) {
    status.value = 'error';
  }
}

type Encoding = keyof typeof enc | 'Bin';

const encoding = useQueryParamOrStorage<Encoding>({ defaultValue: 'Hex', storageName: 'hash-text:encoding', name: 'encoding' });

function formatWithEncoding(words: lib.WordArray, encoding: Encoding) {
  if (encoding === 'Bin') {
    return convertHexToBin(words.toString(enc.Hex));
  }

  return words.toString(enc[encoding]);
}

const hashWasmValues = computed(() => withDefaultOnError(() => {
  const encodingValue = encoding.value;
  const hashesValue = hashes.value;

  const ret = defaultHashWasmValues;
  for (const algo of algoWasmNames) {
    ret[algo] = formatWithEncoding(enc.Hex.parse(hashesValue[algo]), encodingValue);
  }
  return ret;
}, defaultHashWasmValues));
</script>

<template>
  <div>
    <c-card>
      <c-file-upload
        title="Drag and drop a file here, or click to select a file"
        @file-upload="onUpload"
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
    </c-card>

    <div mt-3 flex justify-center>
      <c-alert v-if="status === 'error'" type="error">
        An error occured hashing file '{{ file?.name }}'.
      </c-alert>
      <n-spin
        v-if="status === 'processing'"
        size="small"
      />
    </div>

    <c-card v-if="status === 'done'" :title="`Hashes of ${file?.name}`">
      <div v-for="algo in algoWasmNames" :key="algo" style="margin: 5px 0">
        <n-input-group>
          <n-input-group-label style="flex: 0 0 120px">
            {{ algo.toUpperCase() }}
          </n-input-group-label>
          <InputCopyable :value="hashWasmValues[algo]" readonly />
        </n-input-group>
      </div>
    </c-card>
  </div>
</template>
