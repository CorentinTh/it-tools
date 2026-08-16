<script setup lang="ts">
import countryLookup from 'country-code-lookup';
import type { GeoIpLookupResult } from './offline-geoip-inspector.service';
import { createGeoIpWorkerClient } from './offline-geoip-inspector.worker-client';
import { useCopy } from '@/composable/copy';

const address = ref('1.1.1.1');
const result = ref<GeoIpLookupResult | null>();
const error = ref('');
const isLoading = ref(false);
const client = createGeoIpWorkerClient();

const country = computed(() => result.value ? countryLookup.byIso(result.value.countryCode) : null);
const report = computed(() => {
  if (!result.value) {
    return '';
  }
  return [
    `Address: ${result.value.address}`,
    `IP version: IPv${result.value.family}`,
    `Country: ${country.value?.country ?? result.value.countryCode} (${result.value.countryCode})`,
    country.value?.continent ? `Continent: ${country.value.continent}` : undefined,
    `Matched range: ${result.value.rangeStart} – ${result.value.rangeEnd}`,
    'Dataset: sapics/ip-location-db user-country (PDDL-1.0, bundled locally)',
  ].filter(Boolean).join('\n');
});

async function inspect() {
  error.value = '';
  result.value = undefined;
  isLoading.value = true;
  try {
    const response = await client.run({ address: address.value });
    result.value = JSON.parse(response.value) as GeoIpLookupResult | null;
  }
  catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'The offline GeoIP inspection failed.';
  }
  finally {
    isLoading.value = false;
  }
}

function cancel() {
  client.cancel();
}

onScopeDispose(() => client.dispose());

const { copy } = useCopy({ source: report, text: 'GeoIP report copied to the clipboard' });
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-card class="c-tool-panel" title="Offline IP lookup">
      <c-input-text
        v-model:value="address"
        label="IPv4 or IPv6 address"
        placeholder="1.1.1.1 or 2606:4700:4700::1111"
        :maxlength="64"
        test-id="geoip-address"
        raw-text
        clearable
        monospace
        @keydown.enter="inspect"
      />
      <p mt-3 text-sm op-70>
        Country-level estimate from a bundled static dataset. Nothing is sent to an API. VPNs, proxies, routing changes, and dataset age can affect accuracy.
      </p>
    </c-card>

    <div class="c-task-actions">
      <c-button type="primary" :loading="isLoading" data-test-id="geoip-inspect" @click="inspect">
        Inspect locally
      </c-button>
      <c-button v-if="isLoading" data-test-id="geoip-cancel" @click="cancel">
        Cancel
      </c-button>
      <c-button :disabled="!result" data-test-id="geoip-copy" @click="copy()">
        Copy report
      </c-button>
    </div>

    <c-alert v-if="error" title="GeoIP lookup failed" data-test-id="geoip-error">
      {{ error }}
    </c-alert>

    <c-card v-if="result" class="c-tool-panel" title="Local result" data-test-id="geoip-result">
      <dl class="result-grid">
        <div>
          <dt>Address</dt><dd>{{ result.address }}</dd>
        </div>
        <div>
          <dt>IP version</dt><dd>IPv{{ result.family }}</dd>
        </div>
        <div>
          <dt>Country</dt><dd>{{ country?.country ?? result.countryCode }} ({{ result.countryCode }})</dd>
        </div>
        <div v-if="country?.continent">
          <dt>Continent</dt><dd>{{ country.continent }}</dd>
        </div>
        <div>
          <dt>Matched range</dt><dd>{{ result.rangeStart }} – {{ result.rangeEnd }}</dd>
        </div>
      </dl>
      <p mt-4 text-xs op-60>
        Dataset: sapics/ip-location-db user-country, PDDL-1.0. Bundled with this release; no runtime network source.
      </p>
    </c-card>

    <c-card v-else-if="result === null" class="c-tool-panel" title="Local result" data-test-id="geoip-not-found">
      No country range was found for this address. Private, reserved, and currently unallocated ranges may be absent.
    </c-card>
  </div>
</template>

<style scoped>
.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: var(--ui-space-3);
}

.result-grid div {
  min-width: 0;
}

dt {
  font-weight: 700;
}

dd {
  margin: var(--ui-space-1) 0 0;
  overflow-wrap: anywhere;
  font-family: var(--ui-font-mono);
}
</style>
