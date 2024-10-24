<script setup lang="ts">
import { getWeek, getWeekOfMonth } from 'date-fns';
import { getFirstMondayFromISOWeek, getFirstMondayFromMonthWeek } from './week-number-converter.service';

const now = new Date();

const inputDate = ref(now.getTime());
const outputWeekInMonth = computed(() => getWeekOfMonth(inputDate.value));
const outputWeekInYear = computed(() => getWeek(inputDate.value));

const inputWeekInMonth = ref({
  week: getWeekOfMonth(now),
  month: now.getMonth() + 1,
  year: now.getFullYear(),
});
const outputWeekInMonthMonday = computed(() => getFirstMondayFromMonthWeek(inputWeekInMonth.value.week, inputWeekInMonth.value.month, inputWeekInMonth.value.year));

const inputWeekInYear = ref({
  week: getWeek(now),
  year: now.getFullYear(),
});
const outputWeekInYearMonday = computed(() => getFirstMondayFromISOWeek(inputWeekInYear.value.week, inputWeekInYear.value.year));
</script>

<template>
  <div>
    <c-card title="Date to Week numbers">
      <n-form-item label="Date">
        <n-date-picker v-model:value="inputDate" type="date" />
      </n-form-item>

      <n-divider />

      <input-copyable readonly label="Week in Year" label-position="left" :value="outputWeekInYear" />
      <input-copyable readonly label="Week in Month" label-position="left" :value="outputWeekInMonth" />
    </c-card>
    <c-card title="Year Week Number to Date">
      <n-form-item label="Week in Year">
        <n-input-number v-model:value="inputWeekInYear.week" :min="1" :max="53" />
      </n-form-item>
      <n-form-item label="Year">
        <n-input-number v-model:value="inputWeekInYear.year" />
      </n-form-item>

      <n-divider />

      <input-copyable readonly label="First Monday" label-position="left" :value="outputWeekInYearMonday" />
    </c-card>
    <c-card title="Month Week Number to Date">
      <n-form-item label="Week in Month">
        <n-input-number v-model:value="inputWeekInMonth.week" :min="1" :max="5" />
      </n-form-item>
      <n-form-item label="Year">
        <n-input-number v-model:value="inputWeekInMonth.year" />
      </n-form-item>
      <n-form-item label="Month">
        <n-input-number v-model:value="inputWeekInMonth.month" :min="1" :max="12" />
      </n-form-item>

      <n-divider />

      <input-copyable readonly label="First Monday" label-position="left" :value="outputWeekInMonthMonday" />
    </c-card>
  </div>
</template>
