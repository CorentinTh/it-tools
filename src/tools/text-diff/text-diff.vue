<script setup lang="ts">
const wordWrap = useStorage('text-diff:word-wrap', true);
const wordWrapOption = computed(() => (wordWrap.value ? 'on' : 'off') as 'on' | 'off');
</script>

<template>
  <c-card w-full important:flex-1 important:pa-0>
    <div px-3 pt-3>
      <n-form-item label="Word wrap" label-placement="left" label-width="100" :show-feedback="false">
        <n-switch v-model:value="wordWrap" data-test-id="word-wrap" />
      </n-form-item>
    </div>
    <c-diff-editor :options="{ wordWrap: wordWrapOption }" />
  </c-card>
</template>
