<template>
  <c-card title="Escape html entities">
    <n-form-item label="Your string :">
      <n-input
        v-model:value="escapeInput"
        type="textarea"
        placeholder="The string to escape"
        :autosize="{ minRows: 2 }"
      />
    </n-form-item>

    <n-form-item label="Your string escaped :">
      <n-input
        type="textarea"
        readonly
        placeholder="Your string escaped"
        :value="escapeOutput"
        :autosize="{ minRows: 2 }"
      />
    </n-form-item>

    <n-space justify="center">
      <c-button @click="copyEscaped"> Copy </c-button>
    </n-space>
  </c-card>
  <c-card title="Unescape html entities">
    <n-form-item label="Your escaped string :">
      <n-input
        v-model:value="unescapeInput"
        type="textarea"
        placeholder="The string to unescape"
        :autosize="{ minRows: 2 }"
      />
    </n-form-item>

    <n-form-item label="Your string unescaped :">
      <n-input
        :value="unescapeOutput"
        type="textarea"
        readonly
        placeholder="Your string unescaped"
        :autosize="{ minRows: 2 }"
      />
    </n-form-item>

    <n-space justify="center">
      <c-button @click="copyUnescaped"> Copy </c-button>
    </n-space>
  </c-card>
</template>

<script setup lang="ts">
import { escape, unescape } from 'lodash';
import { computed, ref } from 'vue';
import { useCopy } from '@/composable/copy';

const escapeInput = ref('<title>IT Tool</title>');
const escapeOutput = computed(() => escape(escapeInput.value));
const { copy: copyEscaped } = useCopy({ source: escapeOutput });

const unescapeInput = ref('&lt;title&gt;IT Tool&lt;/title');
const unescapeOutput = computed(() => unescape(unescapeInput.value));
const { copy: copyUnescaped } = useCopy({ source: unescapeOutput });
</script>
