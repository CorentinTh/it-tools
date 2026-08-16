<script setup lang="ts">
import {
  DNS_RESOLVERS,
  DnsOverHttpsClient,
  type DnsQueryResult,
  type DnsQueryTask,
  type DnsResolverId,
} from './dns-over-https-query.client';
import { DNS_NAME_MAX_CHARACTERS, DNS_QUERY_TYPES, type DnsQueryType, formatDnsReport } from './dns-over-https-query.service';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';

const resolverId = ref<DnsResolverId>('cloudflare');
const name = ref('example.com');
const typeName = ref<DnsQueryType>('A');
const output = ref('');
const error = ref('');
const status = ref('Ready. No network request has been sent.');
const running = ref(false);
const completedTask = ref<DnsQueryTask | null>(null);
const client = new DnsOverHttpsClient();
let operationId = 0;

const resolver = computed(() => DNS_RESOLVERS.find(candidate => candidate.id === resolverId.value) ?? DNS_RESOLVERS[0]);
const canQuery = computed(() => !running.value && Boolean(name.value.trim()));
const stale = computed(() => Boolean(output.value && completedTask.value && (
  completedTask.value.name !== name.value
  || completedTask.value.typeName !== typeName.value
  || completedTask.value.resolverId !== resolverId.value
)));
const { copy } = useCopy({ source: output, text: 'DNS report copied' });

watch([name, typeName, resolverId], () => {
  error.value = '';
  if (!running.value) {
    return;
  }
  operationId += 1;
  client.cancel('The DNS-over-HTTPS request was cancelled because an input changed.');
  running.value = false;
  status.value = 'Input changed; the in-flight network request was aborted.';
});

async function query() {
  if (!canQuery.value) {
    return;
  }
  const task: DnsQueryTask = {
    resolverId: resolverId.value,
    name: name.value,
    typeName: typeName.value,
  };
  const currentOperation = ++operationId;
  running.value = true;
  error.value = '';
  status.value = `Sending one DNS-over-HTTPS request to ${resolver.value.label}…`;
  try {
    const result: DnsQueryResult = await client.run(task);
    if (currentOperation !== operationId) {
      return;
    }
    output.value = formatDnsReport({
      message: result.message,
      resolverLabel: result.resolverLabel,
      requestBytes: result.requestBytes,
      elapsedMs: result.elapsedMs,
    });
    completedTask.value = task;
    status.value = `Received ${result.responseBytes.toLocaleString('en-US')} wire bytes in ${Math.round(result.elapsedMs).toLocaleString('en-US')} ms; DNS status ${result.message.rcodeName}.`;
  }
  catch (caught) {
    if (currentOperation !== operationId) {
      return;
    }
    error.value = caught instanceof Error ? caught.message : 'The DNS-over-HTTPS request failed.';
    status.value = 'No new DNS result was accepted.';
  }
  finally {
    if (currentOperation === operationId) {
      running.value = false;
    }
  }
}

function cancel() {
  operationId += 1;
  client.cancel();
  running.value = false;
  status.value = 'DNS-over-HTTPS request cancelled; the fetch was aborted.';
}

function clearAll() {
  operationId += 1;
  client.cancel('The DNS-over-HTTPS request was cancelled while clearing values.');
  name.value = '';
  output.value = '';
  completedTask.value = null;
  error.value = '';
  running.value = false;
  status.value = 'DNS name and report cleared. No network request is active.';
}

onBeforeUnmount(() => {
  operationId += 1;
  client.dispose();
  name.value = '';
  output.value = '';
  completedTask.value = null;
});
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Explicit network request — not a local-only tool">
      Nothing is sent until you select Query. Then the DNS name and record type are sent in a binary HTTPS body to the selected Cloudflare resolver; Cloudflare also sees your IP address and ordinary HTTP connection metadata and timing. HTTPS protects the query in transit from passive observers, but this is standard DoH, not anonymity or Oblivious DoH. The app does not put the query in the URL, browser storage, application logs, or analytics.
    </c-alert>

    <c-card class="c-task-options" title="Fixed resolver and query type">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-select
          v-model:value="resolverId"
          label="DNS-over-HTTPS resolver"
          :options="DNS_RESOLVERS.map(item => ({ label: item.label, value: item.id }))"
          data-test-id="doh-resolver"
        />
        <c-select
          v-model:value="typeName"
          label="DNS record type"
          :options="DNS_QUERY_TYPES.map(item => ({ label: item.label, value: item.mnemonic }))"
          data-test-id="doh-type"
        />
      </div>
      <p mb-0 mt-3 text-sm op-70 data-test-id="doh-resolver-policy">
        {{ resolver.policy }} The resolver URL is fixed and redirects are rejected.
      </p>
    </c-card>

    <c-input-text
      v-model:value="name"
      label="DNS name"
      placeholder="example.com or _service._tcp.example.com"
      :maxlength="DNS_NAME_MAX_CHARACTERS"
      test-id="doh-name"
      raw-text
      monospace
    />
    <div class="c-task-actions">
      <c-button type="primary" :disabled="!canQuery" data-test-id="doh-query" @click="query">
        {{ running ? 'Querying…' : 'Query DNS' }}
      </c-button>
      <c-button v-if="running" data-test-id="doh-cancel" @click="cancel">
        Cancel
      </c-button>
      <c-button @click="clearAll">
        Clear
      </c-button>
    </div>

    <p class="c-task-status" role="status" aria-live="polite" data-test-id="doh-status">
      {{ status }}
    </p>
    <c-alert v-if="error" title="DNS-over-HTTPS query error" data-test-id="doh-error">
      {{ error }}
    </c-alert>
    <c-alert v-if="stale" title="Report uses the previous query">
      Select Query DNS to send the current name, type, and resolver choice.
    </c-alert>

    <c-alert title="Bounded inspection, not trust validation">
      Responses are limited to 65,535 wire bytes, 256 records, strict compression pointers, and a 10-second request. The tool displays returned RDATA as inert text and never follows it. It does not independently validate DNSSEC or prove that a returned address is safe to visit.
    </c-alert>
    <c-input-text :value="output" label="DNS response report" test-id="doh-output" raw-text monospace readonly multiline :rows="22" />
    <div class="c-task-actions">
      <c-button :disabled="!output" @click="copy()">
        Copy
      </c-button>
      <c-button :disabled="!output" @click="downloadTextFile({ content: output, filename: 'dns-over-https-report.txt' })">
        Download
      </c-button>
    </div>
  </div>
</template>
