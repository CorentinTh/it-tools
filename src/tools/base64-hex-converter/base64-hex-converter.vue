<script setup lang="ts">
import Base64 from 'js-base64';
import hexArray from 'hex-array';
import { useCopy } from '@/composable/copy';
import { isValidBase64 } from '@/utils/base64';

const textInput = ref('');
const base64Output = computed(() => {
  try {
    return Base64.fromUint8Array(hexArray.fromString(textInput.value));
  }
  catch (e: any) {
    return e.toString();
  }
});
const { copy: copyTextBase64 } = useCopy({ source: base64Output, text: 'Base64 Hex Array copied to the clipboard' });

const uppercase = ref(false);
const grouping = ref(0);
const rowlength = ref(0);

const base64Input = ref('');
const textOutput = computed(() => {
  try {
    return hexArray.toString(Base64.toUint8Array(base64Input.value), {
      uppercase: uppercase.value,
      grouping: grouping.value,
      rowlength: rowlength.value,
    });
  }
  catch (e: any) {
    return e.toString();
  }
},
);
const { copy: copyText } = useCopy({ source: textOutput, text: 'Hex Array copied to the clipboard' });
const b64ValidationRules = [
  {
    message: 'Invalid base64 string',
    validator: (value: string) => isValidBase64(value.trim()),
  },
];
</script>

<template>
  <c-card title="Hex Array to Base64">
    <c-input-text
      v-model:value="textInput"
      multiline
      placeholder="Put your Hex Array here..."
      rows="5"
      label="Hex Array to encode"
      raw-text
      mb-5
    />

    <c-input-text
      label="Base64 of Hex Array"
      :value="base64Output"
      multiline
      readonly
      placeholder="The base64 encoding of your Hex Array will be here"
      rows="5"
      mb-5
    />

    <div flex justify-center>
      <c-button @click="copyTextBase64()">
        Copy base64
      </c-button>
    </div>
  </c-card>

  <c-card title="Base64 to Hex Array">
    <n-space align="baseline" justify="center" mb-1>
      <n-form-item label="Uppercase" label-placement="left">
        <n-switch v-model:value="uppercase" />
      </n-form-item>
      <n-form-item label="Group by" label-placement="left">
        <n-input-number v-model:value="grouping" :min="0" style="width: 6em" mr-1 /> digits (0 = no grouping)
      </n-form-item>
      <n-form-item label="Split as rows by" label-placement="left">
        <n-input-number v-model:value="rowlength" :min="0" style="width: 6em" mr-1 /> group of digits (0 = no rows)
      </n-form-item>
    </n-space>
    <c-input-text
      v-model:value="base64Input"
      multiline
      placeholder="Your base64 Hex Array..."
      rows="5"
      :validation-rules="b64ValidationRules"
      label="Base64 Hex Array to decode"
      mb-5
    />

    <c-input-text
      v-model:value="textOutput"
      label="Decoded Hex Array"
      placeholder="The decoded Hex Array will be here"
      multiline
      rows="5"
      readonly
      mb-5
    />

    <div flex justify-center>
      <c-button @click="copyText()">
        Copy decoded Hex Array
      </c-button>
    </div>
  </c-card>
</template>
