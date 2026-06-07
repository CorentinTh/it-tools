<script setup lang="ts">
const billAmount = ref<number>();
const tipPercentage = ref<number>(15);
const numberOfPeople = ref<number>(1);

const tipAmount = computed(() => (billAmount.value && tipPercentage.value) ? (billAmount.value * tipPercentage.value) / 100 : 0);
const totalAmount = computed(() => billAmount.value ? billAmount.value + tipAmount.value : 0);
const amountPerPerson = computed(() => (totalAmount.value && numberOfPeople.value && numberOfPeople.value > 0) ? totalAmount.value / numberOfPeople.value : 0);

const formatNum = (v: number) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);

const results = computed(() => [
  { label: 'Tip Amount', val: formatNum(tipAmount.value), id: 'tipAmountResult' },
  { label: 'Total Bill', val: formatNum(totalAmount.value), id: 'totalBillResult' },
  { label: 'Amount Per Person', val: formatNum(amountPerPerson.value), id: 'amountPerPersonResult', isBold: true },
]);
</script>

<template>
  <div style="flex: 0 0 100%">
    <div style="margin: 0 auto; max-width: 600px">
      <c-card mb-3>
        <div mb-3>
          Bill details
        </div>
        <div flex flex-col gap-4>
          <div flex items-center gap-2>
            <div style="min-width: 120px;">
              Bill Amount
            </div>
            <div style="flex: 1" data-test-id="billAmount">
              <n-input-number v-model:value="billAmount" :min="0" placeholder="Total Bill" />
            </div>
          </div>
          <div flex items-center gap-2>
            <div style="min-width: 120px;">
              Tip Percentage
            </div>
            <div style="flex: 1" data-test-id="tipPercentage">
              <n-input-number v-model:value="tipPercentage" :min="0" placeholder="Tip %">
                <template #suffix>
                  %
                </template>
              </n-input-number>
            </div>
          </div>
          <div flex items-center gap-2>
            <div style="min-width: 120px;">
              Number of People
            </div>
            <div style="flex: 1" data-test-id="numberOfPeople">
              <n-input-number v-model:value="numberOfPeople" :min="1" placeholder="People" />
            </div>
          </div>
        </div>
      </c-card>

      <c-card mb-3>
        <div mb-3>
          Results
        </div>
        <div flex flex-col gap-3>
          <div v-for="res in results" :key="res.id" flex items-center justify-between :class="{ 'border-t pt-3 font-bold': res.isBold }">
            <span>{{ res.label }}:</span>
            <div :data-test-id="res.id" style="max-width: 200px; width: 100%;">
              <input-copyable :value="res.val" readonly />
            </div>
          </div>
        </div>
      </c-card>

      <c-card>
        <div mb-2>
          Quick Tip %
        </div>
        <div flex gap-2>
          <n-button v-for="tip in [10, 15, 18, 20, 25]" :key="tip" size="small" @click="tipPercentage = tip">
            {{ tip }}%
          </n-button>
        </div>
      </c-card>
    </div>
  </div>
</template>
