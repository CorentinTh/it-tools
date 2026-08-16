<script setup lang="ts">
import type { ListComparisonMode } from './list-comparison.service';
import { createListComparisonWorkerClient } from './list-comparison.worker-client';
import { LIST_COMPARISON_MAX_SIDE_BYTES } from './list-comparison.worker.protocol';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';

const left = ref('alpha\nbeta\nbeta\ngamma');
const right = ref('beta\ngamma\ndelta');
const mode = ref<ListComparisonMode>('set');
const trimItems = ref(true);
const ignoreCase = ref(false);
const ignoreEmpty = ref(true);
const output = ref('');
const error = ref('');
const status = ref('Ready.');
const running = ref(false);
const completedSignature = ref('');
const client = createListComparisonWorkerClient();
const signature = computed(() => `${left.value}\0${right.value}\0${mode.value}\0${trimItems.value}\0${ignoreCase.value}\0${ignoreEmpty.value}`);
const stale = computed(() => Boolean(output.value && completedSignature.value !== signature.value));
const inputTooLarge = computed(() => exceedsUtf8ByteLimit(left.value, LIST_COMPARISON_MAX_SIDE_BYTES) || exceedsUtf8ByteLimit(right.value, LIST_COMPARISON_MAX_SIDE_BYTES));
const { copy } = useCopy({ source: output, text: 'Comparison report copied' });

async function compare() {
  if (running.value || inputTooLarge.value || (!left.value && !right.value)) {
    return;
  }
  running.value = true;
  error.value = '';
  status.value = 'Comparing locally…';
  const requestedSignature = signature.value;
  try {
    const result = await client.run({ left: left.value, right: right.value, mode: mode.value, trimItems: trimItems.value, ignoreCase: ignoreCase.value, ignoreEmpty: ignoreEmpty.value });
    output.value = result.value;
    completedSignature.value = requestedSignature;
    status.value = `Completed in ${Math.round(result.elapsedMs)} ms.`;
  }
  catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'List comparison failed.';
    status.value = 'Comparison failed.';
  }
  finally {
    running.value = false;
  }
}

onBeforeUnmount(() => client.dispose());
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Bounded local comparison">
      Lists stay in this tab. Comparison runs only after an explicit action in a disposable worker; each side is limited to 1 MiB and 100,000 lines. Ordered mode additionally caps LCS work at 250,000 cells.
    </c-alert>
    <c-card class="c-task-options" title="Comparison options">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-select v-model:value="mode" label="Comparison mode" :options="[{ label: 'Set — collapse duplicates', value: 'set' }, { label: 'Multiset — count duplicates', value: 'multiset' }, { label: 'Ordered — LCS alignment', value: 'ordered' }]" />
        <div flex flex-col gap-2>
          <c-switch v-model:value="trimItems" label="Trim each line" />
          <c-switch v-model:value="ignoreCase" label="Ignore letter case" />
          <c-switch v-model:value="ignoreEmpty" label="Ignore empty lines" />
        </div>
      </div>
    </c-card>
    <c-input-text v-model:value="left" label="Left list" test-id="list-comparison-left" raw-text monospace multiline :rows="12" />
    <c-input-text v-model:value="right" label="Right list" test-id="list-comparison-right" raw-text monospace multiline :rows="12" />
    <div class="c-task-actions">
      <c-button type="primary" :disabled="running || inputTooLarge || (!left && !right)" data-test-id="list-comparison-run" @click="compare">
        {{ running ? 'Comparing…' : 'Compare lists' }}
      </c-button>
      <c-button v-if="running" @click="client.cancel('List comparison was cancelled.')">
        Cancel
      </c-button>
    </div>
    <p class="c-task-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="inputTooLarge" title="Input too large">
      Each list is limited to 1 MiB of UTF-8 text.
    </c-alert>
    <c-alert v-if="error" title="Comparison error" data-test-id="list-comparison-error">
      {{ error }}
    </c-alert>
    <c-alert v-if="stale" title="Output uses previous input">
      Compare again to apply the current lists and options.
    </c-alert>
    <c-input-text :value="output" label="Comparison report" data-test-id="list-comparison-output" raw-text monospace multiline readonly :rows="18" />
    <div class="c-task-actions">
      <c-button :disabled="!output" @click="copy()">
        Copy
      </c-button>
      <c-button :disabled="!output" @click="downloadTextFile({ content: output, filename: 'list-comparison.txt' })">
        Download
      </c-button>
    </div>
  </div>
</template>
