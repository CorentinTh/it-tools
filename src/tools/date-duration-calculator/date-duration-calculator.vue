<script setup lang="ts">
import { addToDate } from './date-duration-calculator.service';

const now = Date.now();

const inputReferenceDate = ref(now);
const inputDurations = ref('');
const resultDateAdder = computed(() => addToDate(new Date(inputReferenceDate.value), inputDurations.value));
const errorsDateAdder = computed(() => resultDateAdder.value.errors.join('\n'));
</script>

<template>
  <div>
    <c-card title="Date + Duration Calculator" mb-2>
      <n-form-item label="Reference Date:" label-placement="left" mb-1>
        <n-date-picker v-model:value="inputReferenceDate" type="datetime" />
      </n-form-item>

      <c-input-text
        v-model:value="inputDurations"
        multiline
        rows="5"
        label="Duration(s)"
        placeholder="Please enter duration, one per line with optional sign"
        mb-2
      />
      <n-p>Supports: comment (# line), HH:MM:SS.FFF, 3d 1h 3s..., P4DT12H20M20.3S..</n-p>

      <c-card v-if="errorsDateAdder" title="Lines errors">
        <textarea-copyable :value="errorsDateAdder" />
      </c-card>

      <n-divider />

      <input-copyable v-if="resultDateAdder" label="Result Date:" label-position="left" label-width="150px" :value="resultDateAdder.date.toString()" mb-1 />
      <input-copyable v-if="resultDateAdder" label="Result ISO Date:" label-position="left" label-width="150px" :value="resultDateAdder.date.toISOString()" mb-1 />
      <input-copyable v-if="resultDateAdder" label="Duration (seconds):" label-position="left" label-width="150px" :value="resultDateAdder.durationSeconds" mb-1 />
      <input-copyable v-if="resultDateAdder" label="Duration:" label-position="left" label-width="150px" :value="resultDateAdder.durationPretty" mb-1 />
    </c-card>
  </div>
</template>
