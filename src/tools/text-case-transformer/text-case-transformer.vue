<script setup lang="ts">
import { useCopy } from '@/composable/copy';

const str = ref('Lorem ipsum dolor sit amet');
const formattedStr = ref('');

const { copy } = useCopy({ source: formattedStr });
</script>

<template>
  <div>
    <c-input-text v-model:value="str" raw-text placeholder="Enter text" label="Text:" clearable multiline rows="10" />

    <div mt-4 flex gap-10px>
      <c-button @click="formattedStr = str.toUpperCase()">
        Uppercase
      </c-button>

      <c-button @click="formattedStr = str.toLowerCase()">
        Lowercase
      </c-button>

      <c-button @click="formattedStr = str.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())">
        Capitalize Words
      </c-button>

      <c-button @click="formattedStr = str.replace(/(?:^|\.\s*)\w/g, letter => letter.toUpperCase())">
        Capitalize Sentences
      </c-button>
    </div>

    <div mt-4 flex gap-10px>
      <c-button @click="formattedStr = str.replace(/[^\w\s]/g, ' ')">
        Remove Punctuation
      </c-button>

      <c-button @click="formattedStr = str.replace(/\s+/g, ' ').trim()">
        Remove Extra Spaces
      </c-button>

      <c-button @click="formattedStr = str.split('').reverse().join('')">
        Reverse Text
      </c-button>
    </div>

    <c-card v-if="formattedStr" mt-60px max-w-600px flex items-center justify-between gap-5px font-mono>
      <div break-anywhere text-wrap v-html="formattedStr.replace(/\n/g, '<br>')" />

      <c-button @click="copy()">
        <icon-mdi:content-copy />
      </c-button>
    </c-card>
  </div>
</template>
