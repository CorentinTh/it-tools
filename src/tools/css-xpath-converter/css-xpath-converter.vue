<script setup lang="ts">
import xPathToCss from 'xpath-to-css';
import cssToXpath from 'csstoxpath';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const cssInput = ref('');
const xpathOutput = computed(
  () => {
    try {
      return cssToXpath(cssInput.value);
    }
    catch (e: any) {
      return e.toString();
    }
  },
);

const xpathInput = ref('');
const cssOutput = computed(
  () => {
    try {
      return xPathToCss(xpathInput.value);
    }
    catch (e: any) {
      return e.toString();
    }
  },
);
</script>

<template>
  <div max-w-600>
    <c-card title="CSS to XPath">
      <c-input-text
        v-model:value="cssInput"
        placeholder="Put your CSS selector here..."
        label="CSS selector to convert"
        raw-text
        mb-5
      />

      <n-divider />

      <TextareaCopyable
        label="XPath expression"
        :value="xpathOutput"
        readonly
        mb-5
      />
    </c-card>

    <c-card title="XPath to CSS" mt-5>
      <c-input-text
        v-model:value="xpathInput"
        placeholder="Put your XPath expression here..."
        label="XPath expression to convert"
        raw-text
        mb-5
      />

      <n-divider />

      <TextareaCopyable
        label="CSS Selector"
        :value="cssOutput"
        readonly
        mb-5
      />
    </c-card>
  </div>
</template>
