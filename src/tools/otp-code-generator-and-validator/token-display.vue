<template>
  <div>
    <n-space class="labels" item-style="flex: 1 1 0" w-full align="center">
      <div style="text-align: left">Previous</div>
      <div style="text-align: center">Current OTP</div>
      <div style="text-align: right">Next</div>
    </n-space>
    <n-input-group>
      <n-tooltip trigger="hover" placement="bottom">
        <template #trigger>
          <c-button important:h-12 data-test-id="previous-otp" @click.prevent="copyPrevious(tokens.previous)">
            {{ tokens.previous }}
          </c-button>
        </template>
        <div>{{ previousCopied ? 'Copied !' : 'Copy previous OTP' }}</div>
      </n-tooltip>
      <n-tooltip trigger="hover" placement="bottom">
        <template #trigger>
          <c-button
            data-test-id="current-otp"
            class="current-otp"
            important:h-12
            @click.prevent="copyCurrent(tokens.current)"
          >
            {{ tokens.current }}
          </c-button>
        </template>
        <div>{{ currentCopied ? 'Copied !' : 'Copy current OTP' }}</div>
      </n-tooltip>
      <n-tooltip trigger="hover" placement="bottom">
        <template #trigger>
          <c-button important:h-12 data-test-id="next-otp" @click.prevent="copyNext(tokens.next)">{{
            tokens.next
          }}</c-button>
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
