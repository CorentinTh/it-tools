<script setup lang="ts">
import JsonEditorVue from 'json-editor-vue';
import { type AfterSelection, type InsideSelection, type JSONEditorSelection, type KeySelection, type MultiSelection, type ValueSelection, isAfterSelection, isInsideSelection, isKeySelection, isMultiSelection, isValueSelection, stringifyJSONPath } from 'vanilla-jsoneditor';
import 'vanilla-jsoneditor/themes/jse-theme-dark.css';
import { useStyleStore } from '@/stores/style.store';

const styleStore = useStyleStore();

const jsonText = ref('{ "a": { "array": [1, 2, 3] } }');
const jsonPath = ref('');

function updateJsonPath(selection: JSONEditorSelection) {
  if (isAfterSelection (selection)) {
    jsonPath.value = `$.${stringifyJSONPath((selection as AfterSelection).path)}`;
  }
  else if (isInsideSelection (selection)) {
    jsonPath.value = `$.${stringifyJSONPath((selection as InsideSelection).path)}`;
  }
  else if (isKeySelection (selection)) {
    jsonPath.value = `$.${stringifyJSONPath((selection as KeySelection).path)}`;
  }
  else if (isValueSelection (selection)) {
    jsonPath.value = `$.${stringifyJSONPath((selection as ValueSelection).path)}`;
  }
  else if (isMultiSelection (selection)) {
    jsonPath.value = `$.${stringifyJSONPath((selection as MultiSelection).focusPath)}`;
  }
  else {
    jsonPath.value = 'No available in this mode';
  }
}
</script>

<template>
  <div>
    <JsonEditorVue
      v-model="jsonText"
      mode="text"
      :class="styleStore.isDarkTheme ? 'jse-theme-dark' : ''"
      :on-select="updateJsonPath"
      mb-2
    />

    <n-form-item label="Current Selected Node JSONPath:">
      <textarea-copyable :value="jsonPath" />
    </n-form-item>

    <n-divider />

    <n-form-item label="Your edited JSON:">
      <textarea-copyable :value="jsonText" language="json" />
    </n-form-item>
  </div>
</template>
