<template>
  <div>
    <n-form-item :show-label="false" v-bind="validation.attrs">
      <n-input-group>
        <n-input
          v-model:value="inputDate"
          autofocus
          :on-input="onDateInputChanged"
          placeholder="Put you date string here..."
          clearable
          :input-props="{ 'data-test-id': 'date-time-converter-input' }"
        />

        <n-select
          v-model:value="formatIndex"
          style="flex: 0 0 170px"
          :options="formats.map(({ name }, i) => ({ label: name, value: i }))"
          data-test-id="date-time-converter-format-select"
        />
      </n-input-group>
    </n-form-item>
    <n-divider style="margin-top: 0" />
    <div v-for="{ name, fromDate } in formats" :key="name" mt-1>
      <n-input-group>
        <n-input-group-label style="flex: 0 0 170px"> {{ name }}: </n-input-group-label>
        <input-copyable
          :value="formatDateUsingFormatter(fromDate, normalizedDate)"
          placeholder="Invalid date..."
          :input-props="{ 'data-test-id': name }"
        />
      </n-input-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  formatISO,
  formatISO9075,
  formatRFC3339,
  formatRFC7231,
  fromUnixTime,
  getTime,
  getUnixTime,
  parseISO,
  parseJSON,
  isDate,
  isValid,
} from 'date-fns';
import { withDefaultOnError } from '@/utils/defaults';
import { useValidation } from '@/composable/validation';
import type { DateFormat, ToDateMapper } from './date-time-converter.types';
import {
  isISO8601DateTimeString,
  isISO9075DateString,
  isRFC3339DateString,
  isRFC7231DateString,
  isTimestamp,
  isUTCDateString,
  isUnixTimestamp,
  isMongoObjectId,
} from './date-time-converter.models';

const inputDate = ref('');

const toDate: ToDateMapper = (date) => new Date(date);

function formatDateUsingFormatter(formatter: (date: Date) => string, date?: Date) {
  if (!date || !validation.isValid) {
    return '';
  }

  return withDefaultOnError(() => formatter(date), '');
}

const formats: DateFormat[] = [
  {
    name: 'JS locale date string',
    fromDate: (date) => date.toString(),
    toDate,
    formatMatcher: () => false,
  },
  {
    name: 'ISO 8601',
    fromDate: formatISO,
    toDate: parseISO,
    formatMatcher: (date) => isISO8601DateTimeString(date),
  },
  {
    name: 'ISO 9075',
    fromDate: formatISO9075,
    toDate: parseISO,
    formatMatcher: (date) => isISO9075DateString(date),
  },
  {
    name: 'RFC 3339',
    fromDate: formatRFC3339,
    toDate,
    formatMatcher: (date) => isRFC3339DateString(date),
  },
  {
    name: 'RFC 7231',
    fromDate: formatRFC7231,
    toDate,
    formatMatcher: (date) => isRFC7231DateString(date),
  },
  {
    name: 'Unix timestamp',
    fromDate: (date) => String(getUnixTime(date)),
    toDate: (sec) => fromUnixTime(+sec),
    formatMatcher: (date) => isUnixTimestamp(date),
  },
  {
    name: 'Timestamp',
    fromDate: (date) => String(getTime(date)),
    toDate: (ms) => parseJSON(+ms),
    formatMatcher: (date) => isTimestamp(date),
  },
  {
    name: 'UTC format',
    fromDate: (date) => date.toUTCString(),
    toDate,
    formatMatcher: (date) => isUTCDateString(date),
  },
  {
    name: 'Mongo ObjectID',
    fromDate: (date) => Math.floor(date.getTime() / 1000).toString(16) + '0000000000000000',
    toDate: (objectId) => new Date(parseInt(objectId.substring(0, 8), 16) * 1000),
    formatMatcher: (date) => isMongoObjectId(date),
  },
];

const formatIndex = ref(6);
const now = useNow();

const normalizedDate = computed(() => {
  if (!inputDate.value) {
    return now.value;
  }

  const { toDate } = formats[formatIndex.value];

  try {
    return toDate(inputDate.value);
  } catch (_ignored) {
    return undefined;
  }
});

function onDateInputChanged(value: string) {
  const matchingIndex = formats.findIndex(({ formatMatcher }) => formatMatcher(value));
  if (matchingIndex !== -1) {
    formatIndex.value = matchingIndex;
  }
}

const validation = useValidation({
  source: inputDate,
  watch: [formatIndex],
  rules: [
    {
      message: 'This date is invalid for this format',
      validator: (value) =>
        withDefaultOnError(() => {
          if (value === '') return true;

          const maybeDate = formats[formatIndex.value].toDate(value);
          return isDate(maybeDate) && isValid(maybeDate);
        }, false),
    },
  ],
});
</script>
