<script setup lang="ts">
import { raidCalculations } from './raid-calculator.service';
import { UNIT_BASE, formatBytes } from '@/utils/convert';

const diskTotal = ref(2);
const diskSize = ref(100);
const diskUnit = ref(10 ** 9);
const diskPerStripe = ref(3);
const raidType = ref('raid_0');
const raidInfo = computed(() => raidCalculations[raidType.value].about);
const raidRequirements = computed(() => raidCalculations[raidType.value].requirements);
const inputsValid = computed(() => validateSetup());

const totalStripes = computed(() => {
  if (inputsValid.value) {
    return `${diskTotal.value / diskPerStripe.value} stripes total`;
  }
  else {
    return '';
  }
});

const calculatedCapacity = computed(() => {
  return formatBytes(raidCalculations[raidType.value].capacity(diskTotal.value, diskSize.value, diskPerStripe.value, diskUnit.value), 2, UNIT_BASE.BASE_10);
});

const calculatedFaultTolerance = computed(() => {
  return raidCalculations[raidType.value].fault(diskTotal.value, diskSize.value, diskUnit.value);
});

const calculatedSpaceEfficiency = computed(() => {
  return raidCalculations[raidType.value].efficiency(diskTotal.value, diskPerStripe.value).toFixed(1);
});

function validateSetup() {
  // validate the selected RAID type against parameters
  return raidCalculations[raidType.value].validate(diskTotal.value, diskSize.value, diskPerStripe.value);
}
</script>

<template>
  <div>
    <c-card>
      <n-form-item label="Number of disks" label-placement="left" label-width="150" mb-2>
        <n-input-number v-model:value="diskTotal" max="10000" min="2" placeholder="Number of disks (ex: 2)" w-full />
      </n-form-item>

      <n-form-item label="Disk size" label-placement="left" label-width="150" mb-2>
        <n-input-number v-model:value="diskSize" max="10000" min="1" placeholder="Disk size (ex: 100)" w-full />
        <div flex items-baseline gap-2>
          <c-select
            v-model:value="diskUnit"
            min-w-130px
            ml-1
            :options="[
              { label: 'MB', value: 10 ** 6 },
              { label: 'GB', value: 10 ** 9 },
              { label: 'TB', value: 10 ** 12 },
              { label: 'PB', value: 10 ** 15 },
            ]"
          />
        </div>
      </n-form-item>
      <n-form-item v-if="['raid_50', 'raid_60'].includes(raidType)" label="Disks per stripe" label-placement="left" label-width="150" mb-2>
        <n-input-number v-model:value="diskPerStripe" max="10000" min="2" placeholder="Number of disks per stripe (ex: 3)" w-full />
        <n-input v-model:value="totalStripes" placeholder="" ml-1 w-full readonly />
      </n-form-item>
      <n-form-item label="RAID Type" label-placement="left" label-width="150" mb-2>
        <c-select
          v-model:value="raidType"
          w-full
          :options="[
            { label: 'RAID 0 (stripe)', value: 'raid_0' },
            { label: 'RAID 1 (mirror)', value: 'raid_1' },
            { label: 'RAID 5 (parity)', value: 'raid_5' },
            { label: 'RAID 6 (double parity)', value: 'raid_6' },
            { label: 'RAID 10 (mirror + stripe)', value: 'raid_10' },
            { label: 'RAID 50 (parity + stripe)', value: 'raid_50' },
            { label: 'RAID 60 (double parity + stripe)', value: 'raid_60' },
          ]"
        />
      </n-form-item>
      <p v-if="!inputsValid" class="raidError">
        {{ raidRequirements }}
      </p>
      <p>
        {{ raidInfo }}<br /><br />
        For more information on RAID types, see <a href="https://en.wikipedia.org/wiki/Standard_RAID_levels" target="_blank" rel="noopener">Wikipedia</a>.
      </p>
    </c-card>
    <c-card title="Results">
      <n-table v-if="inputsValid">
        <tbody>
          <tr>
            <td font-bold width="30%">
              Capacity
            </td>
            <td>
              {{ calculatedCapacity }}
            </td>
          </tr>
          <tr>
            <td font-bold width="30%">
              Fault Tolerance
            </td>
            <td>
              {{ calculatedFaultTolerance }}
            </td>
          </tr>
          <tr>
            <td font-bold width="30%">
              Space Efficiency
            </td>
            <td>
              {{ calculatedSpaceEfficiency }}%
            </td>
          </tr>
        </tbody>
      </n-table>
    </c-card>
  </div>
</template>

<style lang="less" scoped>
.raidError {
  color: rgb(208, 48, 80)
}
</style>
