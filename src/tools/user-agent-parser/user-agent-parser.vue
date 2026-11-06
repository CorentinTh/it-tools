<script setup lang="ts">
import { UAParser } from 'ua-parser-js';
import { Adjustments, Browser, Cpu, Devices, Engine } from '@vicons/tabler';
import UserAgentResultCards from './user-agent-result-cards.vue';
import type { UserAgentResultSection } from './user-agent-parser.types';
import { withDefaultOnError } from '@/utils/defaults';

const ua = ref(navigator.userAgent as string);

// If not input in the ua field is present return an empty object of type UAParser.IResult because otherwise
// UAParser returns the values for the current Browser. This is confusing because results are shown for an empty
// UA field value.
function getUserAgentInfo(userAgent: string) {
  return userAgent.trim().length > 0
    ? UAParser(userAgent.trim())
    : ({ ua: '', browser: {}, cpu: {}, device: {}, engine: {}, os: {} } as UAParser.IResult);
}
const userAgentInfo = computed(() => withDefaultOnError(() => getUserAgentInfo(ua.value), undefined));

const sections: UserAgentResultSection[] = [
  {
    heading: 'Browser',
    icon: Browser,
    content: [
      {
        label: 'Name',
        getValue: block => block?.browser.name,
        undefinedFallback: 'No browser name available',
      },
      {
        label: 'Version',
        getValue: block => block?.browser.version,
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
        getValue: block => block?.engine.name,
        undefinedFallback: 'No engine name available',
      },
      {
        label: 'Version',
        getValue: block => block?.engine.version,
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
        getValue: block => block?.os.name,
        undefinedFallback: 'No OS name available',
      },
      {
        label: 'Version',
        getValue: block => block?.os.version,
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
        getValue: block => block?.device.model,
        undefinedFallback: 'No device model available',
      },
      {
        label: 'Type',
        getValue: block => block?.device.type,
        undefinedFallback: 'No device type available',
      },
      {
        label: 'Vendor',
        getValue: block => block?.device.vendor,
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
        getValue: block => block?.cpu.architecture,
        undefinedFallback: 'No CPU architecture available',
      },
    ],
  },
];
</script>

<template>
  <div>
    <c-input-text
      v-model:value="ua"
      label="User agent string"
      multiline
      placeholder="Put your user-agent here..."
      clearable
      raw-text
      rows="2"
      autosize
      monospace
      mb-3
    />

    <UserAgentResultCards :user-agent-info="userAgentInfo" :sections="sections" />
  </div>
</template>
