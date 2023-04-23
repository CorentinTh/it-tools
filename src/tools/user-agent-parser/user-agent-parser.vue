<template>
  <div>
    <n-form-item label="User agent string">
      <n-input
        v-model:value="ua"
        type="textarea"
        placeholder="Put your user-agent here..."
        clearable
        :autosize="{ minRows: 2 }"
      />
    </n-form-item>

    <user-agent-result-cards :user-agent-info="userAgentInfo" :sections="sections" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { UAParser } from 'ua-parser-js';
import { withDefaultOnError } from '@/utils/defaults';
import { Adjustments, Browser, Cpu, Devices, Engine } from '@vicons/tabler';
import UserAgentResultCards from './user-agent-result-cards.vue';
import type { UserAgentResultSection } from './user-agent-parser.types';

const ua = ref(navigator.userAgent as string);

// If not input in the ua field is present return an empty object of type UAParser.IResult because otherwise
// UAParser returns the values for the current Browser. This is confusing because results are shown for an empty
// UA field value.
const getUserAgentInfo = (userAgent: string) =>
  userAgent.trim().length > 0
    ? UAParser(userAgent.trim())
    : ({ ua: '', browser: {}, cpu: {}, device: {}, engine: {}, os: {} } as UAParser.IResult);
const userAgentInfo = computed(() => withDefaultOnError(() => getUserAgentInfo(ua.value), undefined));

const sections: UserAgentResultSection[] = [
  {
    heading: 'Browser',
    icon: Browser,
    content: [
      {
        label: 'Name',
        getValue: (block) => block?.browser.name,
        undefinedFallback: 'No browser name available',
      },
      {
        label: 'Version',
        getValue: (block) => block?.browser.version,
        undefinedFallback: 'No browser version available',
      },
    ],
  },
  {
    heading: 'Engine',
    icon: Engine,
    content: [
      {
        label: 'Name',
        getValue: (block) => block?.engine.name,
        undefinedFallback: 'No engine name available',
      },
      {
        label: 'Version',
        getValue: (block) => block?.engine.version,
        undefinedFallback: 'No engine version available',
      },
    ],
  },
  {
    heading: 'OS',
    icon: Adjustments,
    content: [
      {
        label: 'Name',
        getValue: (block) => block?.os.name,
        undefinedFallback: 'No OS name available',
      },
      {
        label: 'Version',
        getValue: (block) => block?.os.version,
        undefinedFallback: 'No OS version available',
      },
    ],
  },
  {
    heading: 'Device',
    icon: Devices,
    content: [
      {
        label: 'Model',
        getValue: (block) => block?.device.model,
        undefinedFallback: 'No device model available',
      },
      {
        label: 'Type',
        getValue: (block) => block?.device.type,
        undefinedFallback: 'No device type available',
      },
      {
        label: 'Vendor',
        getValue: (block) => block?.device.vendor,
        undefinedFallback: 'No device vendor available',
      },
    ],
  },
  {
    heading: 'CPU',
    icon: Cpu,
    content: [
      {
        label: 'Architecture',
        getValue: (block) => block?.cpu.architecture,
        undefinedFallback: 'No CPU architecture available',
      },
    ],
  },
];
</script>

<style lang="less" scoped></style>
