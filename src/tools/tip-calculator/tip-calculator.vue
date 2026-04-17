<script setup lang="ts">
const billAmount = ref<number>();
const tipPercentage = ref<number>(15);
const numberOfPeople = ref<number>(1);

const tipAmount = computed(() => {
  if (billAmount.value === undefined || tipPercentage.value === undefined) {
    return 0;
  }
  return (billAmount.value * tipPercentage.value) / 100;
});

const totalAmount = computed(() => {
  if (billAmount.value === undefined) {
    return 0;
  }
  return billAmount.value + tipAmount.value;
});

const amountPerPerson = computed(() => {
  if (totalAmount.value === 0 || numberOfPeople.value === undefined || numberOfPeople.value <= 0) {
    return 0;
  }
  return totalAmount.value / numberOfPeople.value;
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

const tipAmountFormatted = computed(() => formatCurrency(tipAmount.value));
const totalAmountFormatted = computed(() => formatCurrency(totalAmount.value));
const amountPerPersonFormatted = computed(() => formatCurrency(amountPerPerson.value));
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
            <div style="min-width: 120px;">Bill Amount</div>
            <n-input-number v-model:value="billAmount" :min="0" placeholder="Total Bill" style="flex: 1">
              <template #prefix>$</template>
            </n-input-number>
          </div>
          
          <div flex items-center gap-2>
            <div style="min-width: 120px;">Tip Percentage</div>
            <n-input-number v-model:value="tipPercentage" :min="0" placeholder="Tip %" style="flex: 1">
              <template #suffix>%</template>
            </n-input-number>
          </div>

          <div flex items-center gap-2>
            <div style="min-width: 120px;">Number of People</div>
            <n-input-number v-model:value="numberOfPeople" :min="1" placeholder="People" style="flex: 1" />
          </div>
        </div>
      </c-card>

      <c-card mb-3>
        <div mb-3>Results</div>
        <div flex flex-col gap-3>
          <div flex justify-between items-center>
            <span>Tip Amount:</span>
            <input-copyable :value="tipAmountFormatted" readonly style="max-width: 200px;" />
          </div>
          <div flex justify-between items-center>
            <span>Total Bill:</span>
            <input-copyable :value="totalAmountFormatted" readonly style="max-width: 200px;" />
          </div>
          <div border-t pt-3 flex justify-between items-center font-bold>
            <span>Amount Per Person:</span>
            <input-copyable :value="amountPerPersonFormatted" readonly style="max-width: 200px;" />
          </div>
        </div>
      </c-card>

      <c-card>
        <div mb-2>Quick Tip %</div>
        <div flex gap-2>
          <n-button v-for="tip in [10, 15, 18, 20, 25]" :key="tip" @click="tipPercentage = tip" size="small">
            {{ tip }}%
          </n-button>
        </div>
      </c-card>
    </div>
  </div>
</template>
