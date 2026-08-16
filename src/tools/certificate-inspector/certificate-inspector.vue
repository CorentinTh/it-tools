<script setup lang="ts">
import { createCertificateInspectorWorkerClient } from './certificate-inspector.worker-client';
import { CERTIFICATE_INSPECTOR_MAX_INPUT_BYTES } from './certificate-inspector.worker.protocol';
import { BoundedTextTaskError } from '@/utils/bounded-text-task';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';

const source = ref(`-----BEGIN PUBLIC KEY-----
MIIBSzCCAQMGByqGSM49AgEwgfcCAQEwLAYHKoZIzj0BAQIhAP////8AAAABAAAA
AAAAAAAAAAAA////////////////MFsEIP////8AAAABAAAAAAAAAAAAAAAA////
///////////8BCBaxjXYqjqT57PrvVV2mIa8ZR0GsMxTsPY7zjw+J9JgSwMVAMSd
NgiG5wSTamZ44ROdJreBn36QBEEEaxfR8uEsQkf4vOblY6RA8ncDfYEt6zOg9KE5
RdiYwpZP40Li/hp/m47n60p8D54WK84zV2sxXs7LtkBoN79R9QIhAP////8AAAAA
//////////+85vqtpxeehPO5ysL8YyVRAgEBA0IABAhWw2Dn6IprmihmNyEt8r6Z
39MTTIHqEV+ZNBl5COgDzjuWvhIfFydGoz1jj7IqOLNTDENvPXoX9b2tg+PD/Cc=
-----END PUBLIC KEY-----`);
const output = ref('');
const error = ref('');
const status = ref('Ready.');
const isRunning = ref(false);
const inspectedSource = ref('');
const client = createCertificateInspectorWorkerClient();
const stale = computed(() => Boolean(output.value && source.value !== inspectedSource.value));
const inputTooLarge = computed(() => exceedsUtf8ByteLimit(source.value, CERTIFICATE_INSPECTOR_MAX_INPUT_BYTES));

watch(source, () => {
  error.value = '';
  if (!isRunning.value) {
    status.value = stale.value ? 'Input changed. Inspect to refresh the result.' : 'Ready.';
  }
});

async function inspect() {
  if (!source.value.trim() || inputTooLarge.value) {
    error.value = inputTooLarge.value ? 'PEM input is limited to 1.5 MiB.' : 'Enter one PEM block.';
    return;
  }
  isRunning.value = true;
  error.value = '';
  status.value = 'Inspecting locally…';
  const requestedSource = source.value;
  try {
    const result = await client.run({ source: requestedSource });
    output.value = result.value;
    inspectedSource.value = requestedSource;
    status.value = `Inspection completed in ${Math.round(result.elapsedMs)} ms.`;
  }
  catch (caught) {
    const taskError = caught instanceof BoundedTextTaskError ? caught : undefined;
    error.value = taskError?.message ?? 'Certificate inspection failed.';
    status.value = taskError?.code === 'cancelled' ? taskError.message : 'Inspection failed.';
  }
  finally {
    isRunning.value = false;
  }
}

const { copy } = useCopy({ source: output, text: 'Certificate inspection copied to the clipboard' });
function download() {
  downloadTextFile({ content: output.value, filename: 'certificate-inspection.json' });
}
onBeforeUnmount(() => client.dispose());
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-alert title="Local structural inspection">
      Parses one X.509 certificate, PKCS#10 CSR, or SubjectPublicKeyInfo PEM block and computes a SHA-256 fingerprint. It does not validate signatures, chains, hostname, revocation, or trust. Private-key PEM blocks are rejected and input is never saved.
    </c-alert>

    <c-input-text
      v-model:value="source"
      class="c-tool-panel"
      label="Certificate, CSR, or public key PEM"
      placeholder="-----BEGIN CERTIFICATE-----"
      test-id="certificate-input"
      raw-text monospace multiline
      :rows="18"
    />
    <div class="c-task-actions">
      <c-button type="primary" :disabled="!source.trim() || inputTooLarge || isRunning" data-test-id="certificate-inspect" @click="inspect">
        {{ isRunning ? 'Inspecting…' : 'Inspect' }}
      </c-button>
      <c-button v-if="isRunning" type="warning" @click="client.cancel('Certificate inspection was cancelled.')">
        Cancel
      </c-button>
    </div>
    <p class="c-task-status" data-test-id="certificate-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="error" title="Inspection error" data-test-id="certificate-error">
      {{ error }}
    </c-alert>
    <c-alert v-if="stale" title="Result uses previous input">
      Select Inspect to process the current PEM.
    </c-alert>

    <c-input-text
      :value="output"
      class="c-tool-panel"
      label="Inspection result"
      placeholder="Decoded metadata will appear here"
      test-id="certificate-output"
      raw-text monospace multiline readonly
      :rows="18"
    />
    <div class="c-task-actions">
      <c-button :disabled="!output" @click="copy()">
        Copy
      </c-button>
      <c-button :disabled="!output" @click="download">
        Download JSON
      </c-button>
    </div>
  </div>
</template>
