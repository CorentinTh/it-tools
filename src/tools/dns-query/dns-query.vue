<script setup lang="ts">
import { type DnsQueryResult, type DnsRecordType, buildDohUrl, parseDohResponse, recordTypes } from './dns-query.models';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useValidation } from '@/composable/validation';
import { withDefaultOnErrorAsync } from '@/utils/defaults';
import { computedRefreshableAsync } from '@/composable/computedRefreshable';

const domainName = ref('example.com');
const recordType = ref<DnsRecordType>('A');
const provider = ref<'cloudflare' | 'google'>('cloudflare');

const providerOptions = [
  { label: 'Cloudflare (1.1.1.1)', value: 'cloudflare' },
  { label: 'Google (8.8.8.8)', value: 'google' },
];
const typeOptions = recordTypes.map(type => ({ label: type, value: type }));

const validation = useValidation({
  source: domainName,
  rules: [
    {
      validator: value => !value.trim() || /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i.test(value.trim()),
      message: 'Enter a valid domain name (e.g. example.com)',
    },
  ],
});

const emptyResult = { status: 0, statusLabel: '', answers: [], authority: [] };

const [result, refreshResult] = computedRefreshableAsync(
  () => withDefaultOnErrorAsync(
    async (): Promise<DnsQueryResult> => {
      if (!domainName.value.trim() || !validation.isValid) {
        return emptyResult;
      }
      const url = buildDohUrl({ name: domainName.value, type: recordType.value, provider: provider.value });
      const response = await fetch(url, { headers: { accept: 'application/dns-json' } });
      if (!response.ok) {
        throw new Error(`DNS-over-HTTPS request failed: ${response.status}`);
      }
      return parseDohResponse(await response.json());
    },
    emptyResult,
  ),
  emptyResult,
);

const hasAnswers = computed(() => (result.value.answers?.length ?? 0) > 0);
</script>

<template>
  <div style="max-width: 720px; margin: 0 auto;">
    <c-card mb-3>
      <c-input-text
        v-model:value="domainName"
        label="Domain name"
        placeholder="e.g. example.com"
        :validation="validation"
        mb-2
      />

      <n-grid cols="2" x-gap="12" mb-3>
        <n-gi>
          <c-select v-model:value="recordType" label="Record type" label-position="top" :options="typeOptions" />
        </n-gi>
        <n-gi>
          <c-select v-model:value="provider" label="DNS-over-HTTPS provider" label-position="top" :options="providerOptions" />
        </n-gi>
      </n-grid>

      <c-button :disabled="!validation.isValid || !domainName.trim()" @click="refreshResult()">
        Look up
      </c-button>
    </c-card>

    <c-card v-if="result.statusLabel">
      <n-alert :type="hasAnswers ? 'success' : 'warning'" mb-3>
        {{ result.statusLabel }}
      </n-alert>

      <div v-if="hasAnswers" mb-3>
        <div mb-2 font-bold>
          Answers
        </div>
        <n-table>
          <tbody>
            <tr v-for="(answer, index) of result.answers" :key="index">
              <td class="labels">
                {{ answer.typeLabel }}
              </td>
              <td class="labels">
                {{ answer.name }}
              </td>
              <td class="labels">
                TTL {{ answer.TTL }}
              </td>
              <td style="word-break: break-all;">
                <TextareaCopyable :value="answer.data" mb-0 />
              </td>
            </tr>
          </tbody>
        </n-table>
      </div>

      <div v-else-if="result.authority.length > 0">
        <div mb-2 font-bold>
          Authority section
        </div>
        <TextareaCopyable :value="result.authority.map(a => `${a.name} TTL ${a.TTL}: ${a.data}`).join('\n')" />
      </div>

      <div mt-2 text-xs op-60>
        Queried via DNS-over-HTTPS through {{ provider === 'google' ? 'dns.google' : 'cloudflare-dns.com' }}
      </div>
    </c-card>
  </div>
</template>

<style scoped lang="less">
.labels {
  width: 120px;
  font-weight: bold;
}
</style>
