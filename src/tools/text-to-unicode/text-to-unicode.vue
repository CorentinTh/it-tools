<script setup lang="ts">
import { type ConverterId, converters } from './text-to-unicode.service';
import { useCopy } from '@/composable/copy';

const converterId = ref<ConverterId>('fullUnicode');
const skipAscii = ref(true);

const inputText = ref('');
const unicodeFromText = computed(() =>
  inputText.value.trim() === ''
    ? ''
    : converters[converterId.value].escape(inputText.value, skipAscii.value),
);
const { copy: copyUnicode } = useCopy({ source: unicodeFromText });

const inputUnicode = ref('');
const textFromUnicode = computed(() =>
  inputUnicode.value.trim() === '' ? '' : converters[converterId.value].unescape(inputUnicode.value),
);
const { copy: copyText } = useCopy({ source: textFromUnicode });
</script>

<template>
  <div class="outer" flex flex-col gap-6>
    <div class="controls">
      <c-select
        v-model:value="converterId"
        searchable
        label="Conversion type:"
        :options="Object.entries(converters).map(([key, val]) => ({ label: val.config.name, value: key }))"
      />
    </div>
    <c-card class="card" title="Text to Unicode">
      <c-input-text
        v-model:value="inputText"
        multiline
        placeholder="e.g. 'Hello Avengers'"
        label="Enter text to convert to Unicode"
        autosize
        autofocus
        raw-text
        test-id="text-to-unicode-input"
      />
      <c-input-text
        v-model:value="unicodeFromText"
        label="Unicode from your text"
        multiline
        raw-text
        readonly
        mt-2
        placeholder="The unicode representation of your text will be here"
        test-id="text-to-unicode-output"
      />
      <div mt-2 flex justify-start>
        <n-form-item label="Skip ASCII chars with no special meaning?" :show-feedback="false" label-placement="left">
          <n-switch v-model:value="skipAscii" />
        </n-form-item>
      </div>
      <div mt-2 flex justify-center>
        <c-button :disabled="!unicodeFromText" @click="copyUnicode()"> Copy unicode to clipboard </c-button>
      </div>
    </c-card>
    <c-card class="card" title="Unicode to Text">
      <c-input-text
        v-model:value="inputUnicode"
        multiline
        placeholder="Input Unicode"
        label="Enter unicode to convert to text"
        autosize
        raw-text
        test-id="unicode-to-text-input"
      />
      <c-input-text
        v-model:value="textFromUnicode"
        label="Text from your Unicode"
        multiline
        raw-text
        readonly
        mt-2
        placeholder="The text representation of your unicode will be here"
        test-id="unicode-to-text-output"
      />
      <div mt-2 flex justify-center>
        <c-button :disabled="!textFromUnicode" @click="copyText()"> Copy text to clipboard </c-button>
      </div>
    </c-card>
  </div>
</template>

<style lang="less" scoped>
.outer {
  flex: 0 1 1200px;
  margin-inline: 50px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.controls {
  flex: 0 1 100%;
}

.card {
  flex: 1 0 max(40%, 500px);
}
</style>
