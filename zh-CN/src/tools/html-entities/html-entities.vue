<script setup lang="ts">
import { escape, unescape } from 'lodash';

import { useCopy } from '@/composable/copy';

const escapeInput = ref('<title>IT Tool</title>');
const escapeOutput = computed(() => escape(escapeInput.value));
const { copy: copyEscaped } = useCopy({ source: escapeOutput });

const unescapeInput = ref('&lt;title&gt;IT Tool&lt;/title&gt;');
const unescapeOutput = computed(() => unescape(unescapeInput.value));
const { copy: copyUnescaped } = useCopy({ source: unescapeOutput });
</script>

<template>
  <c-card title="转义 HTML">
    <n-form-item label="待转义：">
      <c-input-text
        v-model:value="escapeInput"
        multiline
        placeholder="待转义的HTML代码"
        rows="3"
        autosize
        raw-text
      />
    </n-form-item>

    <n-form-item label="已转义：">
      <c-input-text
        multiline
        readonly
        placeholder="已转义的HTML代码"
        :value="escapeOutput"
        rows="3"
        autosize
      />
    </n-form-item>

    <div flex justify-center>
      <c-button @click="copyEscaped()">
        复制
      </c-button>
    </div>
  </c-card>
  <c-card title="取消转义 HTML">
    <n-form-item label="待取消转义：">
      <c-input-text
        v-model:value="unescapeInput"
        multiline
        placeholder="待取消转义的HTML代码"
        rows="3"
        autosize
        raw-text
      />
    </n-form-item>

    <n-form-item label="已取消转义：">
      <c-input-text
        :value="unescapeOutput"
        multiline
        readonly
        placeholder="已取消转义的HTML代码"
        rows="3"
        autosize
      />
    </n-form-item>

    <div flex justify-center>
      <c-button @click="copyUnescaped()">
        复制
      </c-button>
    </div>
  </c-card>
</template>
