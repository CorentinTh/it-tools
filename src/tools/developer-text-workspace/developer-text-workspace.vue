<script setup lang="ts">
import type { DeveloperTextOperation } from './developer-text-workspace.service';
import { createDeveloperTextWorkerClient } from './developer-text-workspace.worker-client';
import { DEVELOPER_TEXT_MAX_INPUT_BYTES } from './developer-text-workspace.worker.protocol';
import { BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';

const operationOptions: Array<{ label: string; value: DeveloperTextOperation }> = [
  { label: 'Stack trace', value: 'stack-trace' },
  { label: 'Smart replace', value: 'smart-replace' },
  { label: 'Folder tree', value: 'folder-tree' },
  { label: 'Markdown TOC', value: 'markdown-toc' },
];
const examples: Record<DeveloperTextOperation, string> = {
  'stack-trace': 'TypeError: Cannot read properties of undefined\n    at loadConfig (src/config.ts:24:11)\n    at async start (src/index.ts:8:3)\nCaused by: Error: Missing environment value',
  'smart-replace': 'api-v1.example.test\napi-v2.example.test\nstatic.example.test',
  'folder-tree': 'src/components/Button.vue\nsrc/components/Input.vue\nsrc/main.ts\ntests/app.spec.ts\nREADME.md',
  'markdown-toc': '# Project guide\n\n## Installation\n\n### Linux and macOS\n\n## Installation\n\n```md\n# Ignored code example\n```',
};

const operation = ref<DeveloperTextOperation>('stack-trace');
const source = ref(examples[operation.value]);
const find = ref('api-v(\\d+)');
const replacement = ref('service-$1');
const regex = ref(true);
const caseSensitive = ref(true);
const output = ref('');
const error = ref('');
const status = ref('Ready.');
const isRunning = ref(false);
const completedSignature = ref('');
const client = createDeveloperTextWorkerClient();
const signature = computed(() => [operation.value, source.value, find.value, replacement.value, regex.value, caseSensitive.value].join('\0'));
const stale = computed(() => Boolean(output.value && signature.value !== completedSignature.value));
const inputTooLarge = computed(() => exceedsUtf8ByteLimit(source.value, DEVELOPER_TEXT_MAX_INPUT_BYTES));
const isReplace = computed(() => operation.value === 'smart-replace');

watch(operation, () => {
  source.value = examples[operation.value];
  output.value = '';
  error.value = '';
  status.value = 'Example loaded. Select Run.';
});
watch([source, find, replacement, regex, caseSensitive], () => {
  error.value = '';
  if (!isRunning.value) {
    status.value = stale.value ? 'Input changed. Run to refresh the output.' : 'Ready.';
  }
});

async function run() {
  if (!source.value.trim() || inputTooLarge.value || (isReplace.value && !find.value)) {
    error.value = inputTooLarge.value
      ? 'Text input is limited to 1 MiB of UTF-8 text.'
      : isReplace.value && !find.value ? 'Enter text or a regular expression to find.' : 'Enter text to process.';
    return;
  }
  isRunning.value = true;
  error.value = '';
  status.value = 'Processing locally…';
  const requestedSignature = signature.value;
  try {
    const result = await client.run({
      operation: operation.value,
      source: source.value,
      find: find.value,
      replacement: replacement.value,
      regex: regex.value,
      caseSensitive: caseSensitive.value,
    });
    output.value = result.value;
    completedSignature.value = requestedSignature;
    status.value = `Completed in ${Math.round(result.elapsedMs)} ms.`;
  }
  catch (caught) {
    const taskError = caught instanceof BoundedTextTaskError ? caught : undefined;
    error.value = taskError?.message ?? 'Text processing failed.';
    status.value = taskError?.code === 'cancelled' ? taskError.message : 'Processing failed.';
  }
  finally {
    isRunning.value = false;
  }
}

function download() {
  downloadTextFile({ content: output.value, filename: operation.value === 'markdown-toc' ? 'table-of-contents.md' : 'developer-text.txt' });
}

const { copy } = useCopy({ source: output, text: 'Processed text copied to the clipboard' });
onBeforeUnmount(() => client.dispose());
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Local text processing">
      Content stays in this browser session. This workspace formats and transforms text only: it does not execute stack traces, regular expressions as code, Markdown, HTML, or file paths.
    </c-alert>

    <c-card class="c-task-options" title="Transformation">
      <c-buttons-select v-model:value="operation" :options="operationOptions" label="Operation" label-position="top" />
      <template v-if="isReplace">
        <div grid mt-3 gap-3 md:grid-cols-2>
          <c-input-text v-model:value="find" label="Find" :maxlength="256" raw-text data-test-id="developer-text-find" />
          <c-input-text v-model:value="replacement" label="Replacement" :maxlength="65536" raw-text data-test-id="developer-text-replacement" />
        </div>
        <div mt-3 flex flex-wrap gap-4>
          <c-switch v-model:value="regex" label="Regular expression" />
          <c-switch v-model:value="caseSensitive" label="Case sensitive" />
        </div>
      </template>
    </c-card>

    <c-input-text
      v-model:value="source"
      label="Text input"
      placeholder="Paste text to process"
      test-id="developer-text-input"
      raw-text monospace multiline
      :rows="18"
    />
    <div class="c-task-actions">
      <c-button type="primary" :disabled="!source.trim() || inputTooLarge || isRunning" data-test-id="developer-text-run" @click="run">
        {{ isRunning ? 'Processing…' : 'Run' }}
      </c-button>
      <c-button v-if="isRunning" type="warning" @click="client.cancel('Text processing was cancelled.')">
        Cancel
      </c-button>
    </div>
    <p class="c-task-status" data-test-id="developer-text-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="error" title="Text processing error" data-test-id="developer-text-error">
      {{ error }}
    </c-alert>
    <c-alert v-if="stale" title="Output uses previous input">
      Select Run to process the current text.
    </c-alert>

    <c-input-text
      :value="output"
      label="Result"
      placeholder="Processed text will appear here"
      test-id="developer-text-output"
      raw-text monospace multiline readonly
      :rows="18"
    />
    <div class="c-task-actions">
      <c-button :disabled="!output" @click="copy()">
        Copy
      </c-button>
      <c-button :disabled="!output" @click="download">
        Download
      </c-button>
    </div>
  </div>
</template>
