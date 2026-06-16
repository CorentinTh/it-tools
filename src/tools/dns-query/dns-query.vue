<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { queryAllDns, queryWhois, formatDnsRecords, getTypeName, defaultRecordTypes } from './dns-query.service';
import type { DnsAnswer, WhoisInfo } from './dns-query.service';

const domain = ref('example.com');
const isLoading = ref(false);
const errorMessage = ref('');
const answers = ref<DnsAnswer[]>([]);
const whoisInfo = ref<WhoisInfo | null>(null);
const whoisLoading = ref(false);
const hasQueried = ref(false);

const domainValidationRules = [
  {
    message: 'Please enter a valid domain name',
    validator: (value: string) => /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(value.trim()),
  },
];

const groupedAnswers = computed(() => {
  const groups: { type: string; records: DnsAnswer[] }[] = [];
  const seen = new Map<string, DnsAnswer[]>();

  for (const answer of answers.value) {
    const typeName = getTypeName(answer.type);
    if (!seen.has(typeName)) {
      const records: DnsAnswer[] = [];
      seen.set(typeName, records);
      groups.push({ type: typeName, records });
    }
    seen.get(typeName)!.push(answer);
  }

  return groups;
});

const formattedResult = computed(() => formatDnsRecords(answers.value));

const { copy } = useCopy({ source: formattedResult, text: 'DNS records copied to the clipboard' });

async function doQuery() {
  const trimmed = domain.value.trim();
  if (!trimmed) {
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';
  answers.value = [];
  whoisInfo.value = null;
  hasQueried.value = true;

  try {
    answers.value = await queryAllDns(trimmed, defaultRecordTypes);
  }
  catch (err: unknown) {
    errorMessage.value = err instanceof Error ? err.message : 'DNS query failed';
  }
  finally {
    isLoading.value = false;
  }

  whoisLoading.value = true;
  try {
    whoisInfo.value = await queryWhois(trimmed);
  }
  catch {
    // WHOIS is best-effort
  }
  finally {
    whoisLoading.value = false;
  }
}
</script>

<template>
  <div>
    <c-input-text
      v-model:value="domain"
      label="Domain name"
      placeholder="e.g. example.com"
      clearable
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      :validation-rules="domainValidationRules"
      mb-4
    />

    <div flex justify-center mb-4>
      <c-button :disabled="!domain.trim() || isLoading" @click="doQuery()">
        {{ isLoading ? 'Querying...' : 'Query DNS' }}
      </c-button>
    </div>

    <n-alert v-if="errorMessage" type="error" mb-4>
      {{ errorMessage }}
    </n-alert>

    <div v-if="hasQueried && !isLoading && !errorMessage">
      <div v-if="groupedAnswers.length > 0">
        <div v-for="group in groupedAnswers" :key="group.type" mb-4>
          <div mb-2 font-bold text-15px>
            {{ group.type }}
          </div>
          <n-table :bordered="true" :single-line="false" size="small">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">TTL</th>
                <th scope="col">Data</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(answer, index) in group.records" :key="index">
                <td>{{ answer.name }}</td>
                <td>{{ answer.TTL }}s</td>
                <td style="word-break: break-all;">
                  {{ answer.data }}
                </td>
              </tr>
            </tbody>
          </n-table>
        </div>

        <div flex justify-center mb-5>
          <c-button @click="copy()">
            Copy results
          </c-button>
        </div>
      </div>

      <c-card v-else mb-4>
        <div italic op-60>
          No records found for this domain.
        </div>
      </c-card>
    </div>

    <div v-if="whoisLoading" mt-2 op-60 italic>
      Loading WHOIS info...
    </div>

    <div v-if="whoisInfo" mt-2>
      <n-divider />
      <div mb-3 font-bold text-16px>
        WHOIS
      </div>

      <n-table :bordered="true" :single-line="false" size="small">
        <tbody>
          <tr>
            <td font-500 w-180px>
              Domain Name
            </td>
            <td>{{ whoisInfo.domainName }}</td>
          </tr>
          <tr v-if="whoisInfo.registrar">
            <td font-500>
              Registrar
            </td>
            <td>{{ whoisInfo.registrar }}</td>
          </tr>
          <tr v-if="whoisInfo.registrationDate">
            <td font-500>
              Registration Date
            </td>
            <td>{{ whoisInfo.registrationDate }}</td>
          </tr>
          <tr v-if="whoisInfo.expirationDate">
            <td font-500>
              Expiration Date
            </td>
            <td>{{ whoisInfo.expirationDate }}</td>
          </tr>
          <tr v-if="whoisInfo.updatedDate">
            <td font-500>
              Updated Date
            </td>
            <td>{{ whoisInfo.updatedDate }}</td>
          </tr>
          <tr v-if="whoisInfo.registrantCountry">
            <td font-500>
              Registrant
            </td>
            <td>{{ [whoisInfo.registrantProvince, whoisInfo.registrantCountry].filter(Boolean).join(', ') }}</td>
          </tr>
          <tr v-if="whoisInfo.nameServers.length > 0">
            <td font-500>
              Name Servers
            </td>
            <td>{{ whoisInfo.nameServers.join(', ') }}</td>
          </tr>
          <tr v-if="whoisInfo.status.length > 0">
            <td font-500>
              Domain Status
            </td>
            <td>
              <div v-for="s in whoisInfo.status" :key="s">
                {{ s }}
              </div>
            </td>
          </tr>
          <tr v-if="whoisInfo.dnssec">
            <td font-500>
              DNSSEC
            </td>
            <td>{{ whoisInfo.dnssec }}</td>
          </tr>
        </tbody>
      </n-table>
    </div>
  </div>
</template>
