<template>
  <div>
    <n-card>
      <n-space justify="center">
        <n-form-item label="Use current date-time ?" label-placement="left" :show-feedback="false">
          <n-switch v-model:value="useCurrentDate" />
        </n-form-item>
      </n-space>
      <n-form-item
        :feedback="inputInvalid ? 'Invalid date for the current format' : ''"
        :validation-status="inputInvalid ? 'error' : undefined"
      >
        <n-input-group style="flex-grow: 1">
          <n-select
            v-model:value="inputFormat"
            style="width: 200px"
            :options="formats.map(({ name }, i) => ({ label: name, value: i }))"
            :disabled="useCurrentDate"
          />

          <n-input
            v-model:value="inputDate"
            :on-input="onDateInputChanged"
            :disabled="useCurrentDate"
            placeholder="Your date string..."
          />
        </n-input-group>
      </n-form-item>
      <n-divider style="margin-top: 0" />
      <div v-for="{ name, fromDate } in formats" :key="name" style="margin: 5px 0">
        <n-input-group>
          <n-input-group-label style="flex: 0 0 170px"> {{ name }}: </n-input-group-label>
          <input-copyable :value="fromDate(baseDate)" />
        </n-input-group>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { useRafFn } from '@vueuse/core';
import {
  formatISO,
  formatISO9075,
  formatRFC3339,
  formatRFC7231,
  fromUnixTime,
  getTime,
  getUnixTime,
  isDate,
  parseISO,
  parseJSON,
} from 'date-fns';
import { ref } from 'vue';
import InputCopyable from '../../components/InputCopyable.vue';

const useCurrentDate = ref(true);
const inputDate = ref('');
const inputFormat = ref(6);
const inputInvalid = ref(false);
const baseDate = ref(new Date());

useRafFn(() => {
  if (useCurrentDate.value) {
    baseDate.value = new Date();
  }
});

function onDateInputChanged(value: string) {
  const { toDate } = formats[inputFormat.value];
  inputInvalid.value = false;

  try {
    const formatted: Date | string = toDate(value);

    if (!isDate(formatted) || isNaN(formatted.getTime())) {
      throw new Error('Invalid date');
    }

    baseDate.value = formatted;
  } catch (_) {
    inputInvalid.value = true;
  }
}

type Format = {
  name: string;
  fromDate: (date: Date) => string;
  toDate: (value: string) => Date;
};

const toDate: Format['toDate'] = (date) => new Date(date);

const formats: Format[] = [
  {
    name: 'JS locale date string',
    fromDate: (date) => date.toString(),
    toDate,
  },
  {
    name: 'ISO 8601',
    fromDate: formatISO,
    toDate: parseISO,
  },
  {
    name: 'ISO 9075',
    fromDate: formatISO9075,
    toDate: parseISO,
  },
  {
    name: 'RFC 3339',
    fromDate: formatRFC3339,
    toDate,
  },
  {
    name: 'RFC 7231',
    fromDate: formatRFC7231,
    toDate,
  },
  {
    name: 'Timestamp',
    fromDate: (date) => String(getTime(date)),
    toDate: (ms) => parseJSON(+ms),
  },
  {
    name: 'Unix timestamp',
    fromDate: (date) => String(getUnixTime(date)),
    toDate: (sec) => fromUnixTime(+sec),
  },
  {
    name: 'UTC format',
    fromDate: (date) => date.toUTCString(),
    toDate,
  },
  {
    name: 'Mongo ObjectID',
    fromDate: (date) => Math.floor(date.getTime() / 1000).toString(16) + '0000000000000000',
    toDate: (objectId) => new Date(parseInt(objectId.substring(0, 8), 16) * 1000),
  },
];
</script>
