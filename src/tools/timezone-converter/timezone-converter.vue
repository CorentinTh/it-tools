<script setup lang="ts">
import ctz from 'countries-and-timezones';
import getTimezoneOffset from 'get-timezone-offset';

const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const allTimezones = Object.values(ctz.getAllTimezones()).map(tz => ({
  value: tz.name,
  label: `${tz.name === browserTimezone ? 'Browser TZ - ' : ''}${tz.name} (${tz.utcOffset === tz.dstOffset ? tz.utcOffsetStr : `${tz.utcOffsetStr}/${tz.dstOffsetStr}`})`,
}));

function convertMinsToHrsMins(minutes: number) {
  const h = String(Math.floor(minutes / 60)).padStart(2, '0');
  const m = String(minutes % 60).padStart(2, '0');
  return `${h}:${m}`;
}

const otherTimezones = useStorage<{ name: string }[]>('timezone-conv:zones', [{ name: 'Etc/GMT' }]);
const currentTimezone = useStorage<string>('timezone-conv:current', browserTimezone);
const now = Date.now();
const currentDatetimeRange = ref<[number, number]>([now, now]);
const currentTimezoneOffset = computed(() => {
  return convertMinsToHrsMins(-getTimezoneOffset(currentTimezone.value, new Date(currentDatetimeRange.value[0])));
});
function convertToTimezone(tz: string, timestamp: number) {
  return new Date(
    timestamp
    + getTimezoneOffset(currentTimezone.value, new Date()) * 60 * 1000
    - getTimezoneOffset(browserTimezone, new Date()) * 60 * 1000,
  ).toLocaleString(undefined,
    { timeZone: tz, timeZoneName: undefined, hour12: false });
}

const tzToCountriesInput = ref(browserTimezone);
const tzToCountriesOutput = computed(() => ctz.getCountriesForTimezone(tzToCountriesInput.value));

const allCountries = Object.values(ctz.getAllCountries()).map(c => ({
  value: c.id,
  label: `${c.name} (${c.id})`,
}));
const countryToTimezonesInput = ref('FR');
const countryToTimezonesOutput = computed(() => ctz.getTimezonesForCountry(countryToTimezonesInput.value));
</script>

<template>
  <div>
    <c-card title="Timezones Date-Time Converter" mb-2>
      <c-select
        v-model:value="currentTimezone"
        label="Timezone"
        label-position="left"
        searchable
        :options="allTimezones"
        mb-2
      />
      <n-date-picker
        v-model:value="currentDatetimeRange"
        type="datetimerange"
        mb-2
      />

      <input-copyable
        label="Current Timezone Offset (min)"
        label-position="left"
        :value="currentTimezoneOffset"
        mb-2
      />

      <c-card title="Date-Time in other timezones">
        <n-dynamic-input
          v-model:value="otherTimezones"
          show-sort-button
          :on-create="() => ({ name: browserTimezone })"
        >
          <template #default="{ value }">
            <div flex flex-wrap items-center gap-1>
              <n-select
                v-model:value="value.name"
                filterable
                placeholder="Please select a timezone"
                :options="allTimezones"
                w-full
              />
              <div w-full flex items-baseline gap-1>
                <n-input style="min-width: 49%" readonly :value="convertToTimezone(value.name, currentDatetimeRange[0])" />
                <n-input style="min-width: 49%" readonly :value="convertToTimezone(value.name, currentDatetimeRange[1])" />
              </div>
            </div>
          </template>
        </n-dynamic-input>
      </c-card>
    </c-card>

    <c-card title="Country to Timezones" mb-2>
      <c-select
        label="Country"
        label-position="left"
        :value="countryToTimezonesInput"
        searchable
        :options="allCountries"
      />

      <n-divider />

      <ul>
        <li v-for="(tz, ix) in countryToTimezonesOutput" :key="ix">
          {{ tz.name }} ({{ tz.countries.join(', ') }}): UTC= {{ tz.utcOffsetStr }}, DST= {{ tz.dstOffsetStr }}
        </li>
      </ul>
    </c-card>

    <c-card title="Timezones to Countries" mb-2>
      <c-select
        label="Timezone"
        label-position="left"
        :value="tzToCountriesInput"
        searchable
        :options="allTimezones"
      />

      <n-divider />

      <ul>
        <li v-for="(country, ix) in tzToCountriesOutput" :key="ix">
          {{ country.name }} ({{ country.id }}): {{ country.timezones.join(', ') }}
        </li>
      </ul>
    </c-card>
  </div>
</template>
