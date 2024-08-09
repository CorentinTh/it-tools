<script setup lang="ts">
import { dateFromObjectId, generateMongoFilter, objectIdFromDate, objectIdSyntaxFromDate } from './mongo-objectid-converter.service';
import { withDefaultOnError } from '@/utils/defaults';

const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const objectIdInput = ref(objectIdFromDate(new Date()));
const dateOutput = computed(() =>
  withDefaultOnError(() => dateFromObjectId(objectIdInput.value), 'Invalid ObjectId'),
);

const dateInput = ref(Date.now());
const dateValue = computed(() => new Date(dateInput.value));
const tableName = ref('tbl');
const objectIdOutput = computed(() =>
  withDefaultOnError(() => objectIdFromDate(dateValue.value), 'Invalid Date'),
);
const objectIdSyntaxOutput = computed(() =>
  withDefaultOnError(() => objectIdSyntaxFromDate(dateValue.value), 'Invalid Date'),
);
const objectIdQueryOutput = computed(() =>
  withDefaultOnError(() => generateMongoFilter({ date: dateValue.value, tableName: tableName.value }), 'Invalid Date'),
);
const objectIdUTCDate = computed(() =>
  dateValue.value.toISOString(),
);
</script>

<template>
  <c-card :title="`ObjectId to Date (${currentTimeZone})`">
    <c-input-text
      v-model:value="objectIdInput"
      placeholder="Put your ObjectId here..."
      label="ObjectId to encode"
      raw-text
      mb-5
    />

    <n-divider />

    <textarea-copyable
      :value="dateOutput instanceof Date ? dateOutput.toLocaleString(undefined, { timeZoneName: 'short' }) : dateOutput"
    />
    <textarea-copyable
      :value="dateOutput instanceof Date ? dateOutput.toISOString() : dateOutput"
    />
  </c-card>

  <c-card :title="`Date to ObjectId (${currentTimeZone})`">
    <n-form-item label="Date and time" label-placement="left" mb-2 flex-1>
      <n-date-picker v-model:value="dateInput" type="datetime" />
    </n-form-item>

    <c-input-text
      v-model:value="tableName"
      placeholder="Put your Table Name here..."
      label="Table Name"
      label-position="left"
      raw-text
      mb-5
    />

    <textarea-copyable :value="objectIdUTCDate" />
    <textarea-copyable :value="objectIdOutput" />
    <textarea-copyable :value="objectIdSyntaxOutput" />
    <textarea-copyable :value="objectIdQueryOutput" />
  </c-card>
</template>
