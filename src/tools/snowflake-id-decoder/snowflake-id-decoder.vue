<script setup lang="ts">
import { SNOWFLAKE_PLATFORMS, type SnowflakePlatform, decodeSnowflake } from './snowflake-id-decoder.models';
import { withDefaultOnError } from '@/utils/defaults';
import { useValidation } from '@/composable/validation';

const id = ref('175928847299117063');
const platformKey = useStorage('snowflake:platform', 'discord');
const customEpoch = ref<number | null>(null);

const platform = computed<SnowflakePlatform>(() =>
  SNOWFLAKE_PLATFORMS.find(p => p.key === platformKey.value) ?? SNOWFLAKE_PLATFORMS[1]!,
);
const effectiveEpoch = computed(() => (platformKey.value === 'custom' ? Number(customEpoch.value ?? 0) : platform.value.epoch));

const validation = useValidation({
  source: id,
  rules: [
    {
      validator: value => !value || /^\d{1,20}$/.test(value.trim()),
      message: 'A snowflake id is a positive integer (up to 20 digits)',
    },
  ],
});

const decoded = computed(() =>
  withDefaultOnError(() => (id.value.trim() && validation.isValid ? decodeSnowflake(id.value, platform.value, effectiveEpoch.value) : undefined), undefined),
);

const epochOptions = SNOWFLAKE_PLATFORMS.map(p => ({ label: p.label, value: p.key }));
</script>

<template>
  <div style="max-width: 640px; margin: 0 auto;">
    <c-card mb-3>
      <c-input-text
        v-model:value="id"
        label="Snowflake id"
        placeholder="e.g. 175928847299117063"
        :validation="id ? validation : undefined"
        mb-3
      />

      <n-grid cols="2" x-gap="12">
        <n-gi>
          <c-select v-model:value="platformKey" label="Platform" label-position="top" :options="epochOptions" />
        </n-gi>
        <n-gi>
          <c-input-text
            v-if="platformKey === 'custom'"
            v-model:value="customEpoch"
            label="Custom epoch (ms)"
            placeholder="e.g. 0"
          />
        </n-gi>
      </n-grid>
    </c-card>

    <c-card v-if="decoded">
      <n-table>
        <tbody>
          <tr>
            <td class="labels">
              Timestamp (ms):
            </td>
            <td>{{ decoded.timestamp }}</td>
          </tr>
          <tr>
            <td class="labels">
              Date:
            </td>
            <td>{{ decoded.isoDate }}</td>
          </tr>
          <tr v-for="field in decoded.fields" :key="field.label">
            <td class="labels">
              {{ field.label }}:
            </td>
            <td>{{ field.value }}</td>
          </tr>
          <tr>
            <td class="labels">
              Sequence:
            </td>
            <td>{{ decoded.sequence }}</td>
          </tr>
        </tbody>
      </n-table>
      <div mt-2 text-xs op-60>
        Epoch: {{ effectiveEpoch }} ms · layout: {{ decoded.layoutLabel }}
      </div>
    </c-card>
  </div>
</template>

<style scoped lang="less">
.labels {
  width: 180px;
  font-weight: bold;
}
</style>
