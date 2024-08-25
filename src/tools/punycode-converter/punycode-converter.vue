<script setup lang="ts">
import { toASCII, toUnicode } from 'punycode/';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const punycodeInput = ref('');
const intlOutput = computed(
  () => {
    try {
      return toUnicode(punycodeInput.value?.trim());
    }
    catch (e: any) {
      return e.toString();
    }
  },
);

const intlInput = ref('');
const punycodeOutput = computed(
  () => {
    try {
      return toASCII(intlInput.value?.trim());
    }
    catch (e: any) {
      return e.toString();
    }
  },
);
</script>

<template>
  <div max-w-600>
    <c-card title="Punycode to International">
      <c-input-text
        v-model:value="punycodeInput"
        placeholder="Put your punycode domain name or email to decode..."
        label="Punycode Domain name/Email"
        raw-text
      />

      <n-divider />

      <TextareaCopyable
        label="Decoded Domain name/Email"
        :value="intlOutput"
        readonly
      />
    </c-card>

    <c-card title="International to Punycode" mt-5>
      <c-input-text
        v-model:value="intlInput"
        placeholder="Put your international domain or email name here..."
        label="Domain name or email to encode"
        raw-text
      />

      <n-divider />

      <TextareaCopyable
        label="Punycode Domain name/Email"
        :value="punycodeOutput"
        readonly
      />
    </c-card>
  </div>
</template>
