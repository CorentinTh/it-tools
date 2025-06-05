<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMessage } from 'naive-ui';
import { useCopy } from '@/composable/copy';

const { t } = useI18n();
const message = useMessage();
const { copy } = useCopy();

interface IpInfo {
  ip: string
  hostname?: string
  city?: string
  region?: string
  country?: string
  loc?: string
  org?: string
  postal?: string
  timezone?: string
}

const ipAddress = ref('');
const ipInfo = ref<IpInfo | null>(null);
const loading = ref(false);
const error = ref('');

function fetchIpInfo() {
  if (!ipAddress.value) {
    error.value = t('tools.ip-info.errors.emptyIp');
    return;
  }

  loading.value = true;
  error.value = '';

  return fetch(`https://ipinfo.io/${ipAddress.value}`, {
    headers: {
      Authorization: 'Bearer 7a8a124a501f25',
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(t('tools.ip-info.errors.fetchFailed'));
      }
      return response.json();
    })
    .then((data) => {
      ipInfo.value = data;
    })
    .catch((e) => {
      error.value = e instanceof Error ? e.message : t('tools.ip-info.errors.generic');
    })
    .finally(() => {
      loading.value = false;
    });
}

function copyToClipboard(text: string | undefined) {
  if (text) {
    copy(text);
    message.success(t('tools.ip-info.copied'));
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <div class="flex gap-4">
      <input
        v-model="ipAddress"
        type="text"
        :placeholder="t('tools.ip-info.placeholder')"
        class="flex-1 border rounded px-4 py-2"
        @keyup.enter="fetchIpInfo"
      >
      <button
        class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        :disabled="loading"
        @click="fetchIpInfo"
      >
        {{ loading ? t('tools.ip-info.loading') : t('tools.ip-info.query') }}
      </button>
    </div>

    <div v-if="error" class="rounded bg-red-100 p-4 text-red-500">
      {{ error }}
    </div>

    <div v-if="ipInfo" class="grid gap-4 border rounded p-4">
      <div v-for="(value, key) in ipInfo" :key="key" class="flex items-center justify-between">
        <span class="font-medium capitalize">{{ t(`tools.ip-info.fields.${key}`) }}:</span>
        <div class="flex items-center gap-2">
          <span>{{ value }}</span>
          <button
            class="p-1 text-gray-500 hover:text-gray-700"
            @click="copyToClipboard(value)"
          >
            <i class="i-mdi-content-copy" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
