<script setup lang="ts">
import cronstrue from 'cronstrue';
import { getSupportedTimeZones } from '../timezone-duration-calculator/timezone-duration-calculator.service';
import { type CronDialect, parseCronExpression } from './cron-next-runs.service';
import { createCronWorkerClient } from './cron-next-runs.worker-client';
import { useStyleStore } from '@/stores/style.store';
import CSwitch from '@/ui/c-switch/c-switch.vue';
import { BoundedTextTaskError } from '@/utils/bounded-text-task';
import { useCopy } from '@/composable/copy';

const dialectOptions: Array<{ label: string; value: CronDialect }> = [
  { label: 'Unix (5 fields)', value: 'unix' },
  { label: 'With seconds (6 fields)', value: 'seconds' },
  { label: 'Quartz (6/7 fields)', value: 'quartz' },
];
const presets: Record<CronDialect, Array<{ label: string; value: string }>> = {
  unix: [
    { label: 'Every 15 minutes', value: '*/15 * * * *' },
    { label: 'Weekdays at 09:00', value: '0 9 * * MON-FRI' },
    { label: 'First day monthly', value: '0 0 1 * *' },
  ],
  seconds: [
    { label: 'Every 10 seconds', value: '*/10 * * * * *' },
    { label: 'At second 30 every minute', value: '30 * * * * *' },
  ],
  quartz: [
    { label: 'Weekdays at 09:00', value: '0 0 9 ? * MON-FRI' },
    { label: 'Daily at midnight', value: '0 0 0 * * ?' },
  ],
};
const defaultExpression: Record<CronDialect, string> = {
  unix: presets.unix[0].value,
  seconds: presets.seconds[0].value,
  quartz: presets.quartz[0].value,
};
const zones = getSupportedTimeZones();
if (!zones.includes('UTC')) {
  zones.unshift('UTC');
}
const zoneOptions = zones.map(value => ({ label: value, value }));

const styleStore = useStyleStore();
const dialect = ref<CronDialect>('unix');
const cron = ref(defaultExpression.unix);
const preset = ref(defaultExpression.unix);
const timeZone = ref('UTC');
const afterIso = ref(new Date().toISOString());
const countInput = ref('10');
const output = ref('');
const error = ref('');
const status = ref('Ready.');
const isRunning = ref(false);
const calculatedSignature = ref('');
const client = createCronWorkerClient();
const cronstrueConfig = reactive({
  verbose: true,
  dayOfWeekStartIndexZero: true,
  use24HourTimeFormat: true,
  throwExceptionOnParseError: true,
});

const helpers = [
  { symbol: '*', meaning: 'Any value', example: '* * * * *', equivalent: 'Every minute' },
  { symbol: '-', meaning: 'Range of values', example: 'MON-FRI', equivalent: 'Monday through Friday' },
  { symbol: ',', meaning: 'List of values', example: '1,10 * * * *', equivalent: 'At minutes 1 and 10' },
  { symbol: '/', meaning: 'Step values', example: '*/10 * * * *', equivalent: 'Every 10 minutes' },
  { symbol: '?', meaning: 'Any day (Quartz only)', example: '0 0 9 ? * MON', equivalent: 'Monday at 09:00' },
  { symbol: '@daily', meaning: 'Unix alias', example: '@daily', equivalent: '0 0 * * *' },
];

const validationMessage = computed(() => {
  try {
    parseCronExpression(cron.value, dialect.value);
    return '';
  }
  catch (caught) {
    return caught instanceof Error ? caught.message : 'This cron expression is invalid.';
  }
});
const cronString = computed(() => {
  if (validationMessage.value) {
    return '';
  }
  try {
    return cronstrue.toString(cron.value, cronstrueConfig);
  }
  catch {
    return dialect.value === 'quartz' ? 'Valid supported Quartz expression' : 'Valid cron expression';
  }
});
const count = computed(() => /^\d{1,2}$/.test(countInput.value) ? Number(countInput.value) : Number.NaN);
const signature = computed(() => `${dialect.value}\0${cron.value}\0${timeZone.value}\0${afterIso.value}\0${countInput.value}`);
const isStale = computed(() => Boolean(output.value && calculatedSignature.value !== signature.value));

watch(dialect, (nextDialect) => {
  cron.value = defaultExpression[nextDialect];
  preset.value = defaultExpression[nextDialect];
});
watch(preset, (nextPreset) => {
  cron.value = nextPreset;
});
watch([cron, timeZone, afterIso, countInput], () => {
  error.value = '';
  if (!isRunning.value) {
    status.value = isStale.value ? 'Inputs changed. Calculate to refresh next runs.' : 'Ready.';
  }
});

async function calculateRuns() {
  if (validationMessage.value || !Number.isSafeInteger(count.value) || count.value < 1 || count.value > 25) {
    error.value = validationMessage.value || 'Result count must be between 1 and 25.';
    return;
  }
  isRunning.value = true;
  error.value = '';
  status.value = 'Calculating next runs locally…';
  const requestedSignature = signature.value;
  try {
    const result = await client.run({
      expression: cron.value,
      dialect: dialect.value,
      timeZone: timeZone.value,
      afterIso: afterIso.value,
      count: count.value,
    });
    output.value = result.value;
    calculatedSignature.value = requestedSignature;
    status.value = `Next runs calculated in ${Math.round(result.elapsedMs)} ms.`;
  }
  catch (caught) {
    const taskError = caught instanceof BoundedTextTaskError ? caught : undefined;
    error.value = taskError?.message ?? 'Next runs could not be calculated.';
    status.value = taskError?.code === 'cancelled' ? taskError.message : 'Calculation failed.';
  }
  finally {
    isRunning.value = false;
  }
}

const { copy } = useCopy({ source: output, text: 'Cron next runs copied to the clipboard' });
onBeforeUnmount(() => client.dispose());
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-card class="c-tool-panel" title="Cron expression">
      <c-buttons-select v-model:value="dialect" label="Dialect" label-position="top" :options="dialectOptions" />
      <div grid grid-cols-1 mt-3 gap-3 md:grid-cols-2>
        <c-select v-model:value="preset" label="Preset" label-position="top" :options="presets[dialect]" />
        <c-select v-model:value="timeZone" label="Timezone" label-position="top" :options="zoneOptions" searchable />
      </div>
      <c-input-text
        v-model:value="cron"
        class="cron-input mt-3"
        placeholder="*/15 * * * *"
        label="Cron expression"
        :maxlength="256"
        test-id="cron-expression"
        raw-text
        monospace
      />
      <p v-if="cronString" class="cron-string" role="status" aria-live="polite">
        {{ cronString }}
      </p>
      <c-alert v-if="validationMessage" title="Invalid cron expression" mt-3 data-test-id="cron-validation">
        {{ validationMessage }}
      </c-alert>

      <div grid grid-cols-1 mt-3 gap-3 md:grid-cols-2>
        <c-input-text
          v-model:value="afterIso"
          label="Find runs after this ISO instant"
          placeholder="2026-01-01T00:00:00.000Z"
          :maxlength="64"
          test-id="cron-after"
          raw-text
          monospace
        />
        <c-input-text
          v-model:value="countInput"
          label="Number of runs (1–25)"
          :maxlength="2"
          test-id="cron-count"
          inputmode="numeric"
          raw-text
        />
      </div>

      <div grid grid-cols-1 mt-3 gap-3 md:grid-cols-3>
        <CSwitch id="cron-verbose" v-model:value="cronstrueConfig.verbose" label="Verbose description" label-position="top" />
        <CSwitch id="cron-24-hour-time" v-model:value="cronstrueConfig.use24HourTimeFormat" label="Use 24-hour time" label-position="top" />
        <CSwitch id="cron-days-start-zero" v-model:value="cronstrueConfig.dayOfWeekStartIndexZero" label="Sunday is day 0" label-position="top" />
      </div>
    </c-card>

    <div class="c-task-actions">
      <c-button type="primary" :disabled="Boolean(validationMessage) || isRunning" data-test-id="cron-calculate" @click="calculateRuns">
        {{ isRunning ? 'Calculating…' : 'Calculate next runs' }}
      </c-button>
      <c-button :disabled="!output" data-test-id="cron-copy" @click="copy()">
        Copy
      </c-button>
    </div>
    <p class="c-task-status" data-test-id="cron-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="error" title="Next-run error" data-test-id="cron-error">
      {{ error }}
    </c-alert>
    <c-alert v-if="isStale" title="Results use previous inputs" data-test-id="cron-stale">
      Calculate again to apply current inputs.
    </c-alert>
    <c-input-text
      class="c-tool-panel"
      :value="output"
      label="Next runs"
      aria-label="Cron next runs"
      placeholder="Calculated runs will appear here"
      test-id="cron-output"
      raw-text monospace readonly multiline :rows="12"
    />

    <c-card class="c-tool-panel" title="Supported syntax">
      <div v-if="styleStore.isSmallScreen">
        <c-card v-for="{ symbol, meaning, example, equivalent } in helpers" :key="symbol" mb-3 important:border-none>
          <div>Symbol: <strong>{{ symbol }}</strong></div>
          <div>Meaning: <strong>{{ meaning }}</strong></div>
          <div>Example: <strong><code>{{ example }}</code></strong></div>
          <div>Equivalent: <strong>{{ equivalent }}</strong></div>
        </c-card>
      </div>
      <c-table v-else :data="helpers" />
      <p mt-3 text-sm op-70>
        The next-run calculator supports wildcards, lists, ascending ranges, steps, month/day names, Unix aliases, and Quartz ?. Quartz L, W, and # modifiers are reported as unsupported.
      </p>
    </c-card>
  </div>
</template>

<style scoped>
.cron-input :deep(input) {
  font-size: 24px;
  text-align: center;
}

.cron-string {
  margin: var(--ui-space-3) 0 0;
  text-align: center;
  font-size: 18px;
  opacity: 0.8;
}
</style>
