<template>
  <div>
    <n-space class="labels" item-style="flex: 1 1 0" style="width: 100%" align="center">
      <div style="text-align: left">Previous</div>
      <div style="text-align: center">Current OTP</div>
      <div style="text-align: right">Next</div>
    </n-space>
    <n-input-group>
      <n-tooltip trigger="hover" placement="bottom">
        <template #trigger>
          <n-button secondary @click.prevent="copyPrevious(tokens.previous)">{{ tokens.previous }}</n-button>
        </template>
        <div>{{ previousCopied ? 'Copied !' : 'Copy previous OTP' }}</div>
      </n-tooltip>
      <n-tooltip trigger="hover" placement="bottom">
        <template #trigger>
          <n-button tertiary type="primary" class="current-otp" @click.prevent="copyCurrent(tokens.current)">
            {{ tokens.current }}
          </n-button>
        </template>
        <div>{{ currentCopied ? 'Copied !' : 'Copy current OTP' }}</div>
      </n-tooltip>
      <n-tooltip trigger="hover" placement="bottom">
        <template #trigger>
          <n-button secondary @click.prevent="copyNext(tokens.next)">{{ tokens.next }}</n-button>
        </template>
        <div>{{ nextCopied ? 'Copied !' : 'Copy next OTP' }}</div>
      </n-tooltip>
    </n-input-group>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core';
import { toRefs } from 'vue';

const { copy: copyPrevious, copied: previousCopied } = useClipboard();
const { copy: copyCurrent, copied: currentCopied } = useClipboard();
const { copy: copyNext, copied: nextCopied } = useClipboard();

const props = defineProps<{ tokens: { previous: string; current: string; next: string } }>();
const { tokens } = toRefs(props);
</script>

<style scoped lang="less">
.current-otp {
  font-size: 22px;
  flex: 1 0 35% !important;
}

.n-button {
  height: 45px;
}

.labels {
  div {
    text-align: center;
    padding: 0 2px 6px 2px;
    line-height: 1.25;
  }
}

.n-input-group > * {
  flex: 1 0 0;
}
</style>
