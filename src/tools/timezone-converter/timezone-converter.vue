<script setup lang="ts">
import { convertBetweenTimezones, listTimezones } from './timezone-converter.models';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useValidation } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

const zones = listTimezones();
const zoneOptions = zones.map(zone => ({ label: zone, value: zone }));

const dateTime = useStorage('timezone-converter:dateTime', '2024-01-15 12:00:00');
const fromTz = useStorage('timezone-converter:from', 'UTC');
const toTz = useStorage('timezone-converter:to', 'Asia/Shanghai');

const result = computed(() =>
  withDefaultOnError(() => convertBetweenTimezones({ dateTime: dateTime.value, fromTz: fromTz.value, toTz: toTz.value }), undefined),
);

const validation = useValidation({
  source: dateTime,
  rules: [
    {
      validator: value => !value || !Number.isNaN(Date.parse(`${value.trim().replace(' ', 'T')}Z`)),
      message: 'Invalid date/time (expected YYYY-MM-DD HH:mm:ss)',
    },
  ],
});

function setNow() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  dateTime.value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
</script>

<template>
  <div style="max-width: 640px; margin: 0 auto;">
    <c-card mb-3>
      <c-input-text
        v-model:value="dateTime"
        label="Date and time (interpreted in the source timezone)"
        placeholder="YYYY-MM-DD HH:mm:ss"
        :validation="validation"
        mb-2
      />

      <n-grid cols="2" x-gap="12" mb-2>
        <n-gi>
          <c-select v-model:value="fromTz" label="From timezone" label-position="top" :options="zoneOptions" filterable />
        </n-gi>
        <n-gi>
          <c-select v-model:value="toTz" label="To timezone" label-position="top" :options="zoneOptions" filterable />
        </n-gi>
      </n-grid>

      <c-button @click="setNow()">
        Use current time
      </c-button>
    </c-card>

    <c-card v-if="result">
      <n-form-item label="Time in target timezone:" label-placement="top">
        <TextareaCopyable :value="`${result.formatted} (${result.targetOffset})`" copy-placement="outside" mb-1 />
      </n-form-item>
      <div text-xs op-60>
        Source zone offset: {{ result.sourceOffset }} · DST rules applied automatically
      </div>
    </c-card>
  </div>
</template>
