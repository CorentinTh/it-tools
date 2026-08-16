<script setup lang="ts">
import type { DevopsSecretOperation } from './devops-secret-helper.service';
import { createDevopsSecretWorkerClient } from './devops-secret-helper.worker-client';
import { BoundedTextTaskError } from '@/utils/bounded-text-task';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';

const operations: Array<{ label: string; value: DevopsSecretOperation }> = [
  { label: 'Vault encrypt', value: 'vault-encrypt' },
  { label: 'Vault decrypt', value: 'vault-decrypt' },
  { label: 'htpasswd generate', value: 'htpasswd-generate' },
  { label: 'htpasswd verify', value: 'htpasswd-verify' },
];
const operation = ref<DevopsSecretOperation>('vault-encrypt');
const source = ref('');
const password = ref('');
const username = ref('');
const cost = ref(10);
const vaultId = ref('');
const output = ref('');
const status = ref('Ready. Sensitive values stay in this tab only.');
const error = ref('');
const isRunning = ref(false);
const client = createDevopsSecretWorkerClient();
const isVault = computed(() => operation.value.startsWith('vault-'));
const requiresSource = computed(() => operation.value !== 'htpasswd-generate');
const sourceLabel = computed(() => operation.value === 'vault-encrypt' ? 'Plaintext' : operation.value === 'vault-decrypt' ? 'Ansible Vault text' : 'bcrypt htpasswd entry');

watch(operation, () => {
  output.value = '';
  error.value = '';
  status.value = 'Mode changed. Enter values and select Run.';
});
watch([source, password, username, cost, vaultId], () => {
  error.value = '';
});

async function run() {
  isRunning.value = true;
  error.value = '';
  status.value = 'Processing locally in a disposable worker…';
  try {
    const result = await client.run({ operation: operation.value, source: source.value, password: password.value, username: username.value, cost: cost.value, vaultId: vaultId.value });
    output.value = result.value;
    status.value = `Completed locally in ${Math.round(result.elapsedMs)} ms.`;
  }
  catch (caught) {
    error.value = caught instanceof BoundedTextTaskError ? caught.message : 'Secret operation failed.';
    status.value = 'Processing failed.';
  }
  finally {
    isRunning.value = false;
  }
}

function clearAll() {
  client.cancel();
  source.value = '';
  password.value = '';
  username.value = '';
  vaultId.value = '';
  output.value = '';
  error.value = '';
  status.value = 'Sensitive values cleared from this tool.';
}
const { copy } = useCopy({ source: output, text: 'Secret-format output copied' });
function download() {
  downloadTextFile({ content: output.value, filename: isVault.value ? 'ansible-vault.txt' : '.htpasswd' });
}
onBeforeUnmount(() => client.dispose());
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-alert title="Local compatibility helper — not a secret manager">
      Plaintext and passwords are sent only to a disposable browser worker and are never persisted. JavaScript memory cannot guarantee zeroization; clear the fields and close the tab after use.
    </c-alert>
    <c-card class="c-tool-panel" title="Format and operation">
      <c-buttons-select v-model:value="operation" :options="operations" label="Secret format operation" label-position="top" />
      <p mt-3 text-sm op-70>
        <template v-if="isVault">
          Supports authenticated Ansible Vault 1.1 AES256 and labelled 1.2 AES256 only: PBKDF2-SHA-256, AES-256-CTR, PKCS#7, and HMAC-SHA-256.
        </template>
        <template v-else>
          Generates and verifies bcrypt entries only. Apache APR1-MD5, SHA-1, crypt, and plaintext formats are intentionally not generated.
        </template>
      </p>
    </c-card>

    <c-input-text v-if="requiresSource" v-model:value="source" class="c-tool-panel" :label="sourceLabel" raw-text monospace multiline :rows="14" />
    <c-input-text v-if="operation === 'htpasswd-generate'" v-model:value="username" label="Username" raw-text maxlength="255" />
    <c-input-number v-if="operation === 'htpasswd-generate'" v-model:value="cost" label="Bcrypt cost" :min="4" :max="14" />
    <c-input-text v-if="operation === 'vault-encrypt'" v-model:value="vaultId" label="Vault ID (optional; emits format 1.2)" placeholder="production" raw-text maxlength="64" />
    <c-input-text v-model:value="password" label="Password" type="password" raw-text autocomplete="new-password" />

    <div class="c-task-actions">
      <c-button type="primary" :disabled="isRunning || !password || (requiresSource && !source) || (operation === 'htpasswd-generate' && !username)" data-test-id="devops-secret-run" @click="run">
        {{ isRunning ? 'Processing…' : 'Run' }}
      </c-button>
      <c-button v-if="isRunning" type="warning" @click="client.cancel()">
        Cancel
      </c-button>
      <c-button @click="clearAll">
        Clear sensitive values
      </c-button>
    </div>
    <p class="c-task-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="error" title="Secret-format error">
      {{ error }}
    </c-alert>
    <c-input-text :value="output" class="c-tool-panel" label="Output" test-id="devops-secret-output" raw-text monospace multiline readonly :rows="14" />
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
