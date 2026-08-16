<script setup lang="ts">
import type { RaidCalculation, RaidLevel } from './raid-storage-calculator.service';
import { RAID_STORAGE_UNITS, calculateRaidStorage, formatRaidSummary } from './raid-storage-calculator.service';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';

const level = ref<RaidLevel>('5');
const diskCount = ref(4);
const diskCapacity = ref('4');
const inputUnitId = ref('TB');
const outputUnitId = ref('TiB');
const result = ref<RaidCalculation>();
const output = ref('');
const error = ref('');
const status = ref('Ready.');
const completedSignature = ref('');
const signature = computed(() => [level.value, diskCount.value, diskCapacity.value, inputUnitId.value, outputUnitId.value].join('\0'));
const stale = computed(() => Boolean(result.value && signature.value !== completedSignature.value));
const unitOptions = RAID_STORAGE_UNITS.map(unit => ({ label: unit.label, value: unit.id }));
const { copy } = useCopy({ source: output, text: 'RAID calculation copied' });

function calculate() {
  try {
    const input = { level: level.value, diskCount: diskCount.value, diskCapacity: diskCapacity.value, inputUnitId: inputUnitId.value, outputUnitId: outputUnitId.value };
    result.value = calculateRaidStorage(input);
    output.value = formatRaidSummary(input, result.value);
    completedSignature.value = signature.value;
    error.value = '';
    status.value = 'Calculated locally.';
  }
  catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'RAID calculation failed.';
    status.value = 'Calculation failed.';
  }
}

calculate();
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Capacity planning, not a safety guarantee">
      Capacity uses exact integer fractions and assumes identical drives. A mixed array is limited by its smallest disk. Controller metadata, filesystem formatting, hot spares, sector-size differences, rebuild risk, and vendor-specific layouts are not included; RAID is not a backup.
    </c-alert>
    <c-card class="c-task-options" title="Array layout">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-select v-model:value="level" label="RAID level" :options="[{ label: 'RAID 0 — stripe', value: '0' }, { label: 'RAID 1 — mirror', value: '1' }, { label: 'RAID 5 — single parity', value: '5' }, { label: 'RAID 6 — dual parity', value: '6' }, { label: 'RAID 10 — mirrored stripes', value: '10' }]" />
        <c-field label="Disk count" label-for="raid-disk-count">
          <CInputNumber
            id="raid-disk-count"
            v-model:value="diskCount"
            test-id="raid-disk-count"
            :min="2"
            :max="128"
          />
        </c-field>
        <c-input-text v-model:value="diskCapacity" label="Capacity of each / smallest disk" inputmode="decimal" :maxlength="46" raw-text />
        <c-select v-model:value="inputUnitId" label="Entered disk unit" :options="unitOptions" />
        <c-select v-model:value="outputUnitId" label="Result display unit" :options="unitOptions" />
      </div>
    </c-card>
    <div class="c-task-actions">
      <c-button type="primary" data-test-id="raid-calculate" @click="calculate">
        Calculate capacity
      </c-button>
    </div>
    <p class="c-task-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-alert v-if="error" title="Invalid RAID layout" data-test-id="raid-error">
      {{ error }}
    </c-alert>
    <c-alert v-if="stale" title="Result uses the previous layout">
      Calculate again to apply the current disk count, capacity, units, and RAID level.
    </c-alert>
    <c-card v-if="result" title="Capacity and resilience" data-test-id="raid-result">
      <div grid grid-cols-1 gap-2 md:grid-cols-2>
        <p><strong>Raw capacity:</strong> {{ result.rawCapacity }}</p>
        <p><strong>Usable capacity:</strong> {{ result.usableCapacity }}</p>
        <p><strong>Parity/mirror overhead:</strong> {{ result.overheadCapacity }}</p>
        <p><strong>Capacity efficiency:</strong> {{ result.efficiency }}</p>
        <p><strong>Usable disk-equivalents:</strong> {{ result.dataDiskCount }} of {{ result.diskCount }}</p>
        <p><strong>Overhead disk-equivalents:</strong> {{ result.overheadDiskCount }}</p>
        <p md:col-span-2>
          <strong>Failure tolerance:</strong> {{ result.failureDescription }}
        </p>
      </div>
    </c-card>
    <c-input-text :value="output" label="Portable calculation summary" raw-text monospace multiline readonly :rows="12" />
    <div class="c-task-actions">
      <c-button :disabled="!output" @click="copy()">
        Copy
      </c-button>
      <c-button :disabled="!output" @click="downloadTextFile({ content: output, filename: 'raid-storage-calculation.txt' })">
        Download
      </c-button>
    </div>
  </div>
</template>
