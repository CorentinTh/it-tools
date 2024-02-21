<script setup lang="ts">
import cronstrue from 'cronstrue';
import 'cronstrue/locales/zh_CN';
import 'cronstrue/locales/fr';
import { isValidCron } from 'cron-validator';
import { useStyleStore } from '@/stores/style.store';

function isCronValid(v: string) {
  return isValidCron(v, { allowBlankDay: true, alias: true, seconds: true });
}

const styleStore = useStyleStore();

const { t, locale } = useI18n();
const cron = ref('40 * * * *');
const cronstrueConfig = reactive({
  verbose: true,
  dayOfWeekStartIndexZero: true,
  use24HourTimeFormat: true,
  throwExceptionOnParseError: true,
  locale: locale.value === 'zh' ? 'zh_CN' : locale,
});

const helpers = [
  {
    symbol: '*',
    meaning: t('tools.crontab-generator.anyMeaning'),
    example: '* * * *',
    equivalent: t('tools.crontab-generator.anyExample'),
  },
  {
    symbol: '-',
    meaning: t('tools.crontab-generator.rangeMeaning'),
    example: '1-10 * * *',
    equivalent: t('tools.crontab-generator.rangeExample'),
  },
  {
    symbol: ',',
    meaning: t('tools.crontab-generator.listMeaning'),
    example: '1,10 * * *',
    equivalent: t('tools.crontab-generator.listExample'),
  },
  {
    symbol: '/',
    meaning: t('tools.crontab-generator.stepMeaning'),
    example: '*/10 * * *',
    equivalent: t('tools.crontab-generator.stepExample'),
  },
  {
    symbol: '@yearly',
    meaning: t('tools.crontab-generator.yearlyMeaning'),
    example: '@yearly',
    equivalent: '0 0 1 1 *',
  },
  {
    symbol: '@annually',
    meaning: t('tools.crontab-generator.annuallyMeaning', { yearly: '@yearly' }),
    example: '@annually',
    equivalent: '0 0 1 1 *',
  },
  {
    symbol: '@monthly',
    meaning: t('tools.crontab-generator.monthlyMeaning'),
    example: '@monthly',
    equivalent: '0 0 1 * *',
  },
  {
    symbol: '@weekly',
    meaning: t('tools.crontab-generator.weeklyMeaning'),
    example: '@weekly',
    equivalent: '0 0 * * 0',
  },
  {
    symbol: '@daily',
    meaning: t('tools.crontab-generator.dailyMeaning'),
    example: '@daily',
    equivalent: '0 0 * * *',
  },
  {
    symbol: '@midnight',
    meaning: t('tools.crontab-generator.midnightMeaning', { daily: '@daily' }),
    example: '@midnight',
    equivalent: '0 0 * * *',
  },
  {
    symbol: '@hourly',
    meaning: t('tools.crontab-generator.hourlyMeaning'),
    example: '@hourly',
    equivalent: '0 * * * *',
  },
  {
    symbol: '@reboot',
    meaning: t('tools.crontab-generator.rebootMeaning'),
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

const cronValidationRules = [
  {
    validator: (value: string) => isCronValid(value),
    message: t('tools.crontab-generator.invalidMessage'),
  },
];
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

    <div class="cron-string">
      {{ cronString }}
    </div>

    <n-divider />

    <div flex justify-center>
      <n-form :show-feedback="false" label-width="170" label-placement="left">
        <n-form-item :label="t('tools.crontab-generator.verbose')">
          <n-switch v-model:value="cronstrueConfig.verbose" />
        </n-form-item>
        <n-form-item :label="t('tools.crontab-generator.use24HourTimeFormat')">
          <n-switch v-model:value="cronstrueConfig.use24HourTimeFormat" />
        </n-form-item>
        <n-form-item :label="t('tools.crontab-generator.dayOfWeekStartIndexZero')">
          <n-switch v-model:value="cronstrueConfig.dayOfWeekStartIndexZero" />
        </n-form-item>
      </n-form>
    </div>
  </c-card>
  <c-card>
    <pre>
┌──────────── {{ t('tools.crontab-generator.secondDesc') }}
| ┌────────── {{ t('tools.crontab-generator.minuteDesc') }}
| | ┌──────── {{ t('tools.crontab-generator.hourDesc') }}
| | | ┌────── {{ t('tools.crontab-generator.dayOfMonthDesc') }}
| | | | ┌──── {{ t('tools.crontab-generator.monthDesc') }}
| | | | | ┌── {{ t('tools.crontab-generator.dayOfWeekDesc') }}
| | | | | |
* * * * * * {{ t('tools.crontab-generator.command') }}</pre>

    <div v-if="styleStore.isSmallScreen">
      <c-card v-for="{ symbol, meaning, example, equivalent } in helpers" :key="symbol" mb-3 important:border-none>
        <div>
          {{ t('tools.crontab-generator.symbol') }} <strong>{{ symbol }}</strong>
        </div>
        <div>
          {{ t('tools.crontab-generator.meaning') }} <strong>{{ meaning }}</strong>
        </div>
        <div>
          {{ t('tools.crontab-generator.example') }}
          <strong><code>{{ example }}</code></strong>
        </div>
        <div>
          {{ t('tools.crontab-generator.equivalent') }} <strong>{{ equivalent }}</strong>
        </div>
      </c-card>
    </div>

    <c-table v-else :data="helpers" />
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
</style>
