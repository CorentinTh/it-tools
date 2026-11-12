<script setup lang="ts">
import {
  computeIsWhatPercentOf,
  computePercentageIncreaseDecrease,
  computePercentageOf,
} from './percentage-calculator.service';

const percentageX = ref();
const percentageY = ref();
const percentageResult = computed(() => computePercentageOf(percentageX.value, percentageY.value));

const numberX = ref();
const numberY = ref();
const numberResult = computed(() => computeIsWhatPercentOf(numberX.value, numberY.value));

const numberFrom = ref();
const numberTo = ref();
const percentageIncreaseDecrease = computed(() =>
  computePercentageIncreaseDecrease(numberFrom.value, numberTo.value),
);
</script>

<template>
  <div style="flex: 0 0 100%">
    <div style="margin: 0 auto; max-width: 600px">
      <c-card mb-3>
        <div mb-3 sm:hidden>
          What is
        </div>
        <div flex gap-2>
          <div hidden pt-1 sm:block style="min-width: 48px;">
            What is
          </div>
          <n-input-number v-model:value="percentageX" data-test-id="percentageX" placeholder="X" />
          <div min-w-fit pt-1>
            % of
          </div>
          <n-input-number v-model:value="percentageY" data-test-id="percentageY" placeholder="Y" />
          <input-copyable v-model:value="percentageResult" data-test-id="percentageResult" readonly placeholder="Result" style="max-width: 150px;" />
        </div>
      </c-card>

      <c-card mb-3>
        <div mb-3 sm:hidden>
          X is what percent of Y
        </div>
        <div flex gap-2>
          <n-input-number v-model:value="numberX" data-test-id="numberX" placeholder="X" />
          <div hidden min-w-fit pt-1 sm:block>
            is what percent of
          </div>
          <n-input-number v-model:value="numberY" data-test-id="numberY" placeholder="Y" />
          <input-copyable v-model:value="numberResult" data-test-id="numberResult" readonly placeholder="Result" style="max-width: 150px;" />
        </div>
      </c-card>

      <c-card mb-3>
        <div mb-3>
          What is the percentage increase/decrease
        </div>
        <div flex gap-2>
          <n-input-number v-model:value="numberFrom" data-test-id="numberFrom" placeholder="From" />
          <n-input-number v-model:value="numberTo" data-test-id="numberTo" placeholder="To" />
          <input-copyable v-model:value="percentageIncreaseDecrease" data-test-id="percentageIncreaseDecrease" readonly placeholder="Result" style="max-width: 150px;" />
        </div>
      </c-card>
    </div>
  </div>
</template>
