<script setup lang="ts">
import { useQueryParamOrStorage } from '@/composable/queryParams';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

interface KeyValuePair {
  key: string
  value?: string
}
const baseUrl = useQueryParamOrStorage({ name: 'url', storageName: 'api-tester:url', defaultValue: '' });
const method = useQueryParamOrStorage({ name: 'method', storageName: 'api-tester:m', defaultValue: 'POST' });
const queryParams = useQueryParamOrStorage<KeyValuePair[]>({ name: 'params', storageName: 'api-tester:params', defaultValue: [] });
const headers = useQueryParamOrStorage<KeyValuePair[]>({ name: 'headers', storageName: 'api-tester:headers', defaultValue: [] });
const body = useQueryParamOrStorage({ name: 'body', storageName: 'api-tester:body', defaultValue: '' });
const apiCallResult = ref();

const inprogress = ref(false);
async function callAPI() {
  const url = new URL(baseUrl.value);
  for (const kv of queryParams.value) {
    url.searchParams.append(kv.key, kv.value || '');
  }
  const queryHeaders = [] as [string, string][];
  for (const kv of headers.value) {
    queryHeaders.push([kv.key, kv.value || '']);
  }

  try {
    const response = await fetch(url, {
      method: method.value,
      headers: queryHeaders,
      body: body.value,
    });

    apiCallResult.value = {
      code: response.status,
      error: '',
      result: await response.text(),
    };
  }
  catch (err: any) {
    apiCallResult.value = {
      code: -1,
      error: err.toString(),
      result: null,
    };
  }
}
</script>

<template>
  <div>
    <c-card title="">
      <c-input-text
        v-model:value="baseUrl"
        label="Base API Url"
        placeholder="Base API Url"
        mb-2
      />

      <c-select
        v-model:value="method"
        label="HTTP Method:"
        :options="['GET', 'POST', 'PUT', 'DELETE', 'PATCH']"
      />

      <c-card title="Headers" mb-2>
        <n-dynamic-input v-model:value="headers">
          <template #create-button-default>
            Add a new HTTP Header
          </template>
          <template #default="{ value }">
            <div style="display: flex; align-items: center; width: 100%">
              <n-input v-model:value="value.key" type="text" />
              <n-input v-model:value="value.value" type="text" />
            </div>
          </template>
        </n-dynamic-input>
      </c-card>

      <c-card title="Query Parameters" mb-2>
        <n-dynamic-input v-model:value="queryParams">
          <template #create-button-default>
            Add a new HTTP Header
          </template>
          <template #default="{ value }">
            <div style="display: flex; align-items: center; width: 100%">
              <n-input v-model:value="value.key" type="text" />
              <n-input v-model:value="value.value" type="text" />
            </div>
          </template>
        </n-dynamic-input>
      </c-card>
      <c-input-text
        v-model:value="body"
        label="Body"
        placeholder="HTTP Query body"
        multiline
        monospace
        mb-2
      />

      <c-button secondary @click="callAPI">
        Call API
      </c-button>
    </c-card>
    <n-spin
      v-if="inprogress"
      size="small"
    />
    <c-alert v-if="!inprogress && apiCallResult.code !== 200" type="error" mt-12 title="Error while calling API">
      <p><strong>Status code = {{ apiCallResult.code }}</strong></p>
      <TextareaCopyable :value="apiCallResult.error" />
    </c-alert>
    <c-card v-if="!inprogress && apiCallResult.code === 200" mt-12 title="API Call result">
      <TextareaCopyable :value="apiCallResult.result" />
    </c-card>
  </div>
</template>
