<template>
  <div>
    <n-grid :x-gap="12" :y-gap="8" cols="1 s:2" responsive="screen">
      <n-gi v-for="{ heading, icon, content } in sections" :key="heading">
        <c-card h-full>
          <n-page-header>
            <template #title>
              {{ heading }}
            </template>
            <template v-if="icon" #avatar>
              <n-icon size="30" :component="icon" :depth="3" />
            </template>
          </n-page-header>

          <n-space mt-5>
            <span v-for="{ label, getValue } in content" :key="label">
              <n-tooltip v-if="getValue(userAgentInfo)" trigger="hover">
                <template #trigger>
                  <n-tag type="success" size="large" round :bordered="false">
                    {{ getValue(userAgentInfo) }}
                  </n-tag>
                </template>
                {{ label }}
              </n-tooltip>
            </span>
          </n-space>
          <n-space vertical>
            <span v-for="{ label, getValue, undefinedFallback } in content" :key="label">
              <n-text v-if="getValue(userAgentInfo) === undefined" depth="3">{{ undefinedFallback }}</n-text>
            </span>
          </n-space>
        </c-card>
      </n-gi>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import { UAParser } from 'ua-parser-js';
import type { UserAgentResultSection } from './user-agent-parser.types';

const props = defineProps<{
  userAgentInfo?: UAParser.IResult;
  sections: UserAgentResultSection[];
}>();
const { userAgentInfo, sections } = toRefs(props);
</script>
