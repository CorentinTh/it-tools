<script setup lang="ts">
import {
  CLI_COMMAND_MAX_BYTES,
  type CliDialect,
  type CliDocument,
  appendCliArgument,
  getCliTokenRole,
  parseCliCommand,
  renderCliCommand,
} from './cli-command-editor.service';
import { useCopy } from '@/composable/copy';

const examples: Record<CliDialect, string> = {
  posix: 'rg -n --glob \'*.ts\' --glob \'*.vue\' -- \'TODO item\' src | sort > matches.txt',
  powershell: 'Get-ChildItem -Recurse -Filter \'*.ts\' | Select-String \'TODO item\' > matches.txt',
};
const dialectOptions: Array<{ label: string; value: CliDialect }> = [
  { label: 'POSIX shell', value: 'posix' },
  { label: 'PowerShell', value: 'powershell' },
];

const dialect = ref<CliDialect>('posix');
const source = ref(examples.posix);
const document = ref<CliDocument>();
const error = ref('');
const status = ref('Ready to parse.');
const output = computed(() => document.value ? renderCliCommand(document.value) : '');

function parse() {
  try {
    document.value = parseCliCommand(source.value, dialect.value);
    error.value = '';
    status.value = `Parsed ${document.value.tokens.length.toLocaleString('en-US')} tokens. Unchanged input is reproduced byte-for-byte.`;
  }
  catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'The command could not be parsed.';
    status.value = 'Parsing failed.';
  }
}

function loadExample() {
  source.value = examples[dialect.value];
  document.value = undefined;
  error.value = '';
  status.value = 'Example loaded. Select Parse command.';
}

function removeToken(index: number) {
  document.value?.tokens.splice(index, 1);
}

function moveToken(index: number, direction: -1 | 1) {
  if (!document.value) {
    return;
  }
  const target = index + direction;
  if (target < 0 || target >= document.value.tokens.length) {
    return;
  }
  const [token] = document.value.tokens.splice(index, 1);
  document.value.tokens.splice(target, 0, token);
}

function addArgument() {
  if (document.value) {
    appendCliArgument(document.value);
  }
}

function applyOutput() {
  if (!document.value) {
    return;
  }
  source.value = output.value;
  parse();
}

watch(dialect, loadExample);
const { copy } = useCopy({ source: output, text: 'Command copied to the clipboard' });
</script>

<template>
  <div class="c-task-layout">
    <c-card title="Command source">
      <c-buttons-select
        v-model:value="dialect"
        :options="dialectOptions"
        label="Shell dialect"
        label-position="top"
      />
      <c-input-text
        v-model:value="source"
        label="Command"
        :maxlength="CLI_COMMAND_MAX_BYTES"
        placeholder="Paste a command to inspect"
        test-id="cli-command-source"
        raw-text multiline monospace
        :rows="6"
        mt-3
      />
      <p mt-2 text-sm op-70>
        Parsing never executes the command. Input stays in this tab and is limited to 64 KiB.
      </p>
      <c-alert v-if="error" title="Command is invalid" mt-3 data-test-id="cli-command-error">
        {{ error }}
      </c-alert>
    </c-card>

    <div class="c-task-actions">
      <c-button type="primary" data-test-id="cli-command-parse" @click="parse">
        Parse command
      </c-button>
      <c-button @click="loadExample">
        Load example
      </c-button>
    </div>

    <c-card v-if="document" title="Editable tokens" data-test-id="cli-command-tokens">
      <div flex flex-col gap-2>
        <div
          v-for="(token, index) in document.tokens"
          :key="token.id"
          grid grid-cols="minmax(6rem,auto) minmax(0,1fr) auto" items-end gap-2
        >
          <span rounded bg-gray-100 px-2 py-2 text-center text-xs font-semibold uppercase dark:bg-gray-800>
            {{ getCliTokenRole(document.tokens, index) }}
          </span>
          <c-input-text
            v-if="token.kind === 'word'"
            v-model:value="token.value"
            :label="`Token ${index + 1}`"
            :test-id="`cli-token-${index}`"
            raw-text monospace
          />
          <code v-else rounded bg-gray-100 px-3 py-2.5 dark:bg-gray-800>{{ token.value }}</code>
          <div flex gap-1>
            <c-button :aria-label="`Move token ${index + 1} left`" :disabled="index === 0" @click="moveToken(index, -1)">
              ←
            </c-button>
            <c-button :aria-label="`Move token ${index + 1} right`" :disabled="index === document.tokens.length - 1" @click="moveToken(index, 1)">
              →
            </c-button>
            <c-button v-if="token.kind === 'word'" :aria-label="`Remove token ${index + 1}`" @click="removeToken(index)">
              Remove
            </c-button>
          </div>
        </div>
      </div>
      <c-button mt-3 data-test-id="cli-command-add" @click="addArgument">
        Add argument
      </c-button>
    </c-card>

    <c-input-text
      :value="output"
      label="Safe command output"
      placeholder="Parsed command output will appear here"
      test-id="cli-command-output"
      raw-text multiline monospace readonly
      :rows="6"
    />

    <p class="c-task-status" data-test-id="cli-command-status" role="status" aria-live="polite">
      {{ status }}
    </p>

    <div class="c-task-actions">
      <c-button :disabled="!output" data-test-id="cli-command-copy" @click="copy()">
        Copy
      </c-button>
      <c-button :disabled="!output" data-test-id="cli-command-apply" @click="applyOutput">
        Apply output as source
      </c-button>
    </div>
  </div>
</template>
