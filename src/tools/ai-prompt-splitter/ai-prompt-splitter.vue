<script setup lang="ts">
import promptSplitter from 'chatgpt-prompt-splitter';
import { useValidation } from '@/composable/validation';

const prompt = ref('');
const splitLength = ref(1024);

const splittedPrompts = computed(() => {
  try {
    return promptSplitter({
      prompt: prompt.value,
      splitLength: splitLength.value,
      newLine: true,
    });
  }
  catch (e: any) {
    return [e.toString()];
  }
});

const promptValidation = useValidation({
  source: prompt,
  rules: [
    {
      validator: v => v !== '',
      message: 'Prompt must not be empty',
    },
  ],
});
</script>

<template>
  <div style="max-width: 600px;">
    <c-card title="Prompt and options" mb-2>
      <c-input-text
        v-model:value="prompt"
        label="Full Prompt"
        multiline
        placeholder="Put your full prompt here..."
        rows="10"
        :validation="promptValidation"
        mb-2
      />
      <n-form-item label="Character length for each chunk">
        <n-input-number v-model:value="splitLength" :min="1" />
      </n-form-item>
    </c-card>

    <c-card title="Splitted prompts">
      <div v-for="(splittedPrompt, index) in splittedPrompts" :key="index">
        <TextareaCopyable :value="splittedPrompt" />
      </div>
    </c-card>
  </div>
</template>
