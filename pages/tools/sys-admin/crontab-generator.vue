<template>
  <ToolWrapper :config="config()">
    <div class="result">
      {{ cronString }}
    </div>
    <v-text-field
      ref="cron"
      v-model="cron"
      class="cron-wrapper"
      outlined
      label="Cron"
      append-icon="fa-copy"
      :rules="[isCronValid]"
      hide-details="auto"
      @click:append="copy(cron)"
    />

    <v-checkbox
      v-model="cronstrueConfig.verbose"
      hide-details
      label="Verbose"
    />
    <v-checkbox
      v-model="cronstrueConfig.use24HourTimeFormat"
      hide-details
      label="Use 24 hour time format"
    />
    <v-checkbox
      v-model="cronstrueConfig.dayOfWeekStartIndexZero"
      hide-details
      label="Day of the week start a index 0"
    />

    <div class="text-center">
      <pre>
┌──────────── [optional] seconds (0 - 59)
| ┌────────── minute (0 - 59)
| | ┌──────── hour (0 - 23)
| | | ┌────── day of month (1 - 31)
| | | | ┌──── month (1 - 12) OR jan,feb,mar,apr ...
| | | | | ┌── day of week (0 - 6, sunday=0) OR sun,mon ...
| | | | | |
* * * * * * command</pre>
    </div>
    <br>
    <v-simple-table dense>
      <template #default>
        <thead>
          <tr>
            <th class="text-left">
              Symbol
            </th>
            <th class="text-left">
              Meaning
            </th>
            <th class="text-left">
              Example
            </th>
            <th class="text-left">
              Equivalent
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>*</td>
            <td>Any value</td>
            <td>
              <pre>* * * *</pre>
            </td>
            <td>Every minute</td>
          </tr>
          <tr>
            <td>-</td>
            <td>Range of values</td>
            <td>
              <pre>1-10 * * *</pre>
            </td>
            <td>Minutes 1 through 10</td>
          </tr>
          <tr>
            <td>,</td>
            <td>List of values</td>
            <td>
              <pre>1,10 * * *</pre>
            </td>
            <td>At minutes 1 and 10</td>
          </tr>
          <tr>
            <td>/</td>
            <td>Step values</td>
            <td>
              <pre>*/10 * * *</pre>
            </td>
            <td>Every 10 minutes</td>
          </tr>
          <tr>
            <td>@yearly</td>
            <td>Once every year at midnight of 1 January</td>
            <td>
              <pre>@yearly</pre>
            </td>
            <td>0 0 1 1 *</td>
          </tr>
          <tr>
            <td>@annually</td>
            <td>Same as @yearly</td>
            <td>
              <pre>@annually</pre>
            </td>
            <td>0 0 1 1 *</td>
          </tr>
          <tr>
            <td>@monthly</td>
            <td>Once a month at midnight on the first day</td>
            <td>
              <pre>@monthly</pre>
            </td>
            <td>0 0 1 * *</td>
          </tr>
          <tr>
            <td>@weekly</td>
            <td>Once a week at midnight on Sunday morning</td>
            <td>
              <pre>@weekly</pre>
            </td>
            <td>0 0 * * 0</td>
          </tr>
          <tr>
            <td>@daily</td>
            <td>Once a day at midnight</td>
            <td>
              <pre>@daily</pre>
            </td>
            <td>0 0 * * *</td>
          </tr>
          <tr>
            <td>@midnight</td>
            <td>Same as @daily</td>
            <td>
              <pre>@midnight</pre>
            </td>
            <td>0 0 * * *</td>
          </tr>
          <tr>
            <td>@hourly</td>
            <td>Once an hour at the beginning of the hour</td>
            <td>
              <pre>@hourly</pre>
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
      </template>
    </v-simple-table>
  </ToolWrapper>
</template>

<script lang="ts">
import {Component} from 'nuxt-property-decorator'
import cronstrue from 'cronstrue'
import {isValidCron} from 'cron-validator'
import {CopyableMixin} from '~/mixins/copyable.mixin'
import Tool from '~/components/Tool.vue'
import type {ToolConfig} from '~/types/ToolConfig'

@Component({
  mixins: [CopyableMixin]
})
export default class CrontabGenerator extends Tool {
  config(): ToolConfig {
    return {
      title: 'Crontab generator',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus distinctio dolor dolorum eaque eligendi, facilis impedit laboriosam odit placeat.',
      icon: 'mdi-calendar-clock',
      keywords: ['year', 'month', 'week', 'day', 'minute', 'second']
    }
  }

  cron = '* * * * *'
  cronstrueConfig = {
    verbose: true,
    dayOfWeekStartIndexZero: true,
    use24HourTimeFormat: true,
    throwExceptionOnParseError: true
  }

  isCronValid(v: string) {
    return isValidCron(v, {allowBlankDay: true, alias: true, seconds: true})
  }

  get cronString() {
    if (this.isCronValid(this.cron)) {
      return cronstrue.toString(this.cron, this.cronstrueConfig)
    } else {
      return ' '
    }
  }
}

</script>

<style scoped lang="less">
::v-deep {
  .cron-wrapper input {
    text-align: center;
    font-size: 22px;
    font-family: Consolas, monospace;
  }

  .v-data-table {
    background-color: transparent;
  }
}

.result {
  text-align: center;
  font-size: 18px;
  margin-bottom: 22px;
}

.text-center {
  pre {
    display: inline-block;
    text-align: left;
  }
}
</style>
