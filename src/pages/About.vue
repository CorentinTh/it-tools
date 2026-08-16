<script setup lang="ts">
import { clearManagedStorage } from '@/utils/app-storage';
import { deleteOtpVaultDatabase } from '@/tools/local-encrypted-otp-vault/local-encrypted-otp-vault.repository';

const { t } = useI18n();
const storageClearStatus = ref('');

async function clearSavedBrowserData() {
  let removedKeys: string[];
  let failedKeys: string[];

  try {
    ({ removedKeys, failedKeys } = clearManagedStorage(localStorage));
  }
  catch {
    storageClearStatus.value = t('about.privacy.clearUnavailable');
    return;
  }

  let removedDatabases = 0;
  try {
    removedDatabases = await deleteOtpVaultDatabase() ? 1 : 0;
  }
  catch {
    failedKeys.push('IndexedDB:it-tools-otp-vault');
  }

  storageClearStatus.value = failedKeys.length > 0
    ? t('about.privacy.clearPartial', { removed: removedKeys.length + removedDatabases, failed: failedKeys.length })
    : t('about.privacy.clearSuccess', { count: removedKeys.length + removedDatabases });
}
</script>

<template>
  <div mx-auto mt-50px max-w-600px>
    <c-markdown :markdown="$t('about.content')" />

    <c-card :title="$t('about.privacy.title')" mt-6>
      <p mt-0>
        {{ $t('about.privacy.description') }}
      </p>
      <p>{{ $t('about.privacy.textDiff') }}</p>
      <n-popconfirm
        :positive-text="$t('about.privacy.confirmButton')"
        :negative-text="$t('about.privacy.cancelButton')"
        @positive-click="clearSavedBrowserData"
      >
        <template #trigger>
          <c-button data-test-id="clear-saved-browser-data" type="warning">
            {{ $t('about.privacy.clearButton') }}
          </c-button>
        </template>
        {{ $t('about.privacy.clearConfirm') }}
      </n-popconfirm>
      <p
        v-if="storageClearStatus"
        data-test-id="storage-clear-status"
        role="status"
        mb-0
        mt-3
        text-sm
      >
        {{ storageClearStatus }}
      </p>
    </c-card>
  </div>
</template>
