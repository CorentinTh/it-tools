<script setup lang="ts">
import { findAirline, findAirport } from 'aircodes';
import SpanCopyable from '@/components/SpanCopyable.vue';

const airline = ref('');
const airport = ref('');
const resultAirline = computed(() => findAirline(airline.value));
const resultAirport = computed(() => findAirport(airport.value));
</script>

<template>
  <div>
    <c-card title="Airline search">
      <n-space>
        <n-form-item label="Airline query">
          <n-input v-model:value="airline" />
        </n-form-item>
      </n-space>

      <n-divider />

      <n-form-item label="IATA">
        <SpanCopyable :value="resultAirline?.iata" />
      </n-form-item>
      <n-form-item label="ICAO">
        <SpanCopyable :value="resultAirline?.icao" />
      </n-form-item>
      <n-form-item label="Name">
        <SpanCopyable :value="resultAirline?.name" />
      </n-form-item>
      <n-form-item label="Logo">
        <img width="100" :alt="resultAirline?.name" :src="resultAirline?.logo">
      </n-form-item>
    </c-card>

    <c-card title="Airport search">
      <n-space>
        <n-form-item label="Airline query">
          <n-input v-model:value="airline" />
        </n-form-item>
      </n-space>

      <n-divider />

      <n-form-item label="IATA">
        <SpanCopyable :value="resultAirport?.iata" />
      </n-form-item>
      <n-form-item label="ICAO">
        <SpanCopyable :value="resultAirport?.icao" />
      </n-form-item>
      <n-form-item label="Name">
        <SpanCopyable :value="resultAirport?.name" />
      </n-form-item>
      <n-form-item label="City">
        <SpanCopyable :value="resultAirport?.city" />
      </n-form-item>
      <n-form-item label="State">
        <SpanCopyable :value="resultAirport?.state" />
      </n-form-item>
      <n-form-item label="Country">
        <SpanCopyable :value="resultAirport?.country" />
      </n-form-item>
    </c-card>
  </div>
</template>
