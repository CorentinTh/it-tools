<script setup lang="ts">
import { useCopy } from '@/composable/copy';

const props = defineProps<{ tokens: { previous: string; current: string; next: string } }>();
const { copy: copyPrevious, isJustCopied: previousCopied } = useCopy({ createToast: false });
const { copy: copyCurrent, isJustCopied: currentCopied } = useCopy({ createToast: false });
const { copy: copyNext, isJustCopied: nextCopied } = useCopy({ createToast: false });

const { t } = useI18n();
const { tokens } = toRefs(props);
</script>

<template>
  <div>
    <div mb-5px w-full flex items-center>
      <div flex-1 text-left>
        {{ t('tools.otp-generator.previous') }}
      </div>
      <div flex-1 text-center>
        {{ t('tools.otp-generator.currentOTP') }}
      </div>
      <div flex-1 text-right>
        Next
      </div>
    </div>
    <div flex items-center>
      <c-tooltip :tooltip="previousCopied ? t('tools.otp-generator.copied') : t('tools.otp-generator.copyPreviousOTP')" position="bottom" flex-1>
        <c-button data-test-id="previous-otp" w-full important:h-12 important:rounded-r-none important:font-mono @click.prevent="copyPrevious(tokens.previous)">
          {{ tokens.previous }}
        </c-button>
      </c-tooltip>
      <c-tooltip :tooltip="currentCopied ? t('tools.otp-generator.copied') : t('tools.otp-generator.copyCurrentOTP')" position="bottom" flex-1 flex-basis-5xl>
        <c-button
          data-test-id="current-otp" w-full important:border-x="1px solid gray op-40" important:h-12 important:rounded-0 important:text-22px @click.prevent="copyCurrent(tokens.current)"
        >
          {{ tokens.current }}
        </c-button>
      </c-tooltip>
      <c-tooltip :tooltip="nextCopied ? t('tools.otp-generator.copied') : t('tools.otp-generator.copyNextOTP')" position="bottom" flex-1>
        <c-button data-test-id="next-otp" w-full important:h-12 important:rounded-l-none @click.prevent="copyNext(tokens.next)">
          {{ tokens.next }}
        </c-button>
      </c-tooltip>
    </div>
  </div>
</template>
