<script setup lang="ts">
import ctz from 'countries-and-timezones';
import { type Weekdays, allWeekDays, diffDateTimes, getSupportedCountries, getSupportedRegions, getSupportedStates } from './days-calculator.service';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const now = Date.now();

const inputDateRange = ref<[number, number]>([now, now + 86400]);

const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const allTimezones = Object.values(ctz.getAllTimezones()).map(tz => ({
  value: tz.name,
  label: `${tz.name === browserTimezone ? 'Browser TZ - ' : ''}${tz.name} (${tz.utcOffset === tz.dstOffset ? tz.utcOffsetStr : `${tz.utcOffsetStr}/${tz.dstOffsetStr}`})`,
}));
const allCountries = ref(getSupportedCountries());
const country = useQueryParamOrStorage({ name: 'country', storageName: 'days-calc:ctr', defaultValue: 'FR' });
const possibleStates = computed(() => getSupportedStates(country.value));
const state = useQueryParamOrStorage({ name: 'state', storageName: 'days-calc:st', defaultValue: '' });
const possibleRegions = computed(() => getSupportedRegions(country.value, state.value));
const region = useQueryParamOrStorage({ name: 'region', storageName: 'days-calc:reg', defaultValue: '' });
const includeEndDate = useQueryParamOrStorage({ name: 'includeend', storageName: 'days-calc:end', defaultValue: false });
const includeWeekDays = useQueryParamOrStorage<Weekdays[]>({ name: 'days', storageName: 'days-calc:days', defaultValue: allWeekDays });
const includeHolidays = useQueryParamOrStorage({ name: 'includehol', storageName: 'days-calc:hol', defaultValue: true });
const businessStartHour = useQueryParamOrStorage({ name: 'businessstart', storageName: 'days-calc:bss', defaultValue: 9 });
const businessEndHour = useQueryParamOrStorage({ name: 'businessstend', storageName: 'days-calc:bse', defaultValue: 18 });
const businessTimezone = useQueryParamOrStorage({ name: 'tz', storageName: 'days-calc:tz', defaultValue: browserTimezone });
const error = ref('');
const resultDaysDiff = computed(() => {
  try {
    return diffDateTimes({
      date1: new Date(inputDateRange.value[0] / 1000 * 1000),
      date2: new Date(inputDateRange.value[1] / 1000 * 1000),
      country: country.value,
      state: state.value,
      region: region.value,
      businessTimezone: businessTimezone.value,
      includeEndDate: includeEndDate.value,
      includeWeekDays: includeWeekDays.value,
      includeHolidays: includeHolidays.value,
      businessStartHour: businessStartHour.value,
      businessEndHour: businessEndHour.value,
    });
  }
  catch (e: any) {
    error.value = e.toString();
    return null;
  }
});

const inputProps = {
  'labelPosition': 'left',
  'labelWidth': '170px',
  'readonly': true,
  'mb-2': '',
} as const;
</script>

<template>
  <div>
    <c-card title="Dates Interval" mb-2>
      <n-form-item label="Date Range:" label-placement="left" label-width="100px" label-align="left" mb-1>
        <n-date-picker v-model:value="inputDateRange" type="datetimerange" />
      </n-form-item>

      <c-select
        v-model:value="country"
        label-position="left"
        label-width="100px"
        searchable
        label="Country:"
        :options="allCountries"
        mb-1
      />
      <c-select
        v-if="possibleStates?.length > 0"
        v-model:value="state"
        label-position="left"
        label-width="100px"
        searchable
        label="State:"
        :options="possibleStates"
        placeholder="Select a specific state or let empty for general info"
        mb-1
      />
      <c-select
        v-if="possibleRegions?.length > 0"
        v-model:value="region"
        label-position="left"
        label-width="100px"
        searchable
        label="Region:"
        :options="possibleRegions"
        mb-1
      />
      <c-select
        v-model:value="businessTimezone"
        label-position="left"
        label-width="100px"
        searchable
        label="Timezone:"
        :options="allTimezones"
        mb-2
      />

      <div mb-2 flex items-baseline gap-2>
        <n-form-item label="Business Start Hour:" label-placement="left" flex-1>
          <n-input-number v-model:value="businessStartHour" :min="0" :max="24" />
        </n-form-item>
        <n-form-item label="Business End Hour:" label-placement="left" flex-1>
          <n-input-number v-model:value="businessEndHour" :min="0" :max="24" />
        </n-form-item>
      </div>

      <div mb-2 flex items-baseline justify-center gap-2>
        <n-checkbox v-model:checked="includeHolidays">
          Include Holidays
        </n-checkbox>
        <n-checkbox v-model:checked="includeEndDate">
          Include End Date
        </n-checkbox>
      </div>

      <c-card title="Weekdays">
        <n-checkbox-group v-model:value="includeWeekDays">
          <n-space justify="center">
            <n-checkbox value="monday" label="Monday" />
            <n-checkbox value="tuesday" label="Tuesday" />
            <n-checkbox value="wednesday" label="Wednesday" />
            <n-checkbox value="thursday" label="Thursday" />
            <n-checkbox value="friday" label="Friday" />
            <n-checkbox value="saturday" label="Saturday" />
            <n-checkbox value="sunday" label="Sunday" />
          </n-space>
        </n-checkbox-group>
      </c-card>

      <n-divider />

      <c-alert v-if="error">
        {{ error }}
      </c-alert>

      <c-card v-if="resultDaysDiff" title="Result">
        <input-copyable v-bind="inputProps" label="Start Date" :value="resultDaysDiff.startDate" />
        <input-copyable v-bind="inputProps" label="Start Date (ISO)" :value="resultDaysDiff.startDate.toISOString()" />
        <input-copyable v-bind="inputProps" label="End Date" :value="resultDaysDiff.endDate" />
        <input-copyable v-bind="inputProps" label="End Date (ISO)" :value="resultDaysDiff.endDate.toISOString()" />
        <n-divider />
        <input-copyable v-bind="inputProps" label="Total Difference Seconds" :value="resultDaysDiff.totalDifference.seconds" />
        <input-copyable v-bind="inputProps" label="Total Difference Minutes" :value="resultDaysDiff.totalDifference.minutes" />
        <input-copyable v-bind="inputProps" label="Total Difference Hours" :value="resultDaysDiff.totalDifference.hours" />
        <input-copyable v-bind="inputProps" label="Total Difference Days" :value="resultDaysDiff.totalDifference.days" />
        <input-copyable v-bind="inputProps" label="Total Difference Weeks" :value="resultDaysDiff.totalDifference.weeks" />
        <input-copyable v-bind="inputProps" label="Total Difference Months" :value="resultDaysDiff.totalDifference.months" />
        <input-copyable v-bind="inputProps" label="Total Difference Years" :value="resultDaysDiff.totalDifference.years" />
        <input-copyable v-bind="inputProps" label="Total Difference" :value="resultDaysDiff.totalDifferenceFormatted" />
        <n-divider />
        <input-copyable v-bind="inputProps" label="Difference Seconds" :value="resultDaysDiff.differenceSeconds" />
        <input-copyable v-bind="inputProps" label="Difference " :value="resultDaysDiff.differenceFormatted" />
        <n-divider />
        <input-copyable v-bind="inputProps" label="Business Seconds" :value="resultDaysDiff.businessSeconds" />
        <input-copyable v-bind="inputProps" label="Business Time" :value="resultDaysDiff.businessSecondsFormatted" />
        <input-copyable v-bind="inputProps" label="Business Hours" :value="resultDaysDiff.businessHours" />
        <input-copyable v-bind="inputProps" label="Business Days" :value="resultDaysDiff.businessDays" />
        <n-divider />
        <input-copyable v-bind="inputProps" placeholder="None" label="Mondays" :value="resultDaysDiff.mondays" />
        <input-copyable v-bind="inputProps" placeholder="None" label="Tuesdays" :value="resultDaysDiff.tuesdays" />
        <input-copyable v-bind="inputProps" placeholder="None" label="Wednesdays" :value="resultDaysDiff.wednesdays" />
        <input-copyable v-bind="inputProps" placeholder="None" label="Thursdays" :value="resultDaysDiff.thursdays" />
        <input-copyable v-bind="inputProps" placeholder="None" label="Fridays" :value="resultDaysDiff.fridays" />
        <input-copyable v-bind="inputProps" placeholder="None" label="Saturdays" :value="resultDaysDiff.saturdays" />
        <input-copyable v-bind="inputProps" placeholder="None" label="Sundays" :value="resultDaysDiff.sundays" />
        <n-divider />
        <input-copyable v-bind="inputProps" label="Weekend Days" :value="resultDaysDiff.weekendDays" />
        <input-copyable v-bind="inputProps" label="Full Weekends" :value="resultDaysDiff.weekends" />
        <c-card v-if="resultDaysDiff.holidays?.length" title="Holidays in period">
          <ul>
            <li v-for="(holiday, index) in resultDaysDiff.holidays" :key="index">
              {{ holiday.date }}: {{ holiday.name }} ({{ holiday.type }})
            </li>
          </ul>
        </c-card>
      </c-card>
    </c-card>
  </div>
</template>
