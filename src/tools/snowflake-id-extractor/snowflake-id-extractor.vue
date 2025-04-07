<script setup lang="ts">
import { extractId, extractMachineId, extractTimestamp } from './snowflake-id-extractor.service';

const inputId = ref('1263785187301658678');
const inputEpoch = ref('');

const inputProps = {
  'labelPosition': 'left',
  'labelWidth': '170px',
  'labelAlign': 'right',
  'readonly': true,
  'mb-2': '',
} as const;
</script>

<template>
  <div>
    <c-card>
      <c-input-text v-model:value="inputId" label="Snowflake ID" placeholder="Put Snowflake ID here (eg. 1263785187301658678)" label-position="left" label-width="110px" mb-2 label-align="right" />
      <c-input-text v-model:value="inputEpoch" label="Epoch" placeholder="Put Epoch Timestamp here (optional, eg. 1420070400000)" label-position="left" label-width="110px" mb-2 label-align="right" />

      <n-divider />

      <InputCopyable
        label="Local date"
        v-bind="inputProps"
        :value="inputEpoch ? new Date(extractTimestamp(BigInt(inputId.valueOf()), BigInt(inputEpoch.valueOf()))).toLocaleString() : ''"
        placeholder="Epoch Timestamp will be here..."
        label-position="left" label-width="110px" mb-2 label-align="right"
      />

      <InputCopyable
        label="Timestamp"
        v-bind="inputProps"
        :value="inputEpoch ? new Date(extractTimestamp(BigInt(inputId.valueOf()), BigInt(inputEpoch.valueOf()))).getTime() : ''"
        placeholder="Epoch Timestamp will be here..."
        label-position="left" label-width="110px" mb-2 label-align="right"
      />

      <InputCopyable
        label="Machine ID"
        v-bind="inputProps"
        :value="extractMachineId(BigInt(inputId.valueOf()))"
        placeholder="Machine ID will be here..."
        label-position="left" label-width="110px" mb-2 label-align="right"
      />

      <InputCopyable
        label="Sequence"
        v-bind="inputProps"
        :value="extractId(BigInt(inputId.valueOf()))"
        placeholder="Sequence number will be here..."
        label-position="left" label-width="110px" mb-2 label-align="right"
      />
    </c-card>
  </div>
</template>
