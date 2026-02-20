<script setup lang="ts">
import { useScriptTag } from '@vueuse/core';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const { load: loadPlurimath } = useScriptTag('/plurimath/index.js', undefined, { type: 'module', manual: true });

const formats = [
  { value: 'asciimath', label: 'AsciiMath' },
  { value: 'latex', label: 'Latex' },
  { value: 'mathml', label: 'MathML' },
  { value: 'html', label: 'Html' },
  { value: 'omml', label: 'OOML' },
];

const source = ref('');
const sourceFormat = useQueryParamOrStorage({ name: 'src', storageName: 'math-fmts-conv:src', defaultValue: 'latex' });
const targetFormat = useQueryParamOrStorage({ name: 'target', storageName: 'math-fmts-conv:target', defaultValue: 'mathml' });
const target = computedAsync(async () => {
  const sourceValue = source.value;
  const sourceFormatValue = sourceFormat.value;
  const targetFormatValue = targetFormat.value;
  if (!sourceValue) {
    return '';
  }
  if (sourceFormatValue === targetFormatValue) {
    return sourceValue;
  }
  await loadPlurimath();
  return new Promise<string>((resolve, _reject) => {
    try {
      const formula = new Plurimath(sourceValue, sourceFormatValue);
      let result;
      switch (targetFormatValue) {
        case 'asciimath':
          result = formula.toAsciimath();
          break;
        case 'latex':
          result = formula.toLatex();
          break;
        case 'mathml':
          result = formula.toMathml();
          break;
        case 'html':
          result = formula.toHtml();
          break;
        case 'omml':
          result = formula.toOmml();
          break;
        default:
          result = '# unknown format';
          break;
      }
      resolve(result);
    }
    catch (e: any) {
      resolve(`# error converting formula: ${e.toString()}`);
    }
  });
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="source"
      multiline
      placeholder="Put your math expression here..."
      rows="5"
      label="Mathematical expression to convert"
      raw-text
      mb-5
    />
    <c-select
      v-model:value="sourceFormat"
      :options="formats"
      placeholder="Source format"
    />

    <n-divider />

    <c-select
      v-model:value="targetFormat"
      :options="formats"
      placeholder="Source format"
    />
    <textarea-copyable v-if="target" :value="target" :language="targetFormat" word-wrap />
  </div>
</template>
