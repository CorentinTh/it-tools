<script setup lang="ts">
import cronstrue from 'cronstrue';
import ctz from 'countries-and-timezones';
import getTimezoneOffset from 'get-timezone-offset';
import { getCronType, getLastExecutionTimes, isCronValid } from './crontab-generator.service';
import { useStyleStore } from '@/stores/style.store';
import { useQueryParamOrStorage } from '@/composable/queryParams';

const styleStore = useStyleStore();

const cron = ref('40 * * * *');
const cronstrueConfig = reactive({
  verbose: true,
  dayOfWeekStartIndexZero: true,
  use24HourTimeFormat: true,
  throwExceptionOnParseError: true,
  monthStartIndexZero: false,
  tzOffset: (new Date()).getTimezoneOffset() / 60,
});

// getTimezoneOffset(tz.name, now) / 60
const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const allTimezones = Object.values(ctz.getAllTimezones()).map(tz => ({
  value: tz.name,
  label: `${tz.name === browserTimezone ? 'Browser TZ - ' : ''}${tz.name} (${tz.utcOffset === tz.dstOffset ? tz.utcOffsetStr : `${tz.utcOffsetStr}/${tz.dstOffsetStr}`})`,
}));
const currentTimezone = useQueryParamOrStorage({ name: 'tz', storageName: 'crongen:tz', defaultValue: browserTimezone });
watchEffect(() => {
  cronstrueConfig.tzOffset = -getTimezoneOffset(currentTimezone.value, new Date()) / 60;
});

const standardHelpers = [
  {
    symbol: '*',
    meaning: 'Any value',
    example: '* * * *',
    equivalent: 'Every minute',
  },
  {
    symbol: '-',
    meaning: 'Range of values',
    example: '1-10 * * *',
    equivalent: 'Minutes 1 through 10',
  },
  {
    symbol: ',',
    meaning: 'List of values',
    example: '1,10 * * *',
    equivalent: 'At minutes 1 and 10',
  },
  {
    symbol: '/',
    meaning: 'Step values',
    example: '*/10 * * *',
    equivalent: 'Every 10 minutes',
  },
  {
    symbol: '@yearly',
    meaning: 'Once every year at midnight of 1 January',
    example: '@yearly',
    equivalent: '0 0 1 1 *',
  },
  {
    symbol: '@annually',
    meaning: 'Same as @yearly',
    example: '@annually',
    equivalent: '0 0 1 1 *',
  },
  {
    symbol: '@monthly',
    meaning: 'Once a month at midnight on the first day',
    example: '@monthly',
    equivalent: '0 0 1 * *',
  },
  {
    symbol: '@weekly',
    meaning: 'Once a week at midnight on Sunday morning',
    example: '@weekly',
    equivalent: '0 0 * * 0',
  },
  {
    symbol: '@daily',
    meaning: 'Once a day at midnight',
    example: '@daily',
    equivalent: '0 0 * * *',
  },
  {
    symbol: '@midnight',
    meaning: 'Same as @daily',
    example: '@midnight',
    equivalent: '0 0 * * *',
  },
  {
    symbol: '@hourly',
    meaning: 'Once an hour at the beginning of the hour',
    example: '@hourly',
    equivalent: '0 * * * *',
  },
  {
    symbol: '@reboot',
    meaning: 'Run at startup',
    example: '',
    equivalent: '',
  },
];

const awsHelpers = [
  {
    symbol: '*',
    meaning: 'Any value',
    example: '* * * *',
    equivalent: 'Every minute',
  },
  {
    symbol: '-',
    meaning: 'Range of values',
    example: '1-10 * * *',
    equivalent: 'Minutes 1 through 10',
  },
  {
    symbol: ',',
    meaning: 'List of values',
    example: '1,10 * * *',
    equivalent: 'At minutes 1 and 10',
  },
  {
    symbol: '/',
    meaning: 'Step values',
    example: '*/10 * * *',
    equivalent: 'Every 10 minutes',
  },
  {
    symbol: '?',
    meaning: 'One or another. In the Day-of-month field you could enter 7, and if you didn\'t care what day of the week the seventh was, you could enter ? in the Day-of-week field',
    example: '9 * 7,9,11 5 ? 2021',
    equivalent: 'At 9 minutes past the hour, every hour, on day 7, 9, and 11 of the month, only in May, only in 2021',
  },
  {
    symbol: 'L',
    meaning: 'The L wildcard in the Day-of-month or Day-of-week fields specifies the last day of the month or week.',
    example: '9 * L 5 ? 2019,2020',
    equivalent: 'At 9 minutes past the hour, every hour, on the last day of the month, only in May, only in 2019 and 2020',
  },
  {
    symbol: 'W',
    meaning: 'The W wildcard in the Day-of-month field specifies a weekday. In the Day-of-month field, 3W specifies the day closest to the third weekday of the month.',
    example: '19 4 3W 9 ? 2019,2020',
    equivalent: 'At 04:19 AM, on the weekday nearest day 3 of the month, only in September, only in 2019 and 2020',
  },
  {
    symbol: '#',
    meaning: 'The # wildcard in the Day-of-week field specifies the nieth weekday of the month. 3#5 specifies the fifth Wednesday of the month',
    example: '9 8-20 ? 12 3#5 2019,2020',
    equivalent: 'At 9 minutes past the hour, between 08:00 AM and 08:59 PM, on the fifth Wednesday of the month, only in December, only in 2019 and 2020',
  },
];

const cronType = computed({
  get() {
    return getCronType(cron.value);
  },
  set(newCronType) {
    if (newCronType === 'aws') {
      cron.value = '0 0 ? * 1 *';
    }
    else {
      cron.value = '40 * * * *';
    }
  },
});
const getHelpers = computed(() => {
  if (cronType.value === 'aws') {
    return awsHelpers;
  }
  return standardHelpers;
});

const cronString = computed(() => {
  if (isCronValid(cron.value)) {
    return cronstrue.toString(cron.value, cronstrueConfig);
  }
  return ' ';
});

const cronValidationRules = [
  {
    validator: (value: string) => isCronValid(value),
    message: 'This cron is invalid',
  },
];

const executionTimesString = computed(() => {
  if (isCronValid(cron.value)) {
    try {
      const lastExecutionTimes = getLastExecutionTimes(cron.value, currentTimezone.value);
      const executionTimesString = lastExecutionTimes.join('\n');
      return `Next 5 execution times:\n${executionTimesString}`;
    }
    catch (e: any) {
      return e.toString();
    }
  }
  return ' ';
});
</script>

<template>
  <c-card>
    <div mx-auto max-w-sm>
      <c-input-text
        v-model:value="cron"
        size="large"
        placeholder="* * * * *"
        :validation-rules="cronValidationRules"
        mb-3
      />
    </div>

    <n-radio-group v-model:value="cronType" name="radiogroup" mb-2 flex justify-center>
      <n-space>
        <n-radio
          value="standard"
          label="Unix standard"
        />
        <n-radio
          value="aws"
          label="AWS"
        />
      </n-space>
    </n-radio-group>

    <div class="cron-string">
      {{ cronString }}
    </div>

    <div class="cron-execution-string">
      {{ executionTimesString }}
    </div>

    <n-divider />

    <div flex justify-center>
      <n-form :show-feedback="false" label-width="170" label-placement="left">
        <n-form-item label="Verbose">
          <n-switch v-model:value="cronstrueConfig.verbose" />
        </n-form-item>
        <n-form-item label="Use 24 hour time format">
          <n-switch v-model:value="cronstrueConfig.use24HourTimeFormat" />
        </n-form-item>
        <n-form-item label="Days start at 0">
          <n-switch v-model:value="cronstrueConfig.dayOfWeekStartIndexZero" />
        </n-form-item>
        <n-form-item label="Months start at 0">
          <n-switch v-model:value="cronstrueConfig.monthStartIndexZero" />
        </n-form-item>
        <c-select
          v-model:value="currentTimezone"
          searchable
          label="Timezone:"
          :options="allTimezones"
        />
      </n-form>
    </div>
  </c-card>
  <c-card>
    <pre v-if="cronType === 'standard'">
-- Standard CRON Syntax --
┌──────────── [optional] seconds (0 - 59)
| ┌────────── minute (0 - 59)
| | ┌──────── hour (0 - 23)
| | | ┌────── day of month (1 - 31)
| | | | ┌──── month (1 - 12) OR jan,feb,mar,apr ...
| | | | | ┌── day of week (0 - 6, sunday=0) OR sun,mon ...
| | | | | |
* * * * * * command</pre>

    <pre v-if="cronType === 'aws'">
-- AWS CRON Syntax --
┌──────────── minute (0 - 59)
| ┌────────── hour (0 - 23)
| | ┌──────── day of month (1 - 31) OR ? OR L OR W
| | | ┌────── month (1 - 12) OR jan,feb,mar,apr ...
| | | | ┌──── day of week (0 - 6, sunday=0) OR sun,mon OR L ...
| | | | | ┌── year
| | | | | |
* * * * * *</pre>

    <div v-if="styleStore.isSmallScreen">
      <c-card v-for="{ symbol, meaning, example, equivalent } in getHelpers" :key="symbol" mb-3 important:border-none>
        <div>
          Symbol: <strong>{{ symbol }}</strong>
        </div>
        <div>
          Meaning: <strong>{{ meaning }}</strong>
        </div>
        <div>
          Example:
          <strong><code>{{ example }}</code></strong>
        </div>
        <div>
          Equivalent: <strong>{{ equivalent }}</strong>
        </div>
      </c-card>
    </div>

    <c-table v-else :data="getHelpers" />
  </c-card>
</template>

<style lang="less" scoped>
::v-deep(input) {
  font-size: 30px;
  font-family: monospace;
  padding: 5px;
  text-align: center;
}

.cron-string {
  text-align: center;
  font-size: 22px;
  opacity: 0.8;
  margin: 5px 0 15px;
}

pre {
  overflow: auto;
  padding: 10px 0;
}

.cron-execution-string{
  text-align: center;
  font-size: 14px;
  opacity: 0.8;
  margin: 5px 0 15px;
  white-space: pre-wrap;
}
</style>
