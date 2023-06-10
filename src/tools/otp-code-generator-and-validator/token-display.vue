<script setup lang="ts">
import { useClipboard } from '@vueuse/core';

const props = defineProps<{ tokens: { previous: string; current: string; next: string } }>();
const { copy: copyPrevious, copied: previousCopied } = useClipboard();
const { copy: copyCurrent, copied: currentCopied } = useClipboard();
const { copy: copyNext, copied: nextCopied } = useClipboard();

const { tokens } = toRefs(props);
</script>

<template>
  <div>
    <div class="labels" w-full flex items-center>
      <div flex-1 text-left>
        Previous
      </div>
      <div flex-1 text-center>
        Current OTP
      </div>
      <div flex-1 text-right>
        Next
      </div>
    </div>
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
          <c-button important:h-12 data-test-id="next-otp" @click.prevent="copyNext(tokens.next)">
            {{
              tokens.next
            }}
          </c-button>
        </template>
        <div>{{ nextCopied ? 'Copied !' : 'Copy next OTP' }}</div>
      </n-tooltip>
    </n-input-group>
  </div>
</template>

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
    padding: 0 2px 6px 2px;
    line-height: 1.25;
  }
}

.n-input-group > * {
  flex: 1 0 0;
}
</style>
