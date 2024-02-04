<script setup lang="ts">
import { UAParser } from 'ua-parser-js';
import { Adjustments, Browser, Cpu, Devices, Engine } from '@vicons/tabler';
import UserAgentResultCards from './user-agent-result-cards.vue';
import type { UserAgentResultSection } from './user-agent-parser.types';
import { withDefaultOnError } from '@/utils/defaults';

const ua = ref(navigator.userAgent as string);

// 如果 ua 字段中没有输入，则返回 UAParser.IResult 类型的空对象，否则 UAParser 返回当前浏览器的值。 
// 这很令人困惑，因为显示的结果是空的 UA 字段值。
function getUserAgentInfo(userAgent: string) {
  return userAgent.trim().length > 0
    ? UAParser(userAgent.trim())
    : ({ ua: '', browser: {}, cpu: {}, device: {}, engine: {}, os: {} } as UAParser.IResult);
}
const userAgentInfo = computed(() => withDefaultOnError(() => getUserAgentInfo(ua.value), undefined));

const sections: UserAgentResultSection[] = [
  {
    heading: '浏览器',
    icon: Browser,
    content: [
      {
        label: '名称',
        getValue: block => block?.browser.name,
        undefinedFallback: '-',
      },
      {
        label: '版本号',
        getValue: block => block?.browser.version,
        undefinedFallback: '-',
      },
    ],
  },
  {
    heading: '引擎',
    icon: Engine,
    content: [
      {
        label: '名称',
        getValue: block => block?.engine.name,
        undefinedFallback: '-',
      },
      {
        label: '版本号',
        getValue: block => block?.engine.version,
        undefinedFallback: '-',
      },
    ],
  },
  {
    heading: '操作系统',
    icon: Adjustments,
    content: [
      {
        label: '名称',
        getValue: block => block?.os.name,
        undefinedFallback: '-',
      },
      {
        label: '版本号',
        getValue: block => block?.os.version,
        undefinedFallback: '-',
      },
    ],
  },
  {
    heading: '设备',
    icon: Devices,
    content: [
      {
        label: '型号',
        getValue: block => block?.device.model,
        undefinedFallback: '-',
      },
      {
        label: '类型',
        getValue: block => block?.device.type,
        undefinedFallback: '-',
      },
      {
        label: '制造商',
        getValue: block => block?.device.vendor,
        undefinedFallback: '-',
      },
    ],
  },
  {
    heading: 'CPU',
    icon: Cpu,
    content: [
      {
        label: '架构',
        getValue: block => block?.cpu.architecture,
        undefinedFallback: '-',
      },
    ],
  },
];
</script>

<template>
  <div>
    <c-input-text
      v-model:value="ua"
      label="User-agent 字符串"
      multiline
      placeholder="请输入 User-agent 字符串"
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
