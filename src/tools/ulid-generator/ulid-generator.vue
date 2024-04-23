<script setup lang="ts">
import { ulid } from 'ulid';
import _ from 'lodash';
import { computedRefreshable } from '@/composable/computedRefreshable';
import { useCopy } from '@/composable/copy';

const { t } = useI18n();
const amount = useStorage('ulid-generator-amount', 1);
const formats = [{ label: 'Raw', value: 'raw' }, { label: 'JSON', value: 'json' }] as const;
const format = useStorage<typeof formats[number]['value']>('ulid-generator-format', formats[0].value);

const [ulids, refreshUlids] = computedRefreshable(() => {
  const ids = _.times(amount.value, () => ulid());

  if (format.value === 'json') {
    return JSON.stringify(ids, null, 2);
  }

  return ids.join('\n');
});

const { copy } = useCopy({ source: ulids, text: t('ulid-generator.copied') });
</script>

<template>
  <div flex flex-col justify-center gap-2>
    <div flex items-center>
      <label w-75px> {{ $t('ulid-generator.quantity') }}:</label>
      <n-input-number v-model:value="amount" min="1" max="100" flex-1 />
    </div>

    <c-buttons-select v-model:value="format" :options="formats" :label="$t('ulid-generator.format')" label-width="75px" />

    <c-card mt-5 flex data-test-id="ulids">
      <pre m-0 m-x-auto>{{ ulids }}</pre>
    </c-card>

    <div flex justify-center gap-2>
      <c-button data-test-id="refresh" @click="refreshUlids()">
        {{ $t('ulid-generator.button.refresh') }}
      </c-button>
      <c-button @click="copy()">
        {{ $t('ulid-generator.button.copy') }}
      </c-button>
    </div>
  </div>
</template>
