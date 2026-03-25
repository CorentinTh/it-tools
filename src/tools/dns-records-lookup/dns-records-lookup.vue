<script setup lang="ts">
import { ref } from 'vue';
import { useValidation } from '@/composable/validation';

const domain = ref('google.com');
const recordType = ref('A');
const loading = ref(false);
const error = ref<string | null>(null);
const results = ref<any[]>([]);

const recordTypes = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS'].map(t => ({ label: t, value: t }));

const validation = useValidation({
  source: domain,
  rules: [
    {
      validator: value => value.trim().length > 0 && /^[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/.test(value.trim()),
      message: 'Invalid domain name',
    },
  ],
});

function getTypeString(type: number) {
  const types: Record<number, string> = { 1: 'A', 2: 'NS', 5: 'CNAME', 15: 'MX', 16: 'TXT', 28: 'AAAA' };
  return types[type] || type.toString();
}

async function lookup() {
  if (!validation.isValid) {
    return;
  }
  loading.value = true;
  error.value = null;
  results.value = [];
  try {
    const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain.value.trim())}&type=${recordType.value}`, {
      headers: { accept: 'application/dns-json' },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch from DNS API');
    }
    const data = await res.json();
    if (data.Answer) {
      results.value = data.Answer;
    }
    else if (data.Authority) {
      results.value = data.Authority;
    }
  }
  catch (e: any) {
    error.value = e.message;
  }
  finally {
    loading.value = false;
  }
};
</script>

<template>
  <c-card>
    <div style="display: flex; gap: 1rem; align-items: start; margin-bottom: 1rem;">
      <c-input-text v-model:value="domain" label="Domain Name" :validation="validation" placeholder="example.com" style="flex: 1;" />
      <div>
        <div style="margin-bottom: 4px;">
          Record Type
        </div>
        <n-select v-model:value="recordType" :options="recordTypes" style="width: 120px;" />
      </div>
      <div style="align-self: flex-end; padding-bottom: 4px;">
        <n-button type="primary" :loading="loading" :disabled="!validation.isValid" @click="lookup">
          Lookup
        </n-button>
      </div>
    </div>

    <n-alert v-if="error" type="error" mb-4>
      {{ error }}
    </n-alert>

    <n-table v-if="results.length > 0">
      <thead>
        <tr>
          <th>Name</th>
          <th>TTL</th>
          <th>Type</th>
          <th>Data</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(record, index) in results" :key="index">
          <td>{{ record.name }}</td>
          <td>{{ record.TTL }}</td>
          <td>{{ getTypeString(record.type) }}</td>
          <td class="value">
            {{ record.data }}
          </td>
        </tr>
      </tbody>
    </n-table>
    <div v-else-if="!loading && !error && domain && validation.isValid" style="text-align: center; color: #888;">
      Press Lookup to fetch records. No results to display.
    </div>
  </c-card>
</template>

<style lang="less" scoped>
.value {
  word-wrap: break-word;
  word-break: break-all;
}
</style>
