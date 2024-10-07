<script setup lang="ts">
import { Copy } from '@vicons/tabler';
import { useElementSize } from '@vueuse/core';
import hljs from 'highlight.js/lib/core';
import jsonHljs from 'highlight.js/lib/languages/json';
import sqlHljs from 'highlight.js/lib/languages/sql';
import xmlHljs from 'highlight.js/lib/languages/xml';
import yamlHljs from 'highlight.js/lib/languages/yaml';
import iniHljs from 'highlight.js/lib/languages/ini';
import bashHljs from 'highlight.js/lib/languages/bash';
import markdownHljs from 'highlight.js/lib/languages/markdown';
import jsHljs from 'highlight.js/lib/languages/javascript';
import cssHljs from 'highlight.js/lib/languages/css';
import goHljs from 'highlight.js/lib/languages/go';
import csharpHljs from 'highlight.js/lib/languages/csharp';
import { Base64 } from 'js-base64';
import { useCopy } from '@/composable/copy';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';

const props = withDefaults(
  defineProps<{
    value: string
    followHeightOf?: HTMLElement | null
    language?: string
    copyPlacement?: 'top-right' | 'bottom-right' | 'outside' | 'none'
    copyMessage?: string
    wordWrap?: boolean
    downloadFileName?: string
    downloadButtonText?: string
  }>(),
  {
    followHeightOf: null,
    language: 'txt',
    copyPlacement: 'top-right',
    copyMessage: 'Copy to clipboard',
    downloadFileName: '',
    downloadButtonText: 'Download',
  },
);
hljs.registerLanguage('sql', sqlHljs);
hljs.registerLanguage('json', jsonHljs);
hljs.registerLanguage('html', xmlHljs);
hljs.registerLanguage('xml', xmlHljs);
hljs.registerLanguage('yaml', yamlHljs);
hljs.registerLanguage('toml', iniHljs);
hljs.registerLanguage('bash', bashHljs);
hljs.registerLanguage('markdown', markdownHljs);
hljs.registerLanguage('css', cssHljs);
hljs.registerLanguage('javascript', jsHljs);
hljs.registerLanguage('go', goHljs);
hljs.registerLanguage('csharp', csharpHljs);

const { value, language, followHeightOf, copyPlacement, copyMessage, downloadFileName, downloadButtonText } = toRefs(props);
const { height } = followHeightOf.value ? useElementSize(followHeightOf) : { height: ref(null) };

const { copy, isJustCopied } = useCopy({ source: value, createToast: false });
const tooltipText = computed(() => isJustCopied.value ? 'Copied!' : copyMessage.value);

const valueBase64 = computed(() => Base64.encode(value.value));
const { download } = useDownloadFileFromBase64(
  {
    source: valueBase64,
    filename: downloadFileName,
  });
</script>

<template>
  <div style="overflow-x: hidden; width: 100%">
    <c-card relative>
      <n-scrollbar
        x-scrollable
        trigger="none"
        :style="height ? `min-height: ${height - 40 /* card padding */ + 10 /* negative margin compensation */}px` : ''"
      >
        <n-config-provider :hljs="hljs">
          <n-code :code="value" :language="language" :word-wrap="wordWrap" :trim="false" data-test-id="area-content" />
        </n-config-provider>
      </n-scrollbar>
      <div
        v-if="value && copyPlacement !== 'none'"
        absolute right-10px
        :top-10px="copyPlacement === 'top-right' ? '' : 'no'"
        :bottom-10px="copyPlacement === 'bottom-right' ? '' : 'no'"
      >
        <c-tooltip v-if="value && copyPlacement !== 'outside'" :tooltip="tooltipText" position="left">
          <c-button circle important:h-10 important:w-10 @click="copy()">
            <n-icon size="22" :component="Copy" />
          </c-button>
        </c-tooltip>
      </div>
    </c-card>
    <div v-if="copyPlacement === 'outside'" mt-4 flex justify-center>
      <c-button @click="copy()">
        {{ tooltipText }}
      </c-button>
    </div>
    <div v-if="downloadFileName !== '' && value !== ''" mt-5 flex justify-center>
      <c-button secondary @click="download">
        {{ downloadButtonText }}
      </c-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
::v-deep(.n-scrollbar) {
  padding-bottom: 10px;
  margin-bottom: -10px;
}
</style>
