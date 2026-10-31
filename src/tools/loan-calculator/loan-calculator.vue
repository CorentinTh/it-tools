<script setup lang="ts">
const loanAmount = ref();
const annualRate = ref();
const durationMonths = ref();

const monthlyPayment = computed(() => {
  if (loanAmount.value === undefined || annualRate.value === undefined || durationMonths.value === undefined) {
    return '';
  }

  const principal = loanAmount.value;
  const months = durationMonths.value;
  const monthlyRate = annualRate.value / 100 / 12;

  if (principal <= 0 || months <= 0 || annualRate.value < 0) {
    return '';
  }

  let emi: number;
  if (monthlyRate === 0) {
    emi = principal / months;
  }
  else {
    const factor = (1 + monthlyRate) ** months;
    emi = principal * monthlyRate * factor / (factor - 1);
  }

  return (!Number.isFinite(emi) || Number.isNaN(emi)) ? '' : emi.toFixed(2);
});

const totalPayment = computed(() => {
  if (monthlyPayment.value === '' || durationMonths.value === undefined) {
    return '';
  }

  const total = Number(monthlyPayment.value) * durationMonths.value;
  return (!Number.isFinite(total) || Number.isNaN(total)) ? '' : total.toFixed(2);
});

const totalInterest = computed(() => {
  if (totalPayment.value === '' || loanAmount.value === undefined) {
    return '';
  }

  const interest = Number(totalPayment.value) - loanAmount.value;
  return (!Number.isFinite(interest) || Number.isNaN(interest)) ? '' : interest.toFixed(2);
});
</script>

<template>
  <div style="flex: 0 0 100%">
    <div style="margin: 0 auto; max-width: 600px">
      <c-card mb-3>
        <div mb-3>
          Loan details
        </div>
        <div flex flex-col gap-2>
          <n-input-number v-model:value="loanAmount" data-test-id="loanAmount" placeholder="Loan amount" :min="0" />
          <n-input-number v-model:value="annualRate" data-test-id="annualRate" placeholder="Annual interest rate (%)" :min="0" />
          <n-input-number v-model:value="durationMonths" data-test-id="durationMonths" placeholder="Duration (months)" :min="1" />
        </div>
      </c-card>

      <c-card mb-3>
        <div mb-3>
          Results
        </div>
        <div flex flex-col gap-2>
          <input-copyable v-model:value="monthlyPayment" data-test-id="monthlyPayment" readonly placeholder="Monthly payment (EMI)" />
          <input-copyable v-model:value="totalPayment" data-test-id="totalPayment" readonly placeholder="Total payment" />
          <input-copyable v-model:value="totalInterest" data-test-id="totalInterest" readonly placeholder="Total interest" />
        </div>
      </c-card>
    </div>
  </div>
</template>
