<script setup lang="ts">
import { addDays, differenceInCalendarDays, format, isValid } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

const DAY_MS = 24 * 60 * 60 * 1000;

// 今天 0 点的时间戳（去掉时分秒，避免日期计算受时分影响）
function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

// 功能一：推算几天前 / 后的日期
const offsetBaseDate = ref<number>(startOfToday());
const offsetDays = ref(30);

// 功能二：计算两个日期相差的天数
const diffStartDate = ref<number>(startOfToday());
const diffTargetDate = ref<number>(startOfToday() + 30 * DAY_MS);

// 按当前语言选择 date-fns 的 locale 与日期格式
const dateLocale = computed(() => (locale.value?.startsWith('zh') ? zhCN : enUS));
const datePattern = computed(() =>
  locale.value?.startsWith('zh') ? 'yyyy年M月d日 EEEE' : 'EEEE, MMMM d, yyyy',
);

const offsetResultDate = computed(() => {
  if (offsetBaseDate.value == null || !Number.isFinite(offsetDays.value)) {
    return null;
  }
  const base = new Date(offsetBaseDate.value);
  return isValid(base) ? addDays(base, offsetDays.value) : null;
});

const offsetResultText = computed(() => {
  const date = offsetResultDate.value;
  if (!date || !isValid(date)) {
    return '';
  }
  return format(date, datePattern.value, { locale: dateLocale.value });
});

const diffDays = computed(() => {
  if (diffStartDate.value == null || diffTargetDate.value == null) {
    return null;
  }
  const start = new Date(diffStartDate.value);
  const target = new Date(diffTargetDate.value);
  if (!isValid(start) || !isValid(target)) {
    return null;
  }
  return differenceInCalendarDays(target, start);
});

const absDiffDays = computed(() => (diffDays.value === null ? null : Math.abs(diffDays.value)));
</script>

<template>
  <div style="flex: 0 0 100%">
    <div style="margin: 0 auto; max-width: 620px">
      <!-- 功能一：推算几天前 / 后的日期 -->
      <c-card mb-4 :title="t('tools.date-calculator.offset.sectionTitle')">
        <n-form-item :label="t('tools.date-calculator.offset.baseDate')" :show-feedback="false">
          <n-date-picker v-model:value="offsetBaseDate" type="date" />
        </n-form-item>

        <n-form-item
          mt-4
          :label="t('tools.date-calculator.offset.days')"
          :show-feedback="false"
        >
          <div w-full flex items-center gap-3>
            <n-input-number v-model:value="offsetDays" />
            <span whitespace-nowrap text-sm op-60>
              {{ t('tools.date-calculator.offset.daysHint') }}
            </span>
          </div>
        </n-form-item>

        <n-divider />

        <div flex justify-center>
          <n-statistic :label="t('tools.date-calculator.offset.resultLabel')">
            {{ offsetResultText || '—' }}
          </n-statistic>
        </div>
      </c-card>

      <!-- 功能二：计算两个日期相差的天数 -->
      <c-card :title="t('tools.date-calculator.diff.sectionTitle')">
        <n-form-item :label="t('tools.date-calculator.diff.startDate')" :show-feedback="false">
          <n-date-picker v-model:value="diffStartDate" type="date" />
        </n-form-item>

        <n-form-item
          mt-4
          :label="t('tools.date-calculator.diff.targetDate')"
          :show-feedback="false"
        >
          <n-date-picker v-model:value="diffTargetDate" type="date" />
        </n-form-item>

        <n-divider />

        <div flex flex-col items-center gap-2>
          <n-statistic :label="t('tools.date-calculator.diff.resultLabel')">
            <span>{{ absDiffDays === null ? '—' : absDiffDays }}</span>
            <span text-sm font-normal op-70>
              {{ t('tools.date-calculator.diff.dayUnit') }}
            </span>
          </n-statistic>
          <div text-sm op-60>
            <span v-if="diffDays === null || diffDays === 0">
              {{ t('tools.date-calculator.diff.directionSame') }}
            </span>
            <span v-else-if="diffDays > 0">
              {{ t('tools.date-calculator.diff.directionAfter') }}
            </span>
            <span v-else>
              {{ t('tools.date-calculator.diff.directionBefore') }}
            </span>
          </div>
        </div>
      </c-card>
    </div>
  </div>
</template>

<style lang="less" scoped>
.n-date-picker,
.n-input-number {
  width: 100%;
}

.n-input-number {
  max-width: 220px;
}
</style>
