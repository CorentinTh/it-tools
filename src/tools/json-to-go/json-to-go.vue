<template>
  <div style="flex: 0 0 100%">
    <n-space item-style="flex:1 1 0" style="margin: 0 auto; max-width: 600px" :vertical="styleStore.isSmallScreen">
      <n-form-item label="Inline" label-width="500">
        <n-switch size="medium" v-model:value="config.inline" label="Inline type definitions" />
      </n-form-item>
      <n-form-item label="Omitempty" label-width="500">
        <n-switch size="medium" v-model:value="config.omitempty" label="omitempty" />
      </n-form-item>
    </n-space>
  </div>

  <n-form-item label="Your Json">
    <n-input
      ref="inputElement"
      v-model:value="rawSQL"
      placeholder="Put your Json..."
      type="textarea"
      rows="20"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
    />
  </n-form-item>
  <n-form-item label="Go">
    <textarea-copyable :value="goCode" language="go" :follow-height-of="inputElement" />
  </n-form-item>
</template>

<script setup lang="ts">
import jsonToGo from './json2go.js';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useStyleStore } from '@/stores/style.store';
import { format as formatSQL, type FormatFnOptions } from 'sql-formatter';
import { computed, reactive, ref } from 'vue';

const inputElement = ref<HTMLElement>();
const styleStore = useStyleStore();
const config = reactive<Partial<FormatFnOptions>>({
  inline: false,
  omitempty: false,
});

const rawSQL = ref('');
// function jsonToGo(json, typename, flatten = true, example = false, allOmitempty = false)
const goCode = computed(() => {
  let result = jsonToGo(rawSQL.value, '', config.inline, false, config.omitempty);
  if (result.error) {
    return rawSQL ? '' : result.error;
  }
  return result.go;
});
</script>

<style lang="less" scoped>
.result-card {
  position: relative;
  .copy-button {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
