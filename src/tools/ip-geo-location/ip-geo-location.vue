<script setup lang="ts">
import type { CKeyValueListItems } from '@/ui/c-key-value-list/c-key-value-list.types';

const ipOrDomain = ref('8.8.8.8');
const errorMessage = ref('');

const fields: Array<{ field: string; name: string }> = [
  { field: 'message', name: 'Message' },
  { field: 'continent', name: 'Continent Name' },
  { field: 'continentCode', name: 'Continent code' },
  { field: 'country', name: 'Country Name' },
  { field: 'countryCode', name: 'Country Code' },
  { field: 'region', name: 'Region/state Code' },
  { field: 'regionName', name: 'Region/state Name' },
  { field: 'city', name: 'City' },
  { field: 'district', name: 'District' },
  { field: 'zip', name: 'Zip Code' },
  { field: 'lat', name: 'Latitude' },
  { field: 'lon', name: 'Longitude' },
  { field: 'timezone', name: 'Timezone' },
  { field: 'offset', name: 'Timezone UTC DST offset (in seconds)' },
  { field: 'currency', name: 'National Currency' },
  { field: 'isp', name: 'ISP Name' },
  { field: 'org', name: 'Organization Name' },
  { field: 'as', name: 'AS Number and Organization' },
  { field: 'asname', name: 'AS name (RIR)' },
  { field: 'reverse', name: 'Reverse DNS of the IP' },
  { field: 'mobile', name: 'Mobile (cellular) connection' },
  { field: 'proxy', name: 'Proxy, VPN or Tor exit address' },
  { field: 'hosting', name: 'Hosting, colocated or data center' },
  { field: 'query', name: 'IP used for the query' },
];

const geoInfos = ref<CKeyValueListItems>([]);
const geoInfosData = ref<any>({});
const status = ref<'pending' | 'error' | 'success'>('pending');

const openStreetMapUrl = computed(
  () => {
    const gpsLatitude = geoInfosData.value.lat;
    const gpsLongitude = geoInfosData.value.lon;
    return gpsLatitude && gpsLongitude ? `https://www.openstreetmap.org/?mlat=${gpsLatitude}&mlon=${gpsLongitude}#map=18/${gpsLatitude}/${gpsLongitude}` : undefined;
  },
);

async function onGetInfos() {
  try {
    status.value = 'pending';

    const geoInfoQueryResponse = await fetch(`http://ip-api.com/json/${ipOrDomain.value}`);
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
        v-model:value="ipOrDomain"
        placeholder="Enter an IPv4/6 or a domain name"
        @update:value="() => { status = 'pending' }"
      />
      <c-button align-center @click="onGetInfos">
        Get GEO Location Infos
      </c-button>
    </div>

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
