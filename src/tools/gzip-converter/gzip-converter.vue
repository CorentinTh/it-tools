<script setup lang="ts">
import * as fflate from 'fflate';
import { Base64 } from 'js-base64';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { withDefaultOnError } from '@/utils/defaults';

const compressedInput = ref('');
const decompressedOutput = computed(() => withDefaultOnError(() => {
  const compressedBuf = Base64.toUint8Array(compressedInput.value);
  return fflate.strFromU8(fflate.decompressSync(compressedBuf));
}, '# invalid compressed base64 string'));

const rawInput = ref('');
const compressedGzipOutput = computed(() => withDefaultOnError(() => Base64.fromUint8Array(fflate.gzipSync(fflate.strToU8(rawInput.value))), ''));
const compressedDeflateOutput = computed(() => withDefaultOnError(() => Base64.fromUint8Array(fflate.deflateSync(fflate.strToU8(rawInput.value))), ''));
const compressedZlibOutput = computed(() => withDefaultOnError(() => Base64.fromUint8Array(fflate.zlibSync(fflate.strToU8(rawInput.value))), ''));
</script>

<template>
  <div style="max-width: 600px;">
    <c-card title="Compress string" mb-5>
      <c-input-text
        v-model:value="rawInput"
        multiline
        placeholder="Put your string here..."
        rows="5"
        label="String to compress"
        raw-text
        mb-5
      />

      <div>
        <h3>GZIP compressed string</h3>
        <TextareaCopyable
          :value="compressedGzipOutput"
          :word-wrap="true"
          multiline
          placeholder="The GZip compressed version of your string will be here"
          mb-5
        />
      </div>

      <div>
        <h3>Zlib compressed string</h3>
        <TextareaCopyable
          :value="compressedZlibOutput"
          :word-wrap="true"
          multiline
          placeholder="The Zlib compressed version of your string will be here"
          mb-5
        />
      </div>

      <div>
        <h3>Deflate compressed string</h3>
        <TextareaCopyable
          :value="compressedDeflateOutput"
          :word-wrap="true"
          multiline
          placeholder="The Deflate compressed version of your string will be here"
          mb-5
        />
      </div>
    </c-card>

    <c-card title="Decompress string">
      <c-input-text
        v-model:value="compressedInput"
        multiline
        placeholder="Your compressed string..."
        rows="5"
        label="Compressed string to decompress"
        mb-5
      />

      <div>
        <h3>Decompressed string</h3>
        <TextareaCopyable
          v-model:value="decompressedOutput"
          :word-wrap="true"
          multiline
          placeholder="The decompressed string will be here"
          mb-5
        />
      </div>
    </c-card>
  </div>
</template>
