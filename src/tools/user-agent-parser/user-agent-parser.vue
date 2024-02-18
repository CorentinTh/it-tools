<script setup lang="ts">
import { UAParser } from 'ua-parser-js';
import { Adjustments, Browser, Cpu, Devices, Engine } from '@vicons/tabler';
import UserAgentResultCards from './user-agent-result-cards.vue';
import type { UserAgentResultSection } from './user-agent-parser.types';
import { withDefaultOnError } from '@/utils/defaults';

const ua = ref(navigator.userAgent as string);
const { t } = useI18n();

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
    heading: t('tools.user-agent-parser.browser'),
    icon: Browser,
    content: [
      {
        label: t('tools.user-agent-parser.name'),
        getValue: block => block?.browser.name,
        undefinedFallback: t('tools.user-agent-parser.browserNameFallback'),
      },
      {
        label: t('tools.user-agent-parser.version'),
        getValue: block => block?.browser.version,
        undefinedFallback: t('tools.user-agent-parser.browserVersionFallback'),
      },
    ],
  },
  {
    heading: t('tools.user-agent-parser.engine'),
    icon: Engine,
    content: [
      {
        label: t('tools.user-agent-parser.name'),
        getValue: block => block?.engine.name,
        undefinedFallback: t('tools.user-agent-parser.engineNameFallback'),
      },
      {
        label: t('tools.user-agent-parser.version'),
        getValue: block => block?.engine.version,
        undefinedFallback: t('tools.user-agent-parser.engineVersionFallback'),
      },
    ],
  },
  {
    heading: t('tools.user-agent-parser.os'),
    icon: Adjustments,
    content: [
      {
        label: t('tools.user-agent-parser.name'),
        getValue: block => block?.os.name,
        undefinedFallback: t('tools.user-agent-parser.osNameFallback'),
      },
      {
        label: t('tools.user-agent-parser.version'),
        getValue: block => block?.os.version,
        undefinedFallback: t('tools.user-agent-parser.osVersionFallback'),
      },
    ],
  },
  {
    heading: t('tools.user-agent-parser.device'),
    icon: Devices,
    content: [
      {
        label: t('tools.user-agent-parser.model'),
        getValue: block => block?.device.model,
        undefinedFallback: t('tools.user-agent-parser.deviceModelFallback'),
      },
      {
        label: t('tools.user-agent-parser.type'),
        getValue: block => block?.device.type,
        undefinedFallback: t('tools.user-agent-parser.deviceTypeFallback'),
      },
      {
        label: t('tools.user-agent-parser.vendor'),
        getValue: block => block?.device.vendor,
        undefinedFallback: t('tools.user-agent-parser.deviceVendorFallback'),
      },
    ],
  },
  {
    heading: t('tools.user-agent-parser.cpu'),
    icon: Cpu,
    content: [
      {
        label: t('tools.user-agent-parser.architecture'),
        getValue: block => block?.cpu.architecture,
        undefinedFallback: t('tools.user-agent-parser.cpuArchitectureFallback'),
      },
    ],
  },
];
</script>

<template>
  <div>
    <c-input-text
      v-model:value="ua"
      :label="t('tools.user-agent-parser.label')"
      multiline
      :placeholder="t('tools.user-agent-parser.placeholder')"
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
