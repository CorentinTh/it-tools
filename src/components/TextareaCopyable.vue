<script setup lang="ts">
import { Copy } from '@vicons/tabler';
import { useClipboard, useElementSize } from '@vueuse/core';
import hljs from 'highlight.js/lib/core';
import jsonHljs from 'highlight.js/lib/languages/json';
import sqlHljs from 'highlight.js/lib/languages/sql';
import xmlHljs from 'highlight.js/lib/languages/xml';
import yamlHljs from 'highlight.js/lib/languages/yaml';
import iniHljs from 'highlight.js/lib/languages/ini';

const props = withDefaults(
  defineProps<{
    value: string
    followHeightOf?: HTMLElement | null
    language?: string
    copyPlacement?: 'top-right' | 'bottom-right' | 'outside' | 'none'
    copyMessage?: string
  }>(),
  {
    followHeightOf: null,
    language: 'txt',
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

const { value, language, followHeightOf, copyPlacement, copyMessage } = toRefs(props);
const { height } = followHeightOf.value ? useElementSize(followHeightOf) : { height: ref(null) };

const { copy } = useClipboard({ source: value });
const tooltipText = ref(copyMessage.value);

function onCopyClicked() {
  copy();
  tooltipText.value = 'Copied !';

  setTimeout(() => {
    tooltipText.value = copyMessage.value;
  }, 2000);
}
</script>

<template>
  <div style="overflow-x: hidden; width: 100%">
    <c-card class="result-card">
      <n-scrollbar
        x-scrollable
        trigger="none"
        :style="height ? `min-height: ${height - 40 /* card padding */ + 10 /* negative margin compensation */}px` : ''"
      >
        <n-config-provider :hljs="hljs">
          <n-code :code="value" :language="language" :trim="false" data-test-id="area-content" />
        </n-config-provider>
      </n-scrollbar>
      <n-tooltip v-if="value" trigger="hover">
        <template #trigger>
          <div class="copy-button" :class="[copyPlacement]">
            <c-button circle important:h-10 important:w-10 @click="onCopyClicked">
              <n-icon size="22" :component="Copy" />
            </c-button>
          </div>
        </template>
        <span>{{ tooltipText }}</span>
      </n-tooltip>
    </c-card>
    <div v-if="copyPlacement === 'outside'" mt-4 flex justify-center>
      <c-button @click="onCopyClicked">
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
.result-card {
  position: relative;
  .copy-button {
    position: absolute;
    opacity: 1;

    &.top-right {
      top: 10px;
      right: 10px;
    }

    &.bottom-right {
      bottom: 10px;
      right: 10px;
    }
    &.outside,
    &.none {
      display: none;
    }
  }
}
</style>
