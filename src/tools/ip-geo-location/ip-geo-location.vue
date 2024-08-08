<script setup lang="ts">
import type { CKeyValueListItems } from '@/ui/c-key-value-list/c-key-value-list.types';

const ip = ref('8.8.8.8');
const errorMessage = ref('');

const fields: Array<{ field: string; name: string }> = [
  { field: 'ip', name: 'IP' },
  { field: 'hostname', name: 'Host Name' },
  { field: 'country', name: 'Country Code' },
  { field: 'region', name: 'Region/state Code' },
  { field: 'city', name: 'City' },
  { field: 'postal', name: 'Postal Code' },
  { field: 'loc', name: 'Latitude/Longitude' },
  { field: 'timezone', name: 'Timezone' },
  { field: 'org', name: 'Organization Name' },
];

const geoInfos = ref<CKeyValueListItems>([]);
const geoInfosData = ref<{
  loc?: string
}>({});
const status = ref<'pending' | 'error' | 'success'>('pending');
const token = useStorage('ip-geoloc:token', '');

const openStreetMapUrl = computed(
  () => {
    const [gpsLatitude, gpsLongitude] = geoInfosData.value.loc?.split(',') || [];
    return gpsLatitude && gpsLongitude ? `https://www.openstreetmap.org/?mlat=${gpsLatitude}&mlon=${gpsLongitude}#map=18/${gpsLatitude}/${gpsLongitude}` : undefined;
  },
);

async function onGetInfos() {
  try {
    status.value = 'pending';

    const geoInfoQueryResponse = await fetch(
      token.value !== ''
        ? `https://ipinfo.io/${ip.value}/json?token=${token.value}`
        : `https://ipinfo.io/${ip.value}/json`);
    if (!geoInfoQueryResponse.ok) {
      throw geoInfoQueryResponse.statusText;
    }

    const data = await geoInfoQueryResponse.json();

    const allGeoInfos = [];
    for (const field of fields) {
      if (data[field.field]) {
        allGeoInfos.push({
          label: field.name,
          value: data[field.field],
        });
      }
    }

    status.value = 'success';
    geoInfos.value = allGeoInfos;
    geoInfosData.value = data;
  }
  catch (e: any) {
    errorMessage.value = e.toString();
    status.value = 'error';
    return [];
  }
}
</script>

<template>
  <div>
    <div flex items-center gap-2>
      <c-input-text
        v-model:value="ip"
        placeholder="Enter an IPv4/6"
        @update:value="() => { status = 'pending' }"
      />
      <c-button align-center @click="onGetInfos">
        Get GEO Location Infos
      </c-button>
    </div>

    <details mt-2>
      <summary>Optional ipinfo.io token</summary>
      <c-input-text
        v-model:value="token"
        placeholder="Optional ipinfo.io token"
        @update:value="() => { status = 'pending' }"
      />
      <n-p>
        <n-a href="https://ipinfo.io/">
          Signup for a free token
        </n-a>
      </n-p>
    </details>

    <n-divider />

    <c-card v-if="status === 'pending'" mt-5>
      Click on button above to get latest infos
    </c-card>

    <c-card v-if="status === 'success' && openStreetMapUrl" mt-4>
      <c-button :href="openStreetMapUrl" target="_blank">
        Localize on Open Street Map
      </c-button>
    </c-card>

    <c-card v-if="status === 'success'" mt-5>
      <c-key-value-list :items="geoInfos" />
    </c-card>

    <n-alert v-if="status === 'error'" title="Errors occured" type="error" mt-5>
      {{ errorMessage }}
    </n-alert>
  </div>
</template>
