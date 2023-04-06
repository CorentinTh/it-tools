<template>
  <div>
    <n-grid :x-gap="12" :y-gap="8" cols="1 s:2" responsive="screen">
      <n-gi v-for="{ heading, icon, content } in sections" :key="heading">
        <n-card style="height: 100%">
          <n-page-header>
            <template #title>
              {{ heading }}
            </template>
            <template v-if="icon" #avatar>
              <n-icon size="30" :component="icon" :depth="3" />
            </template>
          </n-page-header>

          <br />

          <n-space>
            <span v-for="{ label, getValue } in content" :key="label">
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-tag v-if="getValue(userAgentInfo)" type="success" size="large" round :bordered="false">
                    {{ getValue(userAgentInfo) }}
                  </n-tag>
                  <span v-else />
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
        </n-card>
      </n-gi>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs } from 'vue';
import { UAParser } from 'ua-parser-js';

const props = defineProps<{
  userAgentInfo?: UAParser.IResult;
  sections: {
    heading: string;
    icon?: PropType<any>;
    content: {
      label: string;
      getValue: (blocks: UAParser.IResult) => string | undefined;
      undefinedFallback?: string;
    }[];
  }[];
}>();
const { userAgentInfo, sections } = toRefs(props);
</script>
