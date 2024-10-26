<script setup lang="ts">
import { combineTXT, query, wellknown } from 'dns-query';
import types from './dns.records.types.json';

const type = ref('A');
const name = ref('google.com');
const answers = ref<string[]>([]);

async function queryDNS() {
  const endpoints = await wellknown.endpoints('doh');
  try {
    const response = await query({
      question: { type: type.value, name: name.value },
    }, {
      endpoints,
    });
    if (type.value === 'TXT') {
      answers.value = (response.answers || []).map(answer => `${answer.name} ${answer.type} ${combineTXT(answer.data as Uint8Array[])} (TTL=${answer.ttl})`);
    }
    else {
      answers.value = (response.answers || []).map(answer => `${answer.name} ${answer.type} ${answer.data} (TTL=${answer.ttl})`);
    }
  }
  catch (error: any) {
    answers.value = [error.toString()];
  }
}
</script>

<template>
  <div>
    <c-input-text
      v-model:value="name"
      label="Name"
      label-position="left"
      placeholder="Name to query"
      mb-2
    />
    <c-select
      v-model:value="type"
      searchable
      label="DNS record type:"
      label-position="left"
      :options="Object.values(types).map(kv => ({ value: kv.value, label: `${kv.value}: ${kv.label}` }))"
      mb-2
    />

    <div flex justify-center>
      <c-button
        @click="queryDNS"
      >
        Send DNS query
      </c-button>
    </div>

    <n-divider />

    <c-card title="Query results">
      <textarea-copyable
        v-for="(answer, index) in answers"
        :key="index"
        :value="answer"
        word-wrap
        mb-2
      />
    </c-card>
  </div>
</template>
