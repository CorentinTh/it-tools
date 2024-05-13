<script setup lang="ts">
import { addSlashes, removeSlashes } from 'slashes';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const unescapedInput = ref('');
const escapedOutput = computed(
  () => {
    try {
      return addSlashes(unescapedInput.value);
    }
    catch (e: any) {
      return e.toString();
    }
  },
);

const escapedInput = ref('');
const unescapedOutput = computed(
  () => {
    try {
      return removeSlashes(escapedInput.value);
    }
    catch (e: any) {
      return e.toString();
    }
  },
);
</script>

<template>
  <div max-w-600>
    <c-card title="Escape JSON string">
      <c-input-text
        v-model:value="unescapedInput"
        placeholder="Put your string to escape..."
        label="String to escape"
        raw-text
        multiline
        rows="5"
        mb-5
      />

      <n-divider />

      <TextareaCopyable
        label="Escaped string"
        :value="escapedOutput"
        multiline
        readonly
        rows="5"
        mb-5
      />
    </c-card>

    <c-card title="Unescape JSON string" mt-5>
      <c-input-text
        v-model:value="escapedInput"
        placeholder="Put your string to unescape..."
        label="String to unescape"
        raw-text
        multiline
        rows="5"
        mb-5
      />

      <n-divider />

      <TextareaCopyable
        label="Unescaped string"
        :value="unescapedOutput"
        multiline
        readonly
        rows="5"
        mb-5
      />
    </c-card>
  </div>
</template>
