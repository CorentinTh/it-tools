<template>
  <c-card>
    <n-form-item
      class="cron"
      :show-label="false"
      :feedback="cronValidation.message"
      :validation-status="cronValidation.status"
    >
      <n-input v-model:value="cron" size="large" placeholder="* * * * *" />
    </n-form-item>
    <div class="cron-string">
      {{ cronString }}
    </div>

    <n-divider />

    <n-space justify="center">
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
      </n-form>
    </n-space>
  </c-card>
  <c-card>
    <pre>
┌──────────── [optional] seconds (0 - 59)
| ┌────────── minute (0 - 59)
| | ┌──────── hour (0 - 23)
| | | ┌────── day of month (1 - 31)
| | | | ┌──── month (1 - 12) OR jan,feb,mar,apr ...
| | | | | ┌── day of week (0 - 6, sunday=0) OR sun,mon ...
| | | | | |
* * * * * * command</pre
    >

    <n-space v-if="styleStore.isSmallScreen" vertical>
      <c-card v-for="{ symbol, meaning, example, equivalent } in helpers" :key="symbol" important:border-none>
        <div>
          Symbol: <strong>{{ symbol }}</strong>
        </div>
        <div>
          Meaning: <strong>{{ meaning }}</strong>
        </div>
        <div>
          Example:
          <strong
            ><code>{{ example }}</code></strong
          >
        </div>
        <div>
          Equivalent: <strong>{{ equivalent }}</strong>
        </div>
      </c-card>
    </n-space>
    <n-table v-else size="small">
      <thead>
        <tr>
          <th class="text-left" scope="col">Symbol</th>
          <th class="text-left" scope="col">Meaning</th>
          <th class="text-left" scope="col">Example</th>
          <th class="text-left" scope="col">Equivalent</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="{ symbol, meaning, example, equivalent } in helpers" :key="symbol">
          <td>{{ symbol }}</td>
          <td>{{ meaning }}</td>
          <td>
            <code>{{ example }}</code>
          </td>
          <td>{{ equivalent }}</td>
        </tr>
      </tbody>
    </n-table>
  </c-card>
</template>

<script setup lang="ts">
import cronstrue from 'cronstrue';
import { isValidCron } from 'cron-validator';
import { computed, reactive, ref } from 'vue';
import { useValidation } from '@/composable/validation';
import { useStyleStore } from '@/stores/style.store';

function isCronValid(v: string) {
  return isValidCron(v, { allowBlankDay: true, alias: true, seconds: true });
}

const styleStore = useStyleStore();

const cron = ref('40 * * * *');
const cronstrueConfig = reactive({
  verbose: true,
  dayOfWeekStartIndexZero: true,
  use24HourTimeFormat: true,
  throwExceptionOnParseError: true,
});

const helpers = [
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

const cronString = computed(() => {
  if (isCronValid(cron.value)) {
    return cronstrue.toString(cron.value, cronstrueConfig);
  }
  return ' ';
});

const cronValidation = useValidation({
  source: cron,
  rules: [
    {
      validator: (value) => isCronValid(value),
      message: 'This cron is invalid',
    },
  ],
});
</script>

<style lang="less" scoped>
.cron {
  text-align: center;

  margin: auto;
  max-width: 400px;
  display: block;

  .n-input {
    font-size: 30px;
    font-family: monospace;
    padding: 5px;
  }
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
</style>
