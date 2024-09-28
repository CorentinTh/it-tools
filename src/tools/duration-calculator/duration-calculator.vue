<script setup lang="ts">
import { computeDuration } from './duration-calculator.service';

const inputDurations = ref('');
const result = computed(() => computeDuration(inputDurations.value));
const errors = computed(() => result.value.errors.join('\n'));
</script>

<template>
  <div>
    <c-input-text
      v-model:value="inputDurations"
      multiline
      rows="5"
      label="Duration(s)"
      placeholder="Please enter duration, one per line with optional sign"
      mb-2
    />
    <n-p>Supports: comment (# line), HH:MM:SS.FFF, 3d 1h 3s..., P4DT12H20M20.3S..</n-p>

    <n-divider />

    <c-card title="Total">
      <input-copyable label="Prettified" :value="result.total.prettified" />
      <input-copyable label="Prettified (full)" :value="result.total.prettifiedVerbose" />
      <input-copyable label="Prettified (colon)" :value="result.total.prettifiedColonNotation" />
      <input-copyable label="Prettified (days)" :value="result.total.prettifiedDaysColon" />
      <input-copyable label="Prettified (hours)" :value="result.total.prettifiedHoursColon" />
      <input-copyable label="Prettified (ISO8601)" :value="result.total.iso8601Duration" />
      <input-copyable label="Milliseconds" :value="result.total.milliseconds" />
      <input-copyable label="Seconds" :value="result.total.seconds" />
      <input-copyable label="Minutes" :value="result.total.minutes" />
      <input-copyable label="Hours" :value="result.total.hours" />
      <input-copyable label="Days" :value="result.total.days" />
      <input-copyable label="Weeks" :value="result.total.weeks" />
      <input-copyable label="Years" :value="result.total.years" />
    </c-card>

    <c-card title="Lines errors" mb-2>
      <textarea-copyable :value="errors" />
    </c-card>
  </div>
</template>
