<template>
  <div>
    <n-card>
      <n-space justify="center">
        <n-form-item
          label="Use current date-time ?"
          label-placement="left"
          :show-feedback="false"
        >
          <n-switch v-model:value="useCurrentDate" />
        </n-form-item>
      </n-space>
      <n-form-item
        :feedback="inputInvalid ? 'Invalid date for the current format' : ''"
        :validation-status="inputInvalid ? 'error' : undefined"
      >
        <n-input-group style="flex-grow: 1;">
          <n-select
            v-model:value="inputFormat"
            style="width: 200px;"
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
      <n-divider style="margin-top: 0;" />
      <div
        v-for="{ name, fromDate } in formats"
        :key="name"
        style="margin: 5px 0;"
      >
        <n-input-group>
          <n-input-group-label style="width: 150px;">
            {{ name }}
          </n-input-group-label>
          <n-input :value="fromDate(date)" />
        </n-input-group>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { useRafFn } from '@vueuse/core';
import { formatISO, formatISO9075, formatRFC3339, formatRFC7231, fromUnixTime, getTime, getUnixTime, isDate, parseISO, parseJSON } from 'date-fns';
import { ref } from 'vue'

const useCurrentDate = ref(true)
const inputDate = ref('')
const inputFormat = ref(6)
const inputInvalid = ref(false)
const date = ref(new Date())

useRafFn(() => {
    if (useCurrentDate.value) {
        date.value = new Date()
    }
})

function onDateInputChanged(value: string) {
    const { toDate } = formats[inputFormat.value]
    inputInvalid.value = false

    try {
        const formatted: Date | string = toDate(value)

        if (!isDate(formatted) || isNaN(formatted.getTime())) {
            throw 'invalid date'
        }

        date.value = formatted
    } catch (_) {
        inputInvalid.value = true
    }
}

const formats = [
    {
        name: 'JS locale date string',
        fromDate: (date: Date) => date.toString(),
        toDate: (date: string) => new Date(date)
    },
    {
        name: 'ISO 8601',
        fromDate: (date: Date) => formatISO(date),
        toDate: (date: string) => parseISO(date)
    },
    {
        name: 'ISO 9075',
        fromDate: (date: Date) => formatISO9075(date),
        toDate: (date: string) => parseISO(date)
    },
    {
        name: 'RFC 3339',
        fromDate: (date: Date) => formatRFC3339(date),
        toDate: (date: string) => new Date(date)
    },
    {
        name: 'RFC 7231',
        fromDate: (date: Date) => formatRFC7231(date),
        toDate: (date: string) => new Date(date)
    },
    {
        name: 'Timestamp',
        fromDate: (date: Date) => String(getTime(date)),
        toDate: (ms: string) => parseJSON(+ms)
    },
    {
        name: 'Unix timestamp',
        fromDate: (date: Date) => String(getUnixTime(date)),
        toDate: (sec: string) => fromUnixTime(+sec)
    },
    {
        name: 'UTC format',
        fromDate: (date: Date) => date.toUTCString(),
        toDate: (date: string) => new Date(date)
    },
]

</script>

<style lang="less" scoped>
</style>