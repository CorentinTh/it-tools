<script setup lang="ts">
import type { MermaidRenderResult } from './mermaid-renderer.service';
import { MERMAID_MAX_SOURCE_CHARACTERS, makeMermaidPreviewDocument } from './mermaid-diagram.policy';
import { MermaidRenderClient } from './mermaid-render.client';
import { useCopy } from '@/composable/copy';
import { downloadTextFile } from '@/composable/downloadText';

const EXAMPLE = `flowchart LR
  Browser[Browser input] --> Validate{Bounded?}
  Validate -->|yes| Render[Render safely]
  Validate -->|no| Reject[Show inert error]
  Render --> Export[SVG or PNG]`;

const source = ref(EXAMPLE);
const result = ref<MermaidRenderResult | null>(null);
const completedSource = ref('');
const error = ref('');
const status = ref('Ready. Nothing is rendered until you select Render diagram.');
const running = ref(false);
const exportingPng = ref(false);
const client = new MermaidRenderClient();
let operation = 0;

const svg = computed(() => result.value?.svg ?? '');
const previewDocument = computed(() => result.value ? makeMermaidPreviewDocument(result.value.svg) : '');
const stale = computed(() => Boolean(result.value && source.value !== completedSource.value));
const canRender = computed(() => !running.value && Boolean(source.value.trim()));
const { copy } = useCopy({ source: svg, text: 'Sanitized Mermaid SVG copied' });

watch(source, () => {
  error.value = '';
  if (running.value) {
    operation += 1;
    client.cancel();
    running.value = false;
    status.value = 'Source changed; the pending result will be ignored.';
  }
});

async function renderDiagram() {
  if (!canRender.value) {
    return;
  }
  const snapshot = source.value;
  const currentOperation = ++operation;
  running.value = true;
  error.value = '';
  status.value = 'Loading the lazy renderer and rendering one bounded diagram…';
  try {
    const next = await client.render(snapshot);
    if (operation !== currentOperation) {
      return;
    }
    result.value = next;
    completedSource.value = snapshot;
    status.value = `${next.kind} rendered in ${Math.round(next.elapsedMs).toLocaleString('en-US')} ms: ${next.elementCount.toLocaleString('en-US')} SVG elements, ${next.svgBytes.toLocaleString('en-US')} bytes.`;
  }
  catch (caught) {
    if (operation !== currentOperation || (caught instanceof DOMException && caught.name === 'AbortError')) {
      return;
    }
    error.value = caught instanceof Error ? caught.message : 'Mermaid rendering failed.';
    status.value = 'No new Mermaid result was accepted.';
  }
  finally {
    if (operation === currentOperation) {
      running.value = false;
    }
  }
}

function cancel() {
  operation += 1;
  client.cancel();
  running.value = false;
  status.value = 'Mermaid render cancelled; any eventual result will be ignored.';
}

function clearAll() {
  operation += 1;
  client.cancel();
  source.value = '';
  result.value = null;
  completedSource.value = '';
  error.value = '';
  status.value = 'Mermaid source and generated assets cleared.';
}

function downloadSvg() {
  if (!result.value) {
    return;
  }
  downloadTextFile({ content: result.value.svg, filename: 'mermaid-diagram.svg' });
}

async function downloadPng() {
  if (!result.value || exportingPng.value) {
    return;
  }
  exportingPng.value = true;
  error.value = '';
  try {
    const blob = await client.rasterize(result.value);
    const url = URL.createObjectURL(blob);
    try {
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'mermaid-diagram.png';
      anchor.click();
    }
    finally {
      URL.revokeObjectURL(url);
    }
  }
  catch (caught) {
    if (!(caught instanceof DOMException && caught.name === 'AbortError')) {
      error.value = caught instanceof Error ? caught.message : 'PNG export failed.';
    }
  }
  finally {
    exportingPng.value = false;
  }
}

onBeforeUnmount(() => {
  operation += 1;
  client.dispose();
  source.value = '';
  result.value = null;
  completedSource.value = '';
});
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Local explicit render with a restricted Mermaid surface">
      Source stays in this browser and is rendered only after you select Render diagram. This first safe subset supports Flowchart, Sequence, Class, State, and ER diagrams. Frontmatter/config directives, HTML labels, click/link behavior, user styles, and every URL are rejected. Nothing is stored, logged, sent to analytics, or placed in the page URL.
    </c-alert>

    <c-input-text
      v-model:value="source"
      label="Mermaid source"
      test-id="mermaid-source"
      raw-text
      monospace
      multiline
      :rows="16"
      :maxlength="MERMAID_MAX_SOURCE_CHARACTERS"
      spellcheck="false"
    />
    <div class="c-task-actions">
      <c-button type="primary" :disabled="!canRender" data-test-id="mermaid-render" @click="renderDiagram">
        {{ running ? 'Rendering…' : 'Render diagram' }}
      </c-button>
      <c-button v-if="running" data-test-id="mermaid-cancel" @click="cancel">
        Cancel
      </c-button>
      <c-button @click="clearAll">
        Clear
      </c-button>
    </div>

    <p class="c-task-status" role="status" aria-live="polite" data-test-id="mermaid-status">
      {{ status }}
    </p>
    <c-alert v-if="error" title="Mermaid render error" data-test-id="mermaid-error">
      {{ error }}
    </c-alert>
    <c-alert v-if="stale" title="Preview uses the previous source">
      Select Render diagram to replace it with the current source.
    </c-alert>
    <c-alert title="Isolation and resource bounds">
      Mermaid runs only on an explicit action under a 32 KiB source, 2,000-line, 200-edge, 5,000-SVG-element, 512 KiB sanitized-output, 8,192-unit viewBox, and eight-second acceptance policy. The dependency needs browser DOM APIs, so synchronous renderer code cannot be physically interrupted mid-call; Cancel, edits, Clear, and route leave invalidate pending asynchronous results. The sanitized preview is placed in a scriptless sandboxed iframe whose CSP blocks network, navigation, forms, media, and external resources.
    </c-alert>

    <c-card title="Sanitized diagram preview">
      <iframe
        v-if="result"
        class="mermaid-preview"
        title="Sanitized Mermaid diagram preview"
        sandbox=""
        referrerpolicy="no-referrer"
        :srcdoc="previewDocument"
        data-test-id="mermaid-preview"
      />
      <p v-else mb-0 op-70 data-test-id="mermaid-empty-preview">
        Render a valid supported diagram to create an isolated preview.
      </p>
    </c-card>
    <div class="c-task-actions">
      <c-button :disabled="!result" data-test-id="mermaid-copy-svg" @click="copy()">
        Copy SVG
      </c-button>
      <c-button :disabled="!result" data-test-id="mermaid-download-svg" @click="downloadSvg">
        Download SVG
      </c-button>
      <c-button :disabled="!result || exportingPng" data-test-id="mermaid-download-png" @click="downloadPng">
        {{ exportingPng ? 'Creating PNG…' : 'Download PNG' }}
      </c-button>
    </div>
  </div>
</template>

<style scoped>
.mermaid-preview {
  display: block;
  width: 100%;
  min-height: 28rem;
  border: 0;
  background: transparent;
}
</style>
