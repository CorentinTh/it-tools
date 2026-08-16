<script setup lang="ts">
import type { EnterpriseTimestampOperation, SamlBinding } from './saml-enterprise-inspector.service';
import { convertEnterpriseTimestamp } from './saml-enterprise-inspector.service';
import { createSamlInspectionWorkerClient } from './saml-enterprise-inspector.worker-client';
import { BoundedTextTaskError } from '@/utils/bounded-text-task';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';

type InspectorMode = 'saml' | EnterpriseTimestampOperation;
const modeOptions: Array<{ label: string; value: InspectorMode }> = [
  { label: 'SAML message', value: 'saml' },
  { label: 'FILETIME → ISO', value: 'filetime-to-iso' },
  { label: 'ISO → FILETIME', value: 'iso-to-filetime' },
  { label: 'LDAP time → ISO', value: 'ldap-to-iso' },
  { label: 'ISO → LDAP time', value: 'iso-to-ldap' },
];
const bindingOptions: Array<{ label: string; value: SamlBinding }> = [
  { label: 'Auto detect', value: 'auto' },
  { label: 'Base64 / POST', value: 'base64' },
  { label: 'Raw DEFLATE / Redirect', value: 'redirect' },
];
const samlExample = 'PHNhbWxwOkF1dGhuUmVxdWVzdCB4bWxuczpzYW1scD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOnByb3RvY29sIiBJRD0iX2FiYyIgVmVyc2lvbj0iMi4wIiBJc3N1ZUluc3RhbnQ9IjIwMjYtMDgtMTZUMDA6MDA6MDBaIj48c2FtbDpJc3N1ZXIgeG1sbnM6c2FtbD0idXJuOm9hc2lzOm5hbWVzOnRjOlNBTUw6Mi4wOmFzc2VydGlvbiI+aHR0cHM6Ly9pZHAuZXhhbXBsZTwvc2FtbDpJc3N1ZXI+PC9zYW1scDpBdXRoblJlcXVlc3Q+';
const examples: Record<InspectorMode, string> = {
  'saml': samlExample,
  'filetime-to-iso': '133683264000000000',
  'iso-to-filetime': '2024-08-15T00:00:00.000Z',
  'ldap-to-iso': '20260816063000+0200',
  'iso-to-ldap': '2026-08-16T04:30:00.125Z',
};

const mode = ref<InspectorMode>('saml');
const binding = ref<SamlBinding>('auto');
const source = ref(examples.saml);
const output = ref('');
const error = ref('');
const status = ref('Ready.');
const isRunning = ref(false);
const completedSignature = ref('');
const signature = computed(() => `${mode.value}\0${binding.value}\0${source.value}`);
const stale = computed(() => Boolean(output.value && completedSignature.value !== signature.value));
const client = createSamlInspectionWorkerClient();

watch(mode, () => {
  source.value = examples[mode.value];
  output.value = '';
  error.value = '';
  status.value = 'Example loaded. Select Inspect.';
});
watch([source, binding], () => {
  error.value = '';
});

async function inspect() {
  if (!source.value.trim()) {
    error.value = 'Enter a SAML message or enterprise timestamp.';
    return;
  }
  error.value = '';
  isRunning.value = true;
  status.value = mode.value === 'saml' ? 'Decoding locally…' : 'Converting locally…';
  const requestedSignature = signature.value;
  try {
    if (mode.value === 'saml') {
      const result = await client.run({ source: source.value, binding: binding.value });
      output.value = result.value;
      status.value = `Decoded in ${Math.round(result.elapsedMs)} ms. Signature not verified.`;
    }
    else {
      output.value = convertEnterpriseTimestamp(mode.value, source.value);
      status.value = 'Converted.';
    }
    completedSignature.value = requestedSignature;
  }
  catch (caught) {
    const taskError = caught instanceof BoundedTextTaskError ? caught : undefined;
    error.value = taskError?.message ?? (caught instanceof Error ? caught.message : 'Inspection failed.');
    status.value = taskError?.code === 'cancelled' ? taskError.message : 'Inspection failed.';
  }
  finally {
    isRunning.value = false;
  }
}

function download() {
  downloadTextFile({ content: output.value, filename: mode.value === 'saml' ? 'saml-inspection.txt' : 'enterprise-timestamp.txt' });
}

const { copy } = useCopy({ source: output, text: 'Inspection result copied to the clipboard' });
onBeforeUnmount(() => client.dispose());
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Decode is not verification">
      Everything stays in this browser session. SAML output is plain text and is never executed or rendered as HTML. Decoding does not validate signatures, certificates, trust, audience, destination, recipient, or assertion time conditions.
    </c-alert>

    <c-card class="c-task-options" title="Inspector mode">
      <c-buttons-select v-model:value="mode" :options="modeOptions" label="Operation" label-position="top" />
      <c-buttons-select v-if="mode === 'saml'" v-model:value="binding" :options="bindingOptions" label="SAML binding" label-position="top" mt-3 />
    </c-card>

    <c-input-text
      v-model:value="source"
      :label="mode === 'saml' ? 'Encoded SAML request, response, or URL' : 'Timestamp input'"
      test-id="saml-enterprise-input"
      raw-text monospace
      :multiline="mode === 'saml'"
      :rows="mode === 'saml' ? 14 : undefined"
      :maxlength="mode === 'saml' ? 786432 : 256"
    />
    <div class="c-task-actions">
      <c-button type="primary" :disabled="!source.trim() || isRunning" data-test-id="saml-enterprise-run" @click="inspect">
        {{ isRunning ? 'Inspecting…' : 'Inspect' }}
      </c-button>
      <c-button v-if="isRunning" type="warning" @click="client.cancel('SAML inspection was cancelled.')">
        Cancel
      </c-button>
    </div>
    <p class="c-task-status" data-test-id="saml-enterprise-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="error" title="Inspection error" data-test-id="saml-enterprise-error">
      {{ error }}
    </c-alert>
    <c-alert v-if="stale" title="Result uses previous input">
      Select Inspect to process the current input.
    </c-alert>

    <c-input-text :value="output" label="Inspection result" test-id="saml-enterprise-output" raw-text monospace readonly multiline :rows="20" />
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
