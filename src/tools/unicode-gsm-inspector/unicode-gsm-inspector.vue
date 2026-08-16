<script setup lang="ts">
import { UNICODE_INSPECTOR_MAX_INPUT_BYTES, UNICODE_INSPECTOR_MAX_SEARCH_CHARACTERS, inspectUnicodeText } from './unicode-gsm-inspector.service';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';

const source = ref('Hello ^ world 👩‍💻 — café');
const search = ref('U+1F469');
const output = ref('');
const error = ref('');
const status = ref('Ready.');
const completedSignature = ref('');
const signature = computed(() => `${source.value}\0${search.value}`);
const stale = computed(() => Boolean(output.value && completedSignature.value !== signature.value));
const inputTooLarge = computed(() => exceedsUtf8ByteLimit(source.value, UNICODE_INSPECTOR_MAX_INPUT_BYTES));
const { copy } = useCopy({ source: output, text: 'Unicode report copied' });

function inspect() {
  if (!source.value || inputTooLarge.value) {
    return;
  }
  try {
    const result = inspectUnicodeText(source.value, search.value);
    output.value = result.report;
    completedSignature.value = signature.value;
    error.value = '';
    status.value = `Inspected ${result.codePointCount.toLocaleString('en-US')} code points; SMS estimate uses ${result.smsEncoding}.`;
  }
  catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'Unicode inspection failed.';
    status.value = 'Inspection failed.';
  }
}
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Local Unicode and SMS analysis">
      Text stays in this tab. The report distinguishes code points, UTF-16 units, UTF-8 bytes, grapheme clusters, normalization, and GSM-7 membership. SMS segments are an estimate without national-language shift tables or carrier-specific behavior.
    </c-alert>
    <c-card class="c-task-options" title="Inspection options">
      <c-input-text v-model:value="search" label="Find literal text or code point" placeholder="é or U+1F600" :maxlength="UNICODE_INSPECTOR_MAX_SEARCH_CHARACTERS" raw-text monospace />
    </c-card>
    <c-input-text v-model:value="source" label="Text to inspect" test-id="unicode-gsm-input" raw-text monospace multiline :rows="12" />
    <div class="c-task-actions">
      <c-button type="primary" :disabled="!source || inputTooLarge" data-test-id="unicode-gsm-run" @click="inspect">
        Inspect text
      </c-button>
    </div>
    <p class="c-task-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="inputTooLarge" title="Input too large">
      Text is limited to 64 KiB of UTF-8 data and 4,096 code points.
    </c-alert>
    <c-alert v-if="error" title="Inspection error" data-test-id="unicode-gsm-error">
      {{ error }}
    </c-alert>
    <c-alert v-if="stale" title="Output uses previous input">
      Inspect again to apply the current text or search.
    </c-alert>
    <c-input-text :value="output" label="Unicode and GSM-7 report" data-test-id="unicode-gsm-output" raw-text monospace multiline readonly :rows="20" />
    <div class="c-task-actions">
      <c-button :disabled="!output" @click="copy()">
        Copy
      </c-button>
      <c-button :disabled="!output" @click="downloadTextFile({ content: output, filename: 'unicode-gsm-report.txt' })">
        Download
      </c-button>
    </div>
  </div>
</template>
