<script setup lang="ts">
import type { NetworkSuiteOperation } from './network-calculation-suite.service';
import { calculateCidrReport, calculateTtl, encodeDhcpOption43, inspectPort } from './network-calculation-suite.service';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';

const operationOptions: Array<{ label: string; value: NetworkSuiteOperation }> = [
  { label: 'CIDR & exclusion', value: 'cidr' },
  { label: 'DHCP Option 43', value: 'dhcp-option-43' },
  { label: 'Port info', value: 'port' },
  { label: 'TTL', value: 'ttl' },
];
const protocolOptions = [{ label: 'TCP', value: 'tcp' }, { label: 'UDP', value: 'udp' }] as const;
const operation = ref<NetworkSuiteOperation>('cidr');
const source = ref('192.0.2.17/28');
const membership = ref('192.0.2.31');
const exclusion = ref('192.0.2.24/30');
const suboption = ref('241');
const protocol = ref<'tcp' | 'udp'>('tcp');
const output = ref('');
const error = ref('');
const completedSignature = ref('');
const signature = computed(() => [operation.value, source.value, membership.value, exclusion.value, suboption.value, protocol.value].join('\0'));
const stale = computed(() => Boolean(output.value && signature.value !== completedSignature.value));

const labels = computed(() => {
  if (operation.value === 'cidr') {
    return { input: 'Parent IPv4 or IPv6 CIDR', placeholder: '192.0.2.17/28', multiline: false };
  }
  if (operation.value === 'dhcp-option-43') {
    return { input: 'IPv4 controller addresses', placeholder: '192.0.2.1\n198.51.100.2', multiline: true };
  }
  if (operation.value === 'port') {
    return { input: 'Port number', placeholder: '443', multiline: false };
  }
  return { input: 'TTL in seconds', placeholder: '3600', multiline: false };
});

watch(operation, (value) => {
  source.value = value === 'cidr' ? '192.0.2.17/28' : value === 'dhcp-option-43' ? '192.0.2.1\n198.51.100.2' : value === 'port' ? '443' : '3600';
  output.value = '';
  error.value = '';
});
watch([source, membership, exclusion, suboption, protocol], () => {
  error.value = '';
});

function calculate() {
  error.value = '';
  try {
    output.value = operation.value === 'cidr'
      ? calculateCidrReport(source.value, membership.value, exclusion.value)
      : operation.value === 'dhcp-option-43'
        ? encodeDhcpOption43(source.value, suboption.value)
        : operation.value === 'port'
          ? inspectPort(source.value, protocol.value)
          : calculateTtl(source.value);
    completedSignature.value = signature.value;
  }
  catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'The network calculation failed.';
  }
}

function download() {
  downloadTextFile({ content: output.value, filename: `network-${operation.value}.txt` });
}

const { copy } = useCopy({ source: output, text: 'Network report copied to the clipboard' });
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Exact offline calculations">
      Address math is performed locally with exact 32-bit or 128-bit BigInt values. Port labels and DHCP vendor conventions are informational; this tool does not scan or contact a network.
    </c-alert>

    <c-card class="c-task-options" title="Calculation">
      <c-buttons-select v-model:value="operation" :options="operationOptions" label="Operation" label-position="top" />
      <div v-if="operation === 'cidr'" grid mt-3 gap-3 md:grid-cols-2>
        <c-input-text v-model:value="membership" label="Address to test (optional)" placeholder="192.0.2.31" :maxlength="80" raw-text monospace />
        <c-input-text v-model:value="exclusion" label="Contained CIDR to exclude (optional)" placeholder="192.0.2.24/30" :maxlength="84" raw-text monospace />
      </div>
      <c-input-text v-if="operation === 'dhcp-option-43'" v-model:value="suboption" label="Vendor suboption code" placeholder="241" :maxlength="3" inputmode="numeric" raw-text mt-3 />
      <c-buttons-select v-if="operation === 'port'" v-model:value="protocol" :options="protocolOptions" label="Transport protocol" label-position="top" mt-3 />
    </c-card>

    <c-input-text
      v-model:value="source"
      :label="labels.input"
      :placeholder="labels.placeholder"
      test-id="network-suite-input"
      :maxlength="4096"
      raw-text monospace
      :multiline="labels.multiline"
      :rows="labels.multiline ? 8 : undefined"
    />
    <div class="c-task-actions">
      <c-button type="primary" :disabled="!source.trim()" data-test-id="network-suite-run" @click="calculate">
        Calculate
      </c-button>
    </div>
    <c-alert v-if="error" title="Invalid network input" data-test-id="network-suite-error">
      {{ error }}
    </c-alert>
    <c-alert v-if="stale" title="Result uses previous inputs">
      Select Calculate to apply the current values.
    </c-alert>

    <c-input-text :value="output" label="Result" test-id="network-suite-output" raw-text monospace readonly multiline :rows="18" />
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
