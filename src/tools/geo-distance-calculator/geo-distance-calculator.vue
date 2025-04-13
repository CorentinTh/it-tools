<script setup lang="ts">
import haversine from 'haversine';
import SpanCopyable from '@/components/SpanCopyable.vue';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const latitude1 = useQueryParamOrStorage({ name: 'lat1', storageName: 'geo-dist:lat1', defaultValue: 0 });
const longitude1 = useQueryParamOrStorage({ name: 'lng1', storageName: 'geo-dist:lng1', defaultValue: 0 });

const latitude2 = useQueryParamOrStorage({ name: 'lat2', storageName: 'geo-dist:lat2', defaultValue: 0 });
const longitude2 = useQueryParamOrStorage({ name: 'lng2', storageName: 'geo-dist:lng2', defaultValue: 0 });

const start = computed(() => ({ latitude: latitude1.value, longitude: longitude1.value }));
const end = computed(() => ({ latitude: latitude2.value, longitude: longitude2.value }));

const { coords: userCoords } = useGeolocation();

const distanceKM = computed(() => haversine(start.value, end.value, { unit: 'km' }));
const distanceMeter = computed(() => haversine(start.value, end.value, { unit: 'meter' }));
const distanceMile = computed(() => haversine(start.value, end.value, { unit: 'mile' }));
const distanceNMI = computed(() => haversine(start.value, end.value, { unit: 'nmi' }));
</script>

<template>
  <div>
    <c-card title="Distance computer" mb-2>
      <n-form-item label="Geolocation 1 (latitude, longitude):">
        <n-space justify="space-between">
          <n-input-number v-model:value="latitude1" :min="-90" :max="90" placeholder="Latitude..." />
          <n-input-number v-model:value="longitude1" :min="-180" :max="180" placeholder="Longitude..." />
        </n-space>
      </n-form-item>
      <n-form-item label="Geolocation 2 (latitude, longitude):" gap-2>
        <n-space justify="space-between">
          <n-input-number v-model:value="latitude2" :min="-90" :max="90" placeholder="Latitude..." />
          <n-input-number v-model:value="longitude2" :min="-180" :max="180" placeholder="Longitude..." />
        </n-space>
      </n-form-item>

      <n-divider />

      <n-form-item label="Distance (km):" label-width="120px" label-placement="left">
        <SpanCopyable :value="distanceKM.toString()" />
      </n-form-item>
      <n-form-item label="Distance (mile):" label-width="120px" label-placement="left">
        <SpanCopyable :value="distanceMile.toString()" />
      </n-form-item>
      <n-form-item label="Distance (meter):" label-width="120px" label-placement="left">
        <SpanCopyable :value="distanceMeter.toString()" />
      </n-form-item>
      <n-form-item label="Distance (nmi):" label-width="120px" label-placement="left">
        <SpanCopyable :value="distanceNMI.toString()" />
      </n-form-item>
    </c-card>

    <c-card title="Your position">
      <n-space justify="center">
        <n-form-item label="Latitude:" label-placement="left">
          <SpanCopyable :value="userCoords?.latitude?.toString() || 'Unknown'" />
        </n-form-item>
        <n-form-item label="Longitude:" label-placement="left">
          <SpanCopyable :value="userCoords?.longitude?.toString() || 'Unknown'" />
        </n-form-item>
      </n-space>
      <n-space justify="center">
        <n-form-item label="Altitude:" label-placement="left">
          <SpanCopyable :value="userCoords?.altitude?.toString() || 'Unknown'" />
        </n-form-item>
        <n-form-item label="Heading:" label-placement="left">
          <SpanCopyable :value="userCoords?.heading?.toString() || 'Unknown'" />
        </n-form-item>
        <n-form-item label="Speed:" label-placement="left">
          <SpanCopyable :value="userCoords?.speed?.toString() || 'Unknown'" />
        </n-form-item>
        <n-form-item label="Accuracy:" label-placement="left">
          <SpanCopyable :value="userCoords?.accuracy?.toString() || 'Unknown'" />
        </n-form-item>
      </n-space>
    </c-card>
  </div>
</template>
