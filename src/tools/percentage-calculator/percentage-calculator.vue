<script setup lang="ts">
import CInputNumber from '@/ui/c-input-number/c-input-number.vue';

const percentageX = ref();
const percentageY = ref();
const percentageResult = computed(() => {
  if (percentageX.value === undefined || percentageY.value === undefined) {
    return '';
  }
  return (percentageX.value / 100 * percentageY.value).toString();
});

const numberX = ref();
const numberY = ref();
const numberResult = computed(() => {
  if (numberX.value === undefined || numberY.value === undefined) {
    return '';
  }
  const result = 100 * numberX.value / numberY.value;
  return (!Number.isFinite(result) || Number.isNaN(result)) ? '' : result.toString();
});

const numberFrom = ref();
const numberTo = ref();
const percentageIncreaseDecrease = computed(() => {
  if (numberFrom.value === undefined || numberTo.value === undefined) {
    return '';
  }
  const result = (numberTo.value - numberFrom.value) / numberFrom.value * 100;
  return (!Number.isFinite(result) || Number.isNaN(result)) ? '' : result.toString();
});
</script>

<template>
  <div class="c-form-layout">
    <c-card title="Percentage of a number">
      <div grid grid-cols-1 gap-3 sm:grid-cols-3>
        <c-field label="Percentage (%)" label-for="percentage-x">
          <CInputNumber
            id="percentage-x"
            v-model:value="percentageX"
            test-id="percentageX"
            placeholder="Percentage"
            w-full
          />
        </c-field>
        <c-field label="Number" label-for="percentage-y">
          <CInputNumber
            id="percentage-y"
            v-model:value="percentageY"
            test-id="percentageY"
            placeholder="Number"
            w-full
          />
        </c-field>
        <c-field label="Result" label-for="percentage-result">
          <input-copyable
            id="percentage-result"
            v-model:value="percentageResult"
            data-test-id="percentageResult"
            readonly
            placeholder="Result"
            w-full
          />
        </c-field>
      </div>
    </c-card>

    <c-card title="Percentage ratio">
      <div grid grid-cols-1 gap-3 sm:grid-cols-3>
        <c-field label="Part" label-for="number-x">
          <CInputNumber
            id="number-x"
            v-model:value="numberX"
            test-id="numberX"
            placeholder="Part"
            w-full
          />
        </c-field>
        <c-field label="Total" label-for="number-y">
          <CInputNumber
            id="number-y"
            v-model:value="numberY"
            test-id="numberY"
            placeholder="Total"
            w-full
          />
        </c-field>
        <c-field label="Result (%)" label-for="number-result">
          <input-copyable
            id="number-result"
            v-model:value="numberResult"
            data-test-id="numberResult"
            readonly
            placeholder="Result"
            w-full
          />
        </c-field>
      </div>
    </c-card>

    <c-card title="Percentage change">
      <div grid grid-cols-1 gap-3 sm:grid-cols-3>
        <c-field label="From" label-for="number-from">
          <CInputNumber
            id="number-from"
            v-model:value="numberFrom"
            test-id="numberFrom"
            placeholder="From"
            w-full
          />
        </c-field>
        <c-field label="To" label-for="number-to">
          <CInputNumber
            id="number-to"
            v-model:value="numberTo"
            test-id="numberTo"
            placeholder="To"
            w-full
          />
        </c-field>
        <c-field label="Change (%)" label-for="percentage-change">
          <input-copyable
            id="percentage-change"
            v-model:value="percentageIncreaseDecrease"
            data-test-id="percentageIncreaseDecrease"
            readonly
            placeholder="Result"
            w-full
          />
        </c-field>
      </div>
    </c-card>
  </div>
</template>
