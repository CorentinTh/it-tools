<script setup lang="ts">
import type { lib } from 'crypto-js';
import { enc } from 'crypto-js';

import crc from 'crc';
import InputCopyable from '../../components/InputCopyable.vue';
import { convertHexToBin } from '../hash-text/hash-text.service';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { withDefaultOnError } from '@/utils/defaults';

const status = ref<'idle' | 'done' | 'error' | 'processing'>('idle');
const text = ref('');
const file = ref<File | null>(null);

const defaultCRCValues = {
  crc1: '',
  crc8: '',
  crc81wire: '',
  crc8dvbs2: '',
  crc16: '',
  crc16ccitt: '',
  crc16modbus: '',
  crc16kermit: '',
  crc16xmodem: '',
  crc24: '',
  crc32: '',
  crc32mpeg: '',
  crcjam: '',
};
type AlgoNames = keyof typeof defaultCRCValues;

function getCRCs(content: Uint8Array | string) {
  return {
    crc1: crc.crc1(content).toString(16),
    crc8: crc.crc8(content).toString(16),
    crc81wire: crc.crc81wire(content).toString(16),
    crc8dvbs2: crc.crc8dvbs2(content).toString(16),
    crc16: crc.crc16(content).toString(16),
    crc16ccitt: crc.crc16ccitt(content).toString(16),
    crc16modbus: crc.crc16modbus(content).toString(16),
    crc16kermit: crc.crc16kermit(content).toString(16),
    crc16xmodem: crc.crc16xmodem(content).toString(16),
    crc24: crc.crc24(content).toString(16),
    crc32: crc.crc32(content).toString(16),
    crc32mpeg: crc.crc32mpeg2(content).toString(16),
    crcjam: crc.crcjam(content).toString(16),
  };
}
const hashes = ref(defaultCRCValues);
async function onUpload(uploadedFile: File) {
  status.value = 'processing';

  file.value = uploadedFile;
  const buffer = await uploadedFile.arrayBuffer();

  text.value = '';
  try {
    hashes.value = getCRCs(new Uint8Array(buffer));
    status.value = 'done';
  }
  catch (e) {
    status.value = 'error';
  }
}

const algoWasmNames = Object.keys(defaultCRCValues) as AlgoNames[];
type Encoding = keyof typeof enc | 'Bin';

const encoding = useQueryParamOrStorage<Encoding>({ defaultValue: 'Hex', storageName: 'hash-text:encoding', name: 'encoding' });

function formatWithEncoding(words: lib.WordArray, encoding: Encoding) {
  if (encoding === 'Bin') {
    return convertHexToBin(words.toString(enc.Hex));
  }

  return words.toString(enc[encoding]);
}

const CRCValues = computed(() => withDefaultOnError(() => {
  const encodingValue = encoding.value;
  const hashesValue = hashes.value;

  const ret = defaultCRCValues;
  for (const algo of algoWasmNames) {
    ret[algo] = formatWithEncoding(enc.Hex.parse(hashesValue[algo]), encodingValue);
  }
  return ret;
}, defaultCRCValues));

watch(text,
  (_, newValue) => {
    if (newValue === ''){
      return;
    }

    file.value = null;
    hashes.value = getCRCs(newValue);
    status.value = 'done';
  },
);
</script>

<template>
  <div>
    <c-card>
      <c-file-upload
        title="Drag and drop a file here, or click to select a file"
        @file-upload="onUpload"
      />

      <p>OR</p>

      <c-input-text
        v-model:value="text"
        multiline raw-text
        placeholder="Paste string to CRC..." rows="3"
        autosize autofocus label="Your text to CRC:"
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
        An error occured hashing file.
      </c-alert>
      <n-spin
        v-if="status === 'processing'"
        size="small"
      />
    </div>

    <c-card v-if="status === 'done'" :title="file === null ? 'CRC of text' : `CRC of ${file?.name}`">
      <div v-for="algo in algoWasmNames" :key="algo" style="margin: 5px 0">
        <n-input-group>
          <n-input-group-label style="flex: 0 0 120px">
            {{ algo.toUpperCase() }}
          </n-input-group-label>
          <InputCopyable :value="CRCValues[algo]" readonly />
        </n-input-group>
      </div>
    </c-card>
  </div>
</template>
