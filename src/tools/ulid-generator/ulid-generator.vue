<script setup lang="ts">
import { ulid } from 'ulid';
import _ from 'lodash';
import { computedRefreshable } from '@/composable/computedRefreshable';
import { useCopy } from '@/composable/copy';
import { useResilientStorage } from '@/composable/use-resilient-storage';
import CInputNumber from '@/ui/c-input-number/c-input-number.vue';

const amount = useResilientStorage('ulid-generator-amount', 1);
const formats = [{ label: 'Raw', value: 'raw' }, { label: 'JSON', value: 'json' }] as const;
const format = useResilientStorage<typeof formats[number]['value']>('ulid-generator-format', formats[0].value);

const [ulids, refreshUlids] = computedRefreshable(() => {
  const ids = _.times(amount.value, () => ulid());

  if (format.value === 'json') {
    return JSON.stringify(ids, null, 2);
  }

  return ids.join('\n');
}, { dependencies: [amount, format] });

const { copy } = useCopy({ source: ulids, text: 'ULIDs copied to the clipboard' });
</script>

<template>
  <div class="c-generator-layout">
    <c-card class="c-generator-options">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-field label="Quantity (1–100)" label-for="ulid-quantity">
          <CInputNumber
            id="ulid-quantity"
            v-model:value="amount"
            test-id="ulid-quantity"
            min="1"
            max="100"
            w-full
          />
        </c-field>

        <c-buttons-select
          v-model:value="format"
          :options="formats"
          label="Format"
          label-position="top"
        />
      </div>
    </c-card>

    <c-input-text
      class="c-generator-output"
      :value="ulids"
      aria-label="Generated ULIDs"
      placeholder="Your ULIDs"
      test-id="ulids"
      rows="12"
      readonly
      raw-text
      multiline
      monospace
    />

    <div class="c-generator-actions">
      <c-button type="primary" data-test-id="refresh" @click="refreshUlids()">
        Generate
      </c-button>
      <c-button data-test-id="ulid-copy" @click="copy()">
        Copy
      </c-button>
    </div>
  </div>
</template>
