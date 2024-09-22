<script setup lang="ts">
import JSStack from 'jsstack.js';
import NetStack from 'netstack.js';
import domtoimage from 'dom-to-image-more';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { useStyleStore } from '@/stores/style.store';
import { useCopy } from '@/composable/copy';

const styleStore = useStyleStore();

const stackType = useQueryParamOrStorage<'net' | 'js'>({ name: 'type', storageName: 'stackfmt:type', defaultValue: 'net' });
const stackTrace = ref('');
const formatedStackTrace = ref<HTMLElement>();

const stackTraceText = ref('');
watchEffect(() => {
  if (!formatedStackTrace.value) {
    return;
  }
  try {
    if (stackType.value === 'js') {
      formatedStackTrace.value.textContent = stackTrace.value;
      JSStack('.stacktrace');
    }
    else if (stackType.value === 'net') {
      formatedStackTrace.value.innerText = stackTrace.value;
      const _ = new NetStack(formatedStackTrace.value, { prettyprint: true });
    }
    stackTraceText.value = formatedStackTrace.value.innerText;
  }
  catch {}
});

const stackTraceMarkdown = computed(() => {
  const lang = stackType.value === 'net' ? 'csharp' : 'javascript';
  return `\`\`\`${lang}\n${formatedStackTrace.value?.innerText}\n\`\`\``;
});

const { copy: copyText } = useCopy({ source: stackTraceText, text: 'Formatted stacktrace copied to the clipboard' });
const { copy: copyMarkdown } = useCopy({ source: stackTraceMarkdown, text: 'Markdown Formatted stacktrace copied to the clipboard' });

async function downloadAsPNG() {
  const dataUrl = await domtoimage.toPng(formatedStackTrace.value, { bgcolor: styleStore.isDarkTheme ? '#333' : '#fff' });
  const link = document.createElement('a');
  link.download = 'stacktrace.png';
  link.href = dataUrl;
  link.click();
}
</script>

<template>
  <div>
    <n-radio-group v-model:value="stackType" name="radiogroup" mb-2 flex justify-center>
      <n-space>
        <n-radio
          value="net"
          label=".Net"
        />
        <n-radio
          value="js"
          label="Javascript"
        />
      </n-space>
    </n-radio-group>

    <c-input-text
      v-model:value="stackTrace"
      label="Stacktrace"
      placeholder="Paste your stacktrace here.."
      multiline
      rows="5"
    />

    <n-divider />

    <pre ref="formatedStackTrace" class="stacktrace" style="padding: 20px;" />

    <div v-if="stackTraceText" flex justify-center gap-1>
      <c-button @click="copyText()">
        Copy Formatted (Text)
      </c-button>
      <c-button @click="copyMarkdown()">
        Copy Formatted (Markdown)
      </c-button>
      <c-button @click="downloadAsPNG()">
        Download as PNG
      </c-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
::v-deep(.stacktrace) {
pre, code {background-color:#333 !important; color: #fff !important;}
.st-type {color: #0a8472; font-weight: bolder;}
.st-method {color: #70c9ba; font-weight: bolder;}
.st-frame-params {color: #ffffff; font-weight: normal;}
.st-param-type {color: #0a8472;}
.st-param-name {color: #ffffff;}
.st-file {color:#f8b068;}
.st-line {color:#ff4f68;}
.st-methodName {color: #70c9ba;font-weight: bolder;}
.st-column {color: #f8b068;}
.st-lineNumber {color: #ff4f68;}
.st-fileName {color: #85dbff;}
}
</style>
