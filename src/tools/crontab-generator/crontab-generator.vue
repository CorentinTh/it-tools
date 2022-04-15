<template>
  <n-card>
    <n-form-item
      class="cron"
      :show-label="false"
      :feedback="cronValidation.message"
      :validation-status="cronValidation.status"
    >
      <n-input
        v-model:value="cron"
        size="large"
        placeholder="* * * * *"
      />
    </n-form-item>
    <div class="cron-string">
      {{ cronString }}
    </div>

    <n-divider />

    <n-space justify="center">
      <n-form
        :show-feedback="false"
        label-width="170"
        label-placement="left"
      >
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
  </n-card>
  <br>
  <n-card>
    <pre>
┌──────────── [optional] seconds (0 - 59)
| ┌────────── minute (0 - 59)
| | ┌──────── hour (0 - 23)
| | | ┌────── day of month (1 - 31)
| | | | ┌──── month (1 - 12) OR jan,feb,mar,apr ...
| | | | | ┌── day of week (0 - 6, sunday=0) OR sun,mon ...
| | | | | |
* * * * * * command</pre>


    <n-table size="small">
      <thead>
        <tr>
          <th
            class="text-left"
            scope="col"
          >
            Symbol
          </th>
          <th
            class="text-left"
            scope="col"
          >
            Meaning
          </th>
          <th
            class="text-left"
            scope="col"
          >
            Example
          </th>
          <th
            class="text-left"
            scope="col"
          >
            Equivalent
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>*</td>
          <td>Any value</td>
          <td>
            <code>* * * *</code>
          </td>
          <td>Every minute</td>
        </tr>
        <tr>
          <td>-</td>
          <td>Range of values</td>
          <td>
            <code>1-10 * * *</code>
          </td>
          <td>Minutes 1 through 10</td>
        </tr>
        <tr>
          <td>,</td>
          <td>List of values</td>
          <td>
            <code>1,10 * * *</code>
          </td>
          <td>At minutes 1 and 10</td>
        </tr>
        <tr>
          <td>/</td>
          <td>Step values</td>
          <td>
            <code>*/10 * * *</code>
          </td>
          <td>Every 10 minutes</td>
        </tr>
        <tr>
          <td>@yearly</td>
          <td>Once every year at midnight of 1 January</td>
          <td>
            <code>@yearly</code>
          </td>
          <td>0 0 1 1 *</td>
        </tr>
        <tr>
          <td>@annually</td>
          <td>Same as @yearly</td>
          <td>
            <code>@annually</code>
          </td>
          <td>0 0 1 1 *</td>
        </tr>
        <tr>
          <td>@monthly</td>
          <td>Once a month at midnight on the first day</td>
          <td>
            <code>@monthly</code>
          </td>
          <td>0 0 1 * *</td>
        </tr>
        <tr>
          <td>@weekly</td>
          <td>Once a week at midnight on Sunday morning</td>
          <td>
            <code>@weekly</code>
          </td>
          <td>0 0 * * 0</td>
        </tr>
        <tr>
          <td>@daily</td>
          <td>Once a day at midnight</td>
          <td>
            <code>@daily</code>
          </td>
          <td>0 0 * * *</td>
        </tr>
        <tr>
          <td>@midnight</td>
          <td>Same as @daily</td>
          <td>
            <code>@midnight</code>
          </td>
          <td>0 0 * * *</td>
        </tr>
        <tr>
          <td>@hourly</td>
          <td>Once an hour at the beginning of the hour</td>
          <td>
            <code>@hourly</code>
          </td>
          <td>0 * * * *</td>
        </tr>
        <tr>
          <td>@reboot</td>
          <td>Run at startup</td>
          <td />
          <td />
        </tr>
      </tbody>
    </n-table>
  </n-card>
</template>

<script setup lang="ts">
import cronstrue from 'cronstrue'
import { isValidCron } from 'cron-validator'
import { computed, reactive, ref } from 'vue';
import { useValidation } from '@/composable/validation';


function isCronValid(v: string) {
  return isValidCron(v, { allowBlankDay: true, alias: true, seconds: true })
}

const cron = ref('40 * * * *')
const cronstrueConfig = reactive({
  verbose: true,
  dayOfWeekStartIndexZero: true,
  use24HourTimeFormat: true,
  throwExceptionOnParseError: true
})

const cronString = computed(() => {
  if (isCronValid(cron.value)) {
    return cronstrue.toString(cron.value, cronstrueConfig)
  }
  return ' '
})

const cronValidation = useValidation({
  source: cron,
  rules: [{
    validator: (value) => isCronValid(value),
    message: 'This cron is invalid'
  }]
})
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
</style>