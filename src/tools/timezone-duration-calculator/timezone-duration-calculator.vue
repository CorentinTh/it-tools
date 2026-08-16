<script setup lang="ts">
import {
  type DurationResult,
  type ZonedDateTimeDisplay,
  calculateDuration,
  formatZonedDateTime,
  getSupportedTimeZones,
  resolveZonedDateTime,
} from './timezone-duration-calculator.service';
import { useCopy } from '@/composable/copy';

type CalculatorMode = 'convert' | 'duration';
type Occurrence = 'earlier' | 'later';

const modeOptions: Array<{ label: string; value: CalculatorMode }> = [
  { label: 'Timezone conversion', value: 'convert' },
  { label: 'Date duration', value: 'duration' },
];
const occurrenceOptions: Array<{ label: string; value: Occurrence }> = [
  { label: 'Earlier occurrence', value: 'earlier' },
  { label: 'Later occurrence', value: 'later' },
];
const zones = getSupportedTimeZones();
if (!zones.includes('UTC')) {
  zones.unshift('UTC');
}
const zoneOptions = zones.map(value => ({ label: value, value }));

const mode = ref<CalculatorMode>('convert');
const startLocal = ref('2026-01-15T12:00:00');
const startZone = ref('Europe/Moscow');
const targetZone = ref('America/New_York');
const endLocal = ref('2026-01-16T15:30:00');
const endZone = ref('America/New_York');
const startOccurrence = ref<Occurrence>('earlier');
const endOccurrence = ref<Occurrence>('earlier');
const startDisplay = ref<ZonedDateTimeDisplay>();
const targetDisplay = ref<ZonedDateTimeDisplay>();
const endDisplay = ref<ZonedDateTimeDisplay>();
const duration = ref<DurationResult>();
const startAmbiguous = ref(false);
const endAmbiguous = ref(false);
const error = ref('');
const calculatedSignature = ref('');

const signature = computed(() => [
  mode.value,
  startLocal.value,
  startZone.value,
  targetZone.value,
  endLocal.value,
  endZone.value,
  startOccurrence.value,
  endOccurrence.value,
].join('\0'));
const isStale = computed(() => Boolean(startDisplay.value && signature.value !== calculatedSignature.value));

function chooseInstant(instants: number[], occurrence: Occurrence): number {
  return occurrence === 'later' ? instants[instants.length - 1] : instants[0];
}

function calculate() {
  error.value = '';
  try {
    const start = resolveZonedDateTime(startLocal.value, startZone.value);
    const startEpoch = chooseInstant(start.instants, startOccurrence.value);
    startAmbiguous.value = start.ambiguous;
    startDisplay.value = formatZonedDateTime(startEpoch, startZone.value);

    if (mode.value === 'convert') {
      targetDisplay.value = formatZonedDateTime(startEpoch, targetZone.value);
      endDisplay.value = undefined;
      duration.value = undefined;
      endAmbiguous.value = false;
    }
    else {
      const end = resolveZonedDateTime(endLocal.value, endZone.value);
      const endEpoch = chooseInstant(end.instants, endOccurrence.value);
      endAmbiguous.value = end.ambiguous;
      endDisplay.value = formatZonedDateTime(endEpoch, endZone.value);
      duration.value = calculateDuration(startEpoch, endEpoch);
      targetDisplay.value = undefined;
    }
    calculatedSignature.value = signature.value;
  }
  catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'The date-time calculation failed.';
  }
}

watch([mode, startLocal, startZone, targetZone, endLocal, endZone, startOccurrence, endOccurrence], () => {
  error.value = '';
});

const report = computed(() => {
  if (!startDisplay.value) {
    return '';
  }
  const lines = [
    `Start (${startZone.value}): ${startDisplay.value.local} ${startDisplay.value.offset} (${startDisplay.value.abbreviation})`,
    `UTC: ${startDisplay.value.isoUtc}`,
    `Epoch milliseconds: ${startDisplay.value.epochMilliseconds}`,
  ];
  if (targetDisplay.value) {
    lines.push(
      `Target (${targetZone.value}): ${targetDisplay.value.local} ${targetDisplay.value.offset} (${targetDisplay.value.abbreviation})`,
    );
  }
  if (endDisplay.value && duration.value) {
    lines.push(
      `End (${endZone.value}): ${endDisplay.value.local} ${endDisplay.value.offset} (${endDisplay.value.abbreviation})`,
      `End UTC: ${endDisplay.value.isoUtc}`,
      `Elapsed: ${duration.value.isoDuration}`,
      `Total seconds: ${duration.value.seconds}`,
    );
  }
  return lines.join('\n');
});

const { copy } = useCopy({ source: report, text: 'Date-time report copied to the clipboard' });
calculate();
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-buttons-select
      v-model:value="mode"
      label="Calculator"
      label-position="top"
      :options="modeOptions"
    />

    <c-card class="c-tool-panel" :title="mode === 'convert' ? 'Source date and timezone' : 'Start date and timezone'">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-input-text
          v-model:value="startLocal"
          label="Local date and time"
          placeholder="2026-01-15T12:00:00"
          :maxlength="19"
          test-id="timezone-start-local"
          raw-text
          monospace
        />
        <c-select
          v-model:value="startZone"
          label="Timezone"
          label-position="top"
          :options="zoneOptions"
          searchable
        />
      </div>
      <c-buttons-select
        v-if="startAmbiguous"
        v-model:value="startOccurrence"
        class="mt-3"
        label="Repeated DST time"
        label-position="top"
        :options="occurrenceOptions"
      />
    </c-card>

    <c-card v-if="mode === 'convert'" class="c-tool-panel" title="Target timezone">
      <c-select
        v-model:value="targetZone"
        label="Timezone"
        label-position="top"
        :options="zoneOptions"
        searchable
      />
    </c-card>

    <c-card v-else class="c-tool-panel" title="End date and timezone">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-input-text
          v-model:value="endLocal"
          label="Local date and time"
          placeholder="2026-01-16T15:30:00"
          :maxlength="19"
          test-id="timezone-end-local"
          raw-text
          monospace
        />
        <c-select
          v-model:value="endZone"
          label="Timezone"
          label-position="top"
          :options="zoneOptions"
          searchable
        />
      </div>
      <c-buttons-select
        v-if="endAmbiguous"
        v-model:value="endOccurrence"
        class="mt-3"
        label="Repeated DST time"
        label-position="top"
        :options="occurrenceOptions"
      />
    </c-card>

    <c-alert v-if="isStale" title="Results use previous inputs" data-test-id="timezone-stale">
      Select Calculate to apply the current values.
    </c-alert>
    <c-alert v-if="error" title="Invalid date or timezone" data-test-id="timezone-error">
      {{ error }}
    </c-alert>
    <div class="c-task-actions">
      <c-button type="primary" data-test-id="timezone-calculate" @click="calculate">
        Calculate
      </c-button>
      <c-button :disabled="!report" data-test-id="timezone-copy" @click="copy()">
        Copy report
      </c-button>
    </div>

    <c-card v-if="startDisplay" class="c-tool-panel" title="Result" data-test-id="timezone-result">
      <div class="result-list">
        <div><strong>{{ mode === 'convert' ? 'Source' : 'Start' }}</strong><code>{{ startDisplay.local }} {{ startDisplay.offset }} ({{ startDisplay.abbreviation }})</code></div>
        <div><strong>UTC instant</strong><code>{{ startDisplay.isoUtc }}</code></div>
        <div><strong>Epoch milliseconds</strong><code>{{ startDisplay.epochMilliseconds }}</code></div>
        <template v-if="targetDisplay">
          <div><strong>Target</strong><code>{{ targetDisplay.local }} {{ targetDisplay.offset }} ({{ targetDisplay.abbreviation }})</code></div>
        </template>
        <template v-if="endDisplay && duration">
          <div><strong>End</strong><code>{{ endDisplay.local }} {{ endDisplay.offset }} ({{ endDisplay.abbreviation }})</code></div>
          <div><strong>Elapsed duration</strong><code data-test-id="duration-iso">{{ duration.isoDuration }}</code></div>
          <div><strong>Breakdown</strong><code>{{ duration.days }} days, {{ duration.hours }} hours, {{ duration.minutes }} minutes, {{ duration.remainingSeconds }} seconds</code></div>
          <div><strong>Total seconds</strong><code>{{ duration.seconds.toLocaleString('en-US') }}</code></div>
        </template>
      </div>
      <c-alert v-if="startAmbiguous || endAmbiguous" title="Ambiguous DST time" mt-3 data-test-id="timezone-ambiguous">
        This local time occurs twice because clocks move back. Choose the earlier or later occurrence above, then calculate again.
      </c-alert>
    </c-card>
  </div>
</template>

<style scoped>
.result-list {
  display: grid;
  gap: var(--ui-space-3);
}

.result-list > div {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--ui-space-1);
}

code {
  overflow-wrap: anywhere;
}
</style>
