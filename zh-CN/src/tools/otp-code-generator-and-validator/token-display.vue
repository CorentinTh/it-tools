<script setup lang="ts">
import { useCopy } from '@/composable/copy';

const props = defineProps<{ tokens: { previous: string; current: string; next: string } }>();
const { copy: copyCurrent, isJustCopied: currentCopied } = useCopy({ createToast: false });

const { tokens } = toRefs(props);
</script>

<template>
  <div>
    <div flex items-center>
      <c-tooltip :tooltip="currentCopied ? '令牌已复制到剪贴板' : '复制此令牌'" position="top" flex-1 flex-basis-5xl>
        <c-button
          data-test-id="current-otp" w-full important:h-48 important:rounded-0 important:text-48px @click.prevent="copyCurrent(tokens.current)"
        >
          {{ tokens.current }}
        </c-button>
      </c-tooltip>
    </div>
  </div>
</template>
