<script setup lang="ts">
import {
  formatISO,
  formatISO9075,
  formatRFC3339,
  formatRFC7231,
  fromUnixTime,
  getTime,
  getUnixTime,
  isDate,
  isValid,
  parseISO,
  parseJSON,
} from 'date-fns';
import type { DateFormat, ToDateMapper } from './date-time-converter.types';
import {
  dateToExcelFormat,
  excelFormatToDate,
  isExcelFormat,
  isISO8601DateTimeString,
  isISO9075DateString,
  isMongoObjectId,
  isRFC3339DateString,
  isRFC7231DateString,
  isTimestamp,
  isUTCDateString,
  isUnixTimestamp,
} from './date-time-converter.models';
import { withDefaultOnError } from '@/utils/defaults';
import { useValidation } from '@/composable/validation';

const { t } = useI18n();

const inputDate = ref('');

const toDate: ToDateMapper = date => new Date(date);

const formats: DateFormat[] = [
  {
    name: t('tools.date-converter.localDate'),
    fromDate: date => date.toString(),
    toDate,
    formatMatcher: () => false,
  },
  {
    name: t('tools.date-converter.ISO8601'),
    fromDate: formatISO,
    toDate: parseISO,
    formatMatcher: date => isISO8601DateTimeString(date),
  },
  {
    name: t('tools.date-converter.ISO9075'),
    fromDate: formatISO9075,
    toDate: parseISO,
    formatMatcher: date => isISO9075DateString(date),
  },
  {
    name: t('tools.date-converter.RFC3339'),
    fromDate: formatRFC3339,
    toDate,
    formatMatcher: date => isRFC3339DateString(date),
  },
  {
    name: t('tools.date-converter.RFC7231'),
    fromDate: formatRFC7231,
    toDate,
    formatMatcher: date => isRFC7231DateString(date),
  },
  {
    name: t('tools.date-converter.unixTimestamp'),
    fromDate: date => String(getUnixTime(date)),
    toDate: sec => fromUnixTime(+sec),
    formatMatcher: date => isUnixTimestamp(date),
  },
  {
    name: t('tools.date-converter.timestamp'),
    fromDate: date => String(getTime(date)),
    toDate: ms => parseJSON(+ms),
    formatMatcher: date => isTimestamp(date),
  },
  {
    name: t('tools.date-converter.UTCformat'),
    fromDate: date => date.toUTCString(),
    toDate,
    formatMatcher: date => isUTCDateString(date),
  },
  {
    name: t('tools.date-converter.mongoObjectID'),
    fromDate: date => `${Math.floor(date.getTime() / 1000).toString(16)}0000000000000000`,
    toDate: objectId => new Date(Number.parseInt(objectId.substring(0, 8), 16) * 1000),
    formatMatcher: date => isMongoObjectId(date),
  },
  {
    name: t('tools.date-converter.excelDate'),
    fromDate: date => dateToExcelFormat(date),
    toDate: excelFormatToDate,
    formatMatcher: isExcelFormat,
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
  }
  catch (_ignored) {
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
      message: t('tools.date-converter.invalidMessage'),
      validator: value =>
        withDefaultOnError(() => {
          if (value === '') {
            return true;
          }

          const maybeDate = formats[formatIndex.value].toDate(value);
          return isDate(maybeDate) && isValid(maybeDate);
        }, false),
    },
  ],
});

function formatDateUsingFormatter(formatter: (date: Date) => string, date?: Date) {
  if (!date || !validation.isValid) {
    return '';
  }

  return withDefaultOnError(() => formatter(date), '');
}
</script>

<template>
  <div>
    <div flex gap-2>
      <c-input-text
        v-model:value="inputDate"
        autofocus
        :placeholder="t('tools.date-converter.inputPlaceholder')"
        clearable
        test-id="date-time-converter-input"
        :validation="validation"
        @update:value="onDateInputChanged"
      />

      <c-select
        v-model:value="formatIndex"
        style="flex: 0 0 170px"
        :options="formats.map(({ name }, i) => ({ label: name, value: i }))"
        data-test-id="date-time-converter-format-select"
      />
    </div>

    <n-divider />

    <input-copyable
      v-for="{ name, fromDate } in formats"
      :key="name"
      :label="name"
      label-width="150px"
      label-position="left"
      label-align="right"
      :value="formatDateUsingFormatter(fromDate, normalizedDate)"
      :placeholder="t('tools.date-converter.invalidDatePlaceholder')"
      :test-id="name"
      readonly
      mt-2
    />
  </div>
</template>
