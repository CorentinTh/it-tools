<script setup lang="ts">
import { DATA_UNITS, convertDataUnit, estimateTransferSeconds, formatDuration } from './data-units-converter.service';

const options = DATA_UNITS.map(unit => ({ label: unit.label, value: unit.id }));
const amount = ref('1');
const sourceUnit = ref('GB');
const targetUnit = ref('GiB');
const conversion = computed(() => {
  try {
    return { result: convertDataUnit(amount.value, sourceUnit.value, targetUnit.value), error: '' };
  }
  catch (error) {
    return { result: undefined, error: error instanceof Error ? error.message : 'Conversion failed.' };
  }
});
const size = ref('1');
const sizeUnit = ref('GB');
const rate = ref('100');
const rateUnit = ref('Mbit');
const transfer = computed(() => {
  try {
    return { result: estimateTransferSeconds(size.value, sizeUnit.value, rate.value, rateUnit.value), error: '' };
  }
  catch (error) {
    return { result: undefined, error: error instanceof Error ? error.message : 'Transfer estimate failed.' };
  }
});
</script>

<template>
  <div class="c-form-layout">
    <c-alert title="Exact unit semantics">
      SI units use powers of 1000; IEC units use powers of 1024. Lowercase “bit” and uppercase “B” are deliberately distinct. Calculations use exact integer fractions, not floating-point arithmetic.
    </c-alert>
    <c-card title="Convert storage or rate units">
      <div grid grid-cols-1 gap-3 md:grid-cols-3>
        <c-input-text v-model:value="amount" label="Value" inputmode="decimal" raw-text />
        <c-select v-model:value="sourceUnit" label="From unit" :options="options" searchable />
        <c-select v-model:value="targetUnit" label="To unit" :options="options" searchable />
      </div>
      <c-alert v-if="conversion.error" title="Invalid conversion" mt-3>
        {{ conversion.error }}
      </c-alert>
      <c-input-text v-else :value="conversion.result?.value ?? ''" label="Converted value" data-test-id="data-unit-result" raw-text readonly monospace mt-3 />
      <p v-if="conversion.result && !conversion.result.exact" mt-2 text-sm op-70>
        Repeating decimal; exact fraction: {{ conversion.result.fraction }}
      </p>
    </c-card>
    <c-card title="Transfer time estimate">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-input-text v-model:value="size" label="Data size" inputmode="decimal" raw-text />
        <c-select v-model:value="sizeUnit" label="Size unit" :options="options" searchable />
        <c-input-text v-model:value="rate" label="Transfer rate" inputmode="decimal" raw-text />
        <c-select v-model:value="rateUnit" label="Rate unit per second" :options="options" searchable />
      </div>
      <c-alert v-if="transfer.error" title="Invalid transfer estimate" mt-3>
        {{ transfer.error }}
      </c-alert>
      <template v-else-if="transfer.result">
        <c-input-text :value="`${transfer.result.value} seconds`" label="Exact/decimal time" data-test-id="transfer-seconds" raw-text monospace readonly mt-3 />
        <p mt-2>
          <strong>Human duration:</strong> {{ formatDuration(transfer.result.value) }}
        </p>
        <p v-if="!transfer.result.exact" mt-2 text-sm op-70>
          Rounded display; exact fraction: {{ transfer.result.fraction }} seconds.
        </p>
      </template>
    </c-card>
  </div>
</template>
