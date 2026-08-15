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
  <div class="c-tool-workbench c-tool-stack">
    <c-card title="Escape html entities">
      <c-input-text
        v-model:value="escapeInput"
        label="Input string"

        placeholder="The string to escape"
        rows="8"
        raw-text multiline
      />

      <c-input-text
        class="mt-4"
        :value="escapeOutput"
        label="Escaped string"
        multiline
        placeholder="Your string escaped"
        rows="8"
        readonly
      />

      <div class="c-generator-actions mt-4">
        <c-button @click="copyEscaped()">
          Copy
        </c-button>
      </div>
    </c-card>
    <c-card title="Unescape html entities">
      <c-input-text
        v-model:value="unescapeInput"
        label="Escaped input string"
        multiline
        placeholder="The string to unescape"
        rows="8"
        raw-text
      />

      <c-input-text
        class="mt-4"
        :value="unescapeOutput"
        label="Unescaped string"
        multiline
        placeholder="Your string unescaped"
        rows="8"
        readonly
      />

      <div class="c-generator-actions mt-4">
        <c-button @click="copyUnescaped()">
          Copy
        </c-button>
      </div>
    </c-card>
  </div>
</template>
