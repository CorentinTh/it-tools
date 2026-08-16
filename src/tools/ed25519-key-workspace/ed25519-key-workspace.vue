<script setup lang="ts">
import { Ed25519WorkerClient } from './ed25519-key-workspace.worker-client';
import { ED25519_MAX_COMMENT_CHARACTERS, type Ed25519KeyPair, toEd25519TaskError } from './ed25519-key-workspace.worker.protocol';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const comment = ref('');
const pair = shallowRef<Ed25519KeyPair>();
const status = ref('Add an optional SSH comment, then select Generate. No key is created automatically.');
const error = ref('');
const isRunning = ref(false);
const client = new Ed25519WorkerClient();
let generationId = 0;

async function generate(): Promise<void> {
  if (isRunning.value) {
    return;
  }
  const id = ++generationId;
  isRunning.value = true;
  error.value = '';
  status.value = 'Generating an Ed25519 key pair locally…';
  try {
    const result = await client.run({ comment: comment.value });
    if (id !== generationId) {
      return;
    }
    pair.value = result.value;
    status.value = `Generated locally in ${Math.max(1, Math.round(result.elapsedMs))} ms.`;
  }
  catch (caught) {
    if (id !== generationId) {
      return;
    }
    const taskError = toEd25519TaskError(caught);
    error.value = taskError.message;
    status.value = taskError.code === 'cancelled' || taskError.code === 'unavailable'
      ? taskError.message
      : 'Generation failed.';
  }
  finally {
    if (id === generationId) {
      isRunning.value = false;
    }
  }
}

function cancel(): void {
  if (!isRunning.value) {
    return;
  }
  ++generationId;
  client.cancel();
  isRunning.value = false;
  status.value = pair.value ? 'Generation cancelled. The previous pair remains available.' : 'Generation cancelled.';
}

function clear(): void {
  ++generationId;
  client.cancel();
  pair.value = undefined;
  error.value = '';
  isRunning.value = false;
  status.value = 'Key material cleared from this page.';
}

onBeforeUnmount(() => {
  ++generationId;
  pair.value = undefined;
  client.dispose();
});
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Local, ephemeral, and capability-dependent">
      Uses Web Crypto Ed25519 in a disposable worker. Private material is never uploaded or persisted and disappears on reload. The exported PKCS#8 private key is not password-encrypted; protect it immediately.
    </c-alert>

    <c-card class="c-task-options" title="SSH metadata">
      <c-input-text
        v-model:value="comment"
        label="Optional SSH comment"
        placeholder="developer@example.com"
        test-id="ed25519-comment"
        :maxlength="ED25519_MAX_COMMENT_CHARACTERS"
        :disabled="isRunning"
      />
    </c-card>

    <div class="c-task-actions">
      <c-button type="primary" data-test-id="ed25519-generate" :disabled="isRunning" @click="generate">
        {{ pair ? 'Generate new pair' : 'Generate key pair' }}
      </c-button>
      <c-button v-if="isRunning" type="warning" data-test-id="ed25519-cancel" @click="cancel">
        Cancel
      </c-button>
      <c-button v-if="pair" data-test-id="ed25519-clear" @click="clear">
        Clear key material
      </c-button>
    </div>
    <p class="c-task-status" data-test-id="ed25519-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="error" title="Ed25519 unavailable or failed" data-test-id="ed25519-error">
      {{ error }}
    </c-alert>

    <section v-if="pair" class="c-tool-stack c-task-results" data-test-id="ed25519-results">
      <div class="c-tool-panel">
        <h2 mb-3 text-lg font-600>
          OpenSSH public key
        </h2>
        <TextareaCopyable :value="pair.openSshPublicKey" copy-placement="outside" copy-message="Copy OpenSSH public key" />
      </div>
      <div class="c-tool-panel">
        <h2 mb-3 text-lg font-600>
          SHA-256 fingerprint
        </h2>
        <TextareaCopyable :value="pair.fingerprint" copy-placement="outside" copy-message="Copy fingerprint" />
      </div>
      <div class="c-tool-panel">
        <h2 mb-3 text-lg font-600>
          SPKI public key
        </h2>
        <TextareaCopyable :value="pair.publicKeyPem" copy-placement="outside" copy-message="Copy public key" />
      </div>
      <div class="c-tool-panel" data-test-id="ed25519-private-key">
        <h2 mb-3 text-lg font-600>
          Unencrypted PKCS#8 private key
        </h2>
        <TextareaCopyable :value="pair.privateKeyPem" copy-placement="outside" copy-message="Copy private key" />
      </div>
    </section>
  </div>
</template>
