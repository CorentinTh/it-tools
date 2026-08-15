<script setup lang="ts">
import { createOuiDatabase, getOuiPrefix } from './mac-address-lookup.service';
import { macAddressValidationRules } from '@/utils/macAddress';
import { useCopy } from '@/composable/copy';

const macAddress = ref('20:37:06:12:34:56');
const vendorPrefix = computed(() => getOuiPrefix(macAddress.value));
const details = ref<string>();
const lookupError = ref('');
const isLoading = ref(false);
const lookupRevision = ref(0);
const isMounted = ref(false);
const database = createOuiDatabase();
let lookupId = 0;

watch([vendorPrefix, lookupRevision, isMounted], async ([prefix, , mounted]) => {
  const currentLookupId = ++lookupId;
  details.value = undefined;
  lookupError.value = '';
  isLoading.value = false;

  if (!mounted || !prefix) {
    database.cancel();
    return;
  }

  isLoading.value = true;
  try {
    const vendor = await database.lookup(prefix);
    if (currentLookupId === lookupId) {
      details.value = vendor;
    }
  }
  catch {
    if (currentLookupId === lookupId) {
      lookupError.value = navigator.onLine
        ? 'The local vendor database could not be loaded. Please try again.'
        : 'The local vendor database is not available offline yet. Reconnect and try again.';
    }
  }
  finally {
    if (currentLookupId === lookupId) {
      isLoading.value = false;
    }
  }
}, { immediate: true });

onMounted(() => {
  database.start();
  isMounted.value = true;
});

function retryLookup() {
  database.retry();
  lookupRevision.value += 1;
}

onScopeDispose(() => {
  lookupId += 1;
  database.dispose();
});

const { copy } = useCopy({ source: () => details.value ?? '', text: 'Vendor info copied to the clipboard' });
</script>

<template>
  <div class="c-task-layout">
    <c-input-text
      v-model:value="macAddress"
      label="MAC address"
      size="large"
      placeholder="Type a MAC address"
      clearable
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      :validation-rules="macAddressValidationRules"
    />

    <c-card title="Vendor information">
      <div v-if="isLoading" aria-live="polite">
        Loading local vendor information...
      </div>

      <div v-else-if="lookupError" role="alert">
        <div>{{ lookupError }}</div>
        <c-button mt-3 data-test-id="retry-vendor-lookup" @click="retryLookup">
          Retry vendor lookup
        </c-button>
      </div>

      <div v-else-if="details">
        <div v-for="(detail, index) of details.split('\n')" :key="index">
          {{ detail }}
        </div>
      </div>

      <div v-else italic op-60>
        Unknown vendor for this address
      </div>
    </c-card>

    <div class="c-task-actions">
      <c-button :disabled="isLoading || !details" @click="copy()">
        Copy vendor info
      </c-button>
    </div>
  </div>
</template>
