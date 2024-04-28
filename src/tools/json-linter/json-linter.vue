<script setup lang="ts">
import linter from 'jsonlint-mod';

const jsonContent = ref(
  `{ 
    a: True; 
    b=5 
  }`,
);

const conversionError = computed(() => {
  try {
    linter.parse(jsonContent.value);
    return null;
  }
  catch (e: any) {
    return e.toString();
  }
});

const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
};
</script>

<template>
  <div>
    <c-label label="Paste your JSON file content:">
      <div relative w-full>
        <c-monaco-editor
          v-model:value="jsonContent"
          theme="vs-dark"
          language="yaml"
          height="250px"
          :options="MONACO_EDITOR_OPTIONS"
        />
      </div>
    </c-label>

    <div v-if="conversionError">
      <n-alert title="The following errors occured" type="error" mt-5>
        <pre>
        {{ conversionError }}
        </pre>
      </n-alert>
    </div>
    <div v-else>
      <n-alert type="success" mt-5>
        Validation successful!
      </n-alert>
    </div>
  </div>
</template>
