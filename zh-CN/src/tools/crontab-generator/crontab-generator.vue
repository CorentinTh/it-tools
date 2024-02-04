<script setup lang="ts">
import cronstrue from 'cronstrue';
import 'cronstrue/locales/zh_CN';
import { isValidCron } from 'cron-validator';
import { useStyleStore } from '@/stores/style.store';

function isCronValid(v: string) {
  return isValidCron(v, { allowBlankDay: true, alias: true, seconds: true });
}

const styleStore = useStyleStore();

const cron = ref('40 * * * *');
const cronstrueConfig = reactive({
  locale: 'zh_CN',
  verbose: true,
  dayOfWeekStartIndexZero: true,
  use24HourTimeFormat: true,
  throwExceptionOnParseError: true,
});

const helpers = [
  {
    符号: '*',
    含义: '任意值',
    示例: '* * * *',
    等效于: '每分钟',
  },
  {
    符号: '-',
    含义: '数值范围',
    示例: '1-10 * * *',
    等效于: '第1分钟 到 第10分钟',
  },
  {
    符号: ',',
    含义: '数值列表',
    示例: '1,10 * * *',
    等效于: '第1分钟 和 第10分钟',
  },
  {
    符号: '/',
    含义: '步进值',
    示例: '*/10 * * *',
    等效于: '每10分钟',
  },
  {
    符号: '@yearly',
    含义: '每年1月1日0点',
    示例: '@yearly',
    等效于: '0 0 1 1 *',
  },
  {
    符号: '@annually',
    含义: '与 @yearly 相同',
    示例: '@annually',
    等效于: '0 0 1 1 *',
  },
  {
    符号: '@monthly',
    含义: '每月1日0点',
    示例: '@monthly',
    等效于: '0 0 1 * *',
  },
  {
    符号: '@weekly',
    含义: '每周日0点',
    示例: '@weekly',
    等效于: '0 0 * * 0',
  },
  {
    符号: '@daily',
    含义: '每天0点',
    示例: '@daily',
    等效于: '0 0 * * *',
  },
  {
    符号: '@midnight',
    含义: '与 @daily 相同',
    示例: '@midnight',
    等效于: '0 0 * * *',
  },
  {
    符号: '@hourly',
    含义: '每小时',
    示例: '@hourly',
    等效于: '0 * * * *',
  },
  {
    符号: '@reboot',
    含义: '启动时运行',
    示例: '',
    等效于: '',
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
    message: '该计划任务无效',
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
        <n-form-item label="详细描述">
          <n-switch v-model:value="cronstrueConfig.verbose" />
        </n-form-item>
        <n-form-item label="24小时制">
          <n-switch v-model:value="cronstrueConfig.use24HourTimeFormat" />
        </n-form-item>
        <!-- <n-form-item label="每周从0开始">
          <n-switch v-model:value="cronstrueConfig.dayOfWeekStartIndexZero" />
        </n-form-item> -->
      </n-form>
    </div>
  </c-card>
  <c-card>
    <pre>
  ┌─────── [可选] 秒钟 (0 - 59)
  | ┌────── 分钟 (0 - 59)
  | | ┌───── 小时 (0 - 23)
  | | | ┌──── 日 (1 - 31)
  | | | | ┌─── 月 (1 - 12) 或者 jan,feb ...
  | | | | | ┌── 周 (0 - 6, 周日=0) 或者 sun,mon ...
  | | | | | |
  * * * * * * command</pre>

    <div v-if="styleStore.isSmallScreen">
      <c-card v-for="{ 符号, 含义, 示例, 等效于 } in helpers" :key="符号" mb-3 important:border-none>
        <div>
          符号: <strong>{{ 符号 }}</strong>
        </div>
        <div>
          含义: <strong>{{ 含义 }}</strong>
        </div>
        <div>
          示例:
          <strong><code>{{ 示例 }}</code></strong>
        </div>
        <div>
          等效于: <strong>{{ 等效于 }}</strong>
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
