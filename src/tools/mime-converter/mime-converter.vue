<script setup lang="ts">
import libmime from 'libmime';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { withDefaultOnError } from '@/utils/defaults';

const encodedInput = ref('');
const decodedOutput = computed(() => withDefaultOnError(() => libmime.decodeWords(encodedInput.value), '# invalid encoded value'));

const rawInput = ref('');
const encodedQOutput = computed(() => withDefaultOnError(() => libmime.encodeWord(rawInput.value, 'Q'), ''));
const encodedBOutput = computed(() => withDefaultOnError(() => libmime.encodeWord(rawInput.value, 'B'), ''));
</script>

<template>
  <div style="max-width: 600px;">
    <c-card title="Encode string in Encoded-Word format">
      <c-input-text
        v-model:value="rawInput"
        multiline
        placeholder="Put your string here..."
        rows="5"
        label="String to encode"
        raw-text
        mb-5
      />

      <div>
        <h3>Quotted Printable encoded string</h3>
        <TextareaCopyable
          :value="encodedQOutput"
          placeholder="The Quotted Printable encoded version of your string will be here"
          mb-5
        />
      </div>

      <div>
        <h3>Base64 encoded string</h3>
        <TextareaCopyable
          :value="encodedBOutput"
          placeholder="The Base64 encoded version of your string will be here"
          mb-5
        />
      </div>
    </c-card>

    <c-card title="Decode string in Encoded-Word format">
      <c-input-text
        v-model:value="encodedInput"
        multiline
        placeholder="Your encoded string..."
        rows="5"
        label="Encoded string to decode"
        mb-5
      />

      <div>
        <h3>Decoded string</h3>
        <TextareaCopyable
          v-model:value="decodedOutput"
          placeholder="The decoded string will be here"
          mb-5
        />
      </div>
    </c-card>
  </div>
</template>
