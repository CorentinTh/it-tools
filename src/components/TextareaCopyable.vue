<script setup lang="ts">
import { Copy } from '@vicons/tabler';
import { useElementSize } from '@vueuse/core';
import hljs from 'highlight.js/lib/core';
import jsonHljs from 'highlight.js/lib/languages/json';
import sqlHljs from 'highlight.js/lib/languages/sql';
import xmlHljs from 'highlight.js/lib/languages/xml';
import yamlHljs from 'highlight.js/lib/languages/yaml';
import iniHljs from 'highlight.js/lib/languages/ini';
import markdownHljs from 'highlight.js/lib/languages/markdown';
import { MAX_HIGHLIGHTED_OUTPUT_BYTES } from './TextareaCopyable.model';
import { useCopy } from '@/composable/copy';
import { exceedsUtf8ByteLimit, truncateUtf8ToByteLimit } from '@/utils/utf8';

const props = withDefaults(
  defineProps<{
    value: string
    followHeightOf?: HTMLElement | null
    language?: string
    largePreviewBytes?: number
    copyPlacement?: 'top-right' | 'bottom-right' | 'outside' | 'none'
    copyMessage?: string
  }>(),
  {
    followHeightOf: null,
    language: 'txt',
    largePreviewBytes: MAX_HIGHLIGHTED_OUTPUT_BYTES,
    copyPlacement: 'top-right',
    copyMessage: 'Copy to clipboard',
  },
);
hljs.registerLanguage('sql', sqlHljs);
hljs.registerLanguage('json', jsonHljs);
hljs.registerLanguage('html', xmlHljs);
hljs.registerLanguage('xml', xmlHljs);
hljs.registerLanguage('yaml', yamlHljs);
hljs.registerLanguage('toml', iniHljs);
hljs.registerLanguage('markdown', markdownHljs);

const { value, language, followHeightOf, copyPlacement, copyMessage } = toRefs(props);
const { height } = useElementSize(followHeightOf);
const followedMinHeight = computed(() => height.value > 0 ? Math.max(height.value - 30, 0) : undefined);
const usePlainLargeOutput = computed(() => exceedsUtf8ByteLimit(value.value, MAX_HIGHLIGHTED_OUTPUT_BYTES));
const boundedLargePreviewBytes = computed(() => (
  Number.isSafeInteger(props.largePreviewBytes) && props.largePreviewBytes >= 0
    ? Math.min(props.largePreviewBytes, MAX_HIGHLIGHTED_OUTPUT_BYTES)
    : MAX_HIGHLIGHTED_OUTPUT_BYTES
));
const plainLargeOutputPreview = computed(() => (
  usePlainLargeOutput.value
    ? truncateUtf8ToByteLimit(value.value, boundedLargePreviewBytes.value)
    : value.value
));

const { copy, isJustCopied } = useCopy({ source: value, createToast: false });
const tooltipText = computed(() => isJustCopied.value ? 'Copied!' : copyMessage.value);
</script>

<template>
  <div style="overflow-x: hidden; width: 100%">
    <c-card relative>
      <n-scrollbar
        x-scrollable
        trigger="none"
        :style="{ minHeight: followedMinHeight === undefined ? undefined : `${followedMinHeight}px` }"
      >
        <div
          v-if="usePlainLargeOutput"
          data-test-id="large-output-notice"
          role="status"
          mb-2
          text-xs
          op-70
        >
          Syntax highlighting is disabled above {{ MAX_HIGHLIGHTED_OUTPUT_BYTES.toLocaleString('en') }} UTF-8 bytes. The preview is limited to {{ boundedLargePreviewBytes.toLocaleString('en') }} bytes; Copy keeps the complete output.
        </div>
        <textarea
          v-if="usePlainLargeOutput"
          :value="plainLargeOutputPreview"
          data-test-id="area-content"
          class="plain-large-output"
          aria-label="Plain text output"
          readonly
        />
        <n-config-provider v-else :hljs="hljs">
          <n-code :code="value" :language="language" :trim="false" data-test-id="area-content" />
        </n-config-provider>
      </n-scrollbar>
      <div
        v-if="value && (copyPlacement === 'top-right' || copyPlacement === 'bottom-right')"
        data-test-id="copy-overlay"
        absolute
        right-10px
        :style="copyPlacement === 'top-right' ? { top: '10px' } : { bottom: '10px' }"
      >
        <c-tooltip :tooltip="tooltipText" position="left">
          <c-button circle important:h-10 important:w-10 @click="copy()">
            <n-icon size="22" :component="Copy" />
          </c-button>
        </c-tooltip>
      </div>
    </c-card>
    <div v-if="value && copyPlacement === 'outside'" data-test-id="copy-outside" mt-4 flex justify-center>
      <c-button @click="copy()">
        {{ tooltipText }}
      </c-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
::v-deep(.n-scrollbar) {
  padding-bottom: 10px;
  margin-bottom: -10px;
}

.plain-large-output {
  display: block;
  box-sizing: border-box;
  width: 100%;
  min-height: 12rem;
  margin: 0;
  padding: 0;
  border: 0;
  resize: vertical;
  background: transparent;
  color: inherit;
  font-family: monospace;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre;
}
</style>
