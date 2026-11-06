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
  <c-card title="Escape html entities">
    <n-form-item label="Your string :">
      <c-input-text
        v-model:value="escapeInput"
        multiline
        placeholder="The string to escape"
        rows="3"
        autosize
        raw-text
      />
    </n-form-item>

    <n-form-item label="Your string escaped :">
      <c-input-text
        multiline
        readonly
        placeholder="Your string escaped"
        :value="escapeOutput"
        rows="3"
        autosize
      />
    </n-form-item>

    <div flex justify-center>
      <c-button @click="copyEscaped()">
        Copy
      </c-button>
    </div>
  </c-card>
  <c-card title="Unescape html entities">
    <n-form-item label="Your escaped string :">
      <c-input-text
        v-model:value="unescapeInput"
        multiline
        placeholder="The string to unescape"
        rows="3"
        autosize
        raw-text
      />
    </n-form-item>

    <n-form-item label="Your string unescaped :">
      <c-input-text
        :value="unescapeOutput"
        multiline
        readonly
        placeholder="Your string unescaped"
        rows="3"
        autosize
      />
    </n-form-item>

    <div flex justify-center>
      <c-button @click="copyUnescaped()">
        Copy
      </c-button>
    </div>
  </c-card>
</template>
