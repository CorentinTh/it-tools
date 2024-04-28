<script setup lang="ts">
import { decode, encode } from 'morsee';
import { computedCatch } from '@/composable/computed/catchedComputed';

const encodeInput = ref('');
const encodeOutput = computed(() => encode(encodeInput.value));

const decodeInput = ref('');
const [decodeOutput, decodeError] = computedCatch(() => decode(decodeInput.value), {
  defaultValue: '',
  defaultErrorMessage: 'Unable to decode your text',
});
</script>

<template>
  <c-card title="Encode">
    <div flex gap-3>
      <c-input-text
        v-model:value="encodeInput"
        label="Your text:"
        placeholder="The string to encode"
        rows="4"
        multiline raw-text monospace autosize flex-1
      />
    </div>
    <c-input-text
      label="Your text encoded to Morse code:"
      :value="encodeOutput"
      rows="3"
      placeholder="Your string encoded"
      multiline monospace readonly autosize mt-5
    />
  </c-card>
  <c-card title="Decode">
    <div flex gap-3>
      <c-input-text
        v-model:value="decodeInput"
        label="Your Morse encoded text:"
        placeholder="The string to decode"
        rows="4"
        multiline raw-text monospace autosize flex-1
      />
    </div>
    <c-alert v-if="decodeError" type="error" mt-12 title="Error while decoding">
      {{ decodeError }}
    </c-alert>
    <c-input-text
      v-else
      label="Your decoded text:"
      :value="decodeOutput"
      placeholder="Your string decoded"
      rows="3"
      multiline monospace readonly autosize mt-5
    />
  </c-card>
</template>
