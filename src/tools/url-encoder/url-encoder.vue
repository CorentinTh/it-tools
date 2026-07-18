<script setup lang="ts">
import {
  type UrlEncodingMode,
  decodeUrlText,
  encodeUrlText,
  urlEncodingModes,
} from './url-encoder.model';
import { useCopy } from '@/composable/copy';
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const mode = ref<UrlEncodingMode>('component');
const modeDescription = computed(() => urlEncodingModes.find(({ value }) => value === mode.value)?.description ?? '');

const encodeInput = ref('Hello world :)');
const encodeOutput = computed(() => withDefaultOnError(() => encodeUrlText(encodeInput.value, mode.value), ''));

const encodedValidation = useValidation({
  source: encodeInput,
  rules: [
    {
      validator: value => isNotThrowing(() => encodeUrlText(value, mode.value)),
      message: 'This string cannot be encoded as valid UTF-8',
    },
  ],
  watch: [mode],
});

const { copy: copyEncoded } = useCopy({ source: encodeOutput, text: 'Encoded string copied to the clipboard' });

const decodeInput = ref('Hello%20world%20%3A)');
const decodeOutput = computed(() => withDefaultOnError(() => decodeUrlText(decodeInput.value, mode.value), ''));

const decodeValidation = useValidation({
  source: decodeInput,
  rules: [
    {
      validator: value => isNotThrowing(() => decodeUrlText(value, mode.value)),
      message: 'This value contains malformed percent-encoding or invalid UTF-8',
    },
  ],
  watch: [mode],
});

const { copy: copyDecoded } = useCopy({ source: decodeOutput, text: 'Decoded string copied to the clipboard' });
</script>

<template>
  <c-card title="Encoding mode">
    <c-select
      v-model:value="mode"
      label="Standard:"
      :options="urlEncodingModes"
      mb-2
    />
    <p m-0 text-sm op-70>
      {{ modeDescription }}
    </p>
  </c-card>

  <c-card title="Encode">
    <c-input-text
      v-model:value="encodeInput"
      label="Your string :"
      :validation="encodedValidation"

      placeholder="The string to encode"
      rows="2"
      autosize multiline mb-3
    />

    <c-input-text
      label="Your string encoded :"
      :value="encodeOutput"
      multiline
      autosize
      readonly
      placeholder="Your string encoded"
      rows="2"
      mb-3
    />

    <div flex justify-center>
      <c-button @click="copyEncoded()">
        Copy
      </c-button>
    </div>
  </c-card>
  <c-card title="Decode">
    <c-input-text
      v-model:value="decodeInput"
      label="Your encoded string :"
      :validation="decodeValidation"
      multiline
      autosize
      placeholder="The string to decode"
      rows="2"
      mb-3
    />

    <c-input-text
      label="Your string decoded :"
      :value="decodeOutput"
      multiline
      autosize
      readonly
      placeholder="Your string decoded"
      rows="2"
      mb-3
    />

    <div flex justify-center>
      <c-button @click="copyDecoded()">
        Copy
      </c-button>
    </div>
  </c-card>
</template>
