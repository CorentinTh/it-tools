<script setup lang="ts">
import prettyMilliseconds from 'pretty-ms';
import parse from 'parse-duration';
import { downTimeToSLA, slaToDowntimes } from './sla-calculator.service';
import { useQueryParam, useQueryParamOrStorage } from '@/composable/queryParams';
import { useValidation } from '@/composable/validation';

function prettySeconds(seconds: number | null) {
  if (!seconds) {
    return '';
  }
  return prettyMilliseconds(seconds * 1000);
}

const daysHours = useQueryParamOrStorage<{
  mon?: number
  tue?: number
  wed?: number
  thu?: number
  fri?: number
  sat?: number
  sun?: number
}>({
  name: 'days',
  storageName: 'sla:days',
  defaultValue: {
    mon: 24,
    tue: 24,
    wed: 24,
    thu: 24,
    fri: 24,
    sat: 24,
    sun: 24,
  },
});
const inputSLA = useQueryParam({ name: 'sla', defaultValue: 99.99 });
const outputDownTimes = computed(() => {
  const weekdaysHours = daysHours.value;
  const downtimesSeconds = slaToDowntimes({
    targetSLA: inputSLA.value,
    mondayHours: weekdaysHours.mon,
    tuesdayHours: weekdaysHours.tue,
    wednesdayHours: weekdaysHours.wed,
    thursdayHours: weekdaysHours.thu,
    fridayHours: weekdaysHours.fri,
    saturdayHours: weekdaysHours.sat,
    sundayHours: weekdaysHours.sun,
  });
  return {
    durationPerDay: prettySeconds(downtimesSeconds.secondsPerDay),
    durationPerMonth: prettySeconds(downtimesSeconds.secondsPerMonth),
    durationPerQuarter: prettySeconds(downtimesSeconds.secondsPerQuarter),
    durationPerWeek: prettySeconds(downtimesSeconds.secondsPerWeek),
    durationPerYear: prettySeconds(downtimesSeconds.secondsPerYear),
  };
});

const inputDuration = useQueryParam({ name: 'dur', defaultValue: '1s' });
const inputDurationValidation = useValidation({
  source: inputDuration,
  rules: [
    {
      message: 'Invalid duration',
      validator: value => parse(value),
    },
  ],
});
const inputDurationSeconds = computed(() => {
  if (!inputDurationValidation.isValid) {
    return 0;
  }
  return parse(inputDuration.value, 's') || 0;
});
const outputSLAs = computed(() => {
  const weekdaysHours = daysHours.value;
  const slas = downTimeToSLA({
    downTimeSeconds: inputDurationSeconds.value,
    mondayHours: weekdaysHours.mon,
    tuesdayHours: weekdaysHours.tue,
    wednesdayHours: weekdaysHours.wed,
    thursdayHours: weekdaysHours.thu,
    fridayHours: weekdaysHours.fri,
    saturdayHours: weekdaysHours.sat,
    sundayHours: weekdaysHours.sun,
  });
  return {
    slaForDay: slas.slaForDay?.toPrecision(6),
    slaForWeek: slas.slaForWeek.toPrecision(6),
    slaForMonth: slas.slaForMonth.toPrecision(6),
    slaForQuarter: slas.slaForQuarter.toPrecision(6),
    slaForYear: slas.slaForYear.toPrecision(6),
  };
});
</script>

<template>
  <div>
    <c-card title="SLA to downtimes" mb-2>
      <n-form-item label="Agreed SLA" label-placement="left">
        <n-input-number v-model:value="inputSLA" :min="0" :max="100" />
      </n-form-item>

      <n-divider />

      <n-form-item v-if="outputDownTimes.durationPerDay" label="Daily downtime" label-placement="left" label-width="100">
        <input-copyable :value="outputDownTimes.durationPerDay" />
      </n-form-item>
      <n-form-item label="Weekly downtime" label-placement="left" label-width="100">
        <input-copyable :value="outputDownTimes.durationPerWeek" />
      </n-form-item>
      <n-form-item label="Monthly downtime" label-placement="left" label-width="100">
        <input-copyable :value="outputDownTimes.durationPerMonth" />
      </n-form-item>
      <n-form-item label="Quarterly downtime" label-placement="left" label-width="100">
        <input-copyable :value="outputDownTimes.durationPerQuarter" />
      </n-form-item>
      <n-form-item label="Yearly downtime" label-placement="left" label-width="100">
        <input-copyable :value="outputDownTimes.durationPerYear" />
      </n-form-item>
    </c-card>

    <c-card title="Downtime to SLA" mb-2>
      <c-input-text
        v-model:value="inputDuration"
        label="Downtime duration"
        label-position="left"
        placeholder="Put downtime duration here..."
        :validation="inputDurationValidation"
        mb-2
      />

      <n-divider />

      <n-form-item v-if="outputSLAs.slaForDay" label="Daily SLA" label-placement="left" label-width="100">
        <input-copyable :value="outputSLAs.slaForDay" />
      </n-form-item>
      <n-form-item label="Weekly SLA" label-placement="left" label-width="100">
        <input-copyable :value="outputSLAs.slaForWeek" />
      </n-form-item>
      <n-form-item label="Monthly SLA" label-placement="left" label-width="100">
        <input-copyable :value="outputSLAs.slaForMonth" />
      </n-form-item>
      <n-form-item label="Quarterly SLA" label-placement="left" label-width="100">
        <input-copyable :value="outputSLAs.slaForQuarter" />
      </n-form-item>
      <n-form-item label="Yearly SLA" label-placement="left" label-width="100">
        <input-copyable :value="outputSLAs.slaForYear" />
      </n-form-item>
    </c-card>

    <c-card title="Weekdays hours">
      <div flex flex-wrap gap-1>
        <n-form-item label="Monday" flex-1>
          <n-input-number v-model:value="daysHours.mon" :min="0" :max="24" />
        </n-form-item>
        <n-form-item label="Tuesday" flex-1>
          <n-input-number v-model:value="daysHours.tue" :min="0" :max="24" />
        </n-form-item>
        <n-form-item label="Wednesday" flex-1>
          <n-input-number v-model:value="daysHours.wed" :min="0" :max="24" />
        </n-form-item>
        <n-form-item label="Thursday" flex-1>
          <n-input-number v-model:value="daysHours.thu" :min="0" :max="24" />
        </n-form-item>
        <n-form-item label="Friday" flex-1>
          <n-input-number v-model:value="daysHours.fri" :min="0" :max="24" />
        </n-form-item>
      </div>
      <div flex flex-wrap gap-1>
        <n-form-item label="Saturday" flex-1>
          <n-input-number v-model:value="daysHours.sat" :min="0" :max="24" />
        </n-form-item>
        <n-form-item label="Sunday" flex-1>
          <n-input-number v-model:value="daysHours.sun" :min="0" :max="24" />
        </n-form-item>
      </div>
    </c-card>
  </div>
</template>
