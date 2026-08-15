import { type Ref, computed, onScopeDispose, ref, shallowRef, watch } from 'vue';
import { type HtmlFormatTaskResult, HtmlFormatWorkerClient } from './html-wysiwyg-editor.worker-client';
import {
  HTML_AUTO_FORMAT_MAX_BYTES,
  HTML_FORMAT_MAX_BYTES,
  type HtmlFormatTask,
  toHtmlFormatTaskError,
} from './html-wysiwyg-editor.worker.protocol';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';

export { HTML_AUTO_FORMAT_MAX_BYTES, HTML_FORMAT_MAX_BYTES } from './html-wysiwyg-editor.worker.protocol';

export const HTML_FORMAT_DEBOUNCE_MS = 250;

export type HtmlFormattingStatus =
  | 'idle'
  | 'scheduled'
  | 'formatting'
  | 'ready'
  | 'manual'
  | 'limit'
  | 'error';

export interface HtmlFormatClient {
  run: (task: HtmlFormatTask) => Promise<HtmlFormatTaskResult>
  cancel: (message?: string) => void
  dispose: () => void
}

export interface HtmlFormattingDependencies {
  client?: HtmlFormatClient
  debounceMs?: number
}

export function useHtmlFormatting(
  source: Ref<string>,
  dependencies: HtmlFormattingDependencies = {},
) {
  const client = dependencies.client ?? new HtmlFormatWorkerClient();
  const debounceMs = dependencies.debounceMs ?? HTML_FORMAT_DEBOUNCE_MS;
  const formattedHtml = ref('');
  const error = ref('');
  const status = shallowRef<HtmlFormattingStatus>('idle');
  const statusMessage = ref('Start editing to generate formatted HTML.');
  const isFormatting = computed(() => status.value === 'scheduled' || status.value === 'formatting');
  let timer: ReturnType<typeof globalThis.setTimeout> | undefined;
  let revision = 0;
  let initialized = false;
  let disposed = false;

  if (!Number.isSafeInteger(debounceMs) || debounceMs < 0 || debounceMs > 5_000) {
    throw new RangeError('HTML formatting debounce must be a whole number between 0 and 5,000 ms.');
  }

  function clearTimer(): void {
    if (timer !== undefined) {
      globalThis.clearTimeout(timer);
      timer = undefined;
    }
  }

  function resetOutput(): void {
    formattedHtml.value = '';
    error.value = '';
  }

  function validateSnapshot(snapshot: string): 'empty' | 'automatic' | 'manual' | 'limit' {
    if (snapshot === '') {
      return 'empty';
    }
    if (exceedsUtf8ByteLimit(snapshot, HTML_FORMAT_MAX_BYTES)) {
      return 'limit';
    }
    return exceedsUtf8ByteLimit(snapshot, HTML_AUTO_FORMAT_MAX_BYTES) ? 'manual' : 'automatic';
  }

  function setNonRunningState(snapshot: string): boolean {
    const validation = validateSnapshot(snapshot);
    if (validation === 'empty') {
      status.value = 'idle';
      statusMessage.value = 'Start editing to generate formatted HTML.';
      return true;
    }
    if (validation === 'limit') {
      const message = `HTML formatting is limited to ${HTML_FORMAT_MAX_BYTES.toLocaleString('en')} UTF-8 bytes.`;
      error.value = message;
      status.value = 'limit';
      statusMessage.value = message;
      return true;
    }
    if (validation === 'manual') {
      status.value = 'manual';
      statusMessage.value = `This document exceeds ${HTML_AUTO_FORMAT_MAX_BYTES.toLocaleString('en')} UTF-8 bytes. Select Format HTML to process it once.`;
      return true;
    }
    return false;
  }

  async function runSnapshot(snapshot: string, requestedRevision: number): Promise<void> {
    if (disposed || requestedRevision !== revision) {
      return;
    }

    status.value = 'formatting';
    statusMessage.value = 'Formatting HTML in a background worker…';
    try {
      const result = await client.run({ html: snapshot });
      if (disposed || requestedRevision !== revision || source.value !== snapshot) {
        return;
      }
      formattedHtml.value = result.value;
      status.value = 'ready';
      statusMessage.value = `Formatted HTML is ready (${Math.max(0, Math.round(result.elapsedMs))} ms).`;
    }
    catch (caught) {
      if (disposed || requestedRevision !== revision) {
        return;
      }
      const taskError = toHtmlFormatTaskError(caught);
      if (taskError.code === 'cancelled') {
        status.value = 'idle';
        statusMessage.value = 'HTML formatting cancelled.';
        return;
      }
      error.value = taskError.message;
      status.value = taskError.code === 'limit' ? 'limit' : 'error';
      statusMessage.value = taskError.message;
    }
  }

  function schedule(snapshot: string): void {
    const requestedRevision = ++revision;
    clearTimer();
    client.cancel('HTML formatting cancelled because the document changed.');
    resetOutput();
    if (setNonRunningState(snapshot)) {
      initialized = true;
      return;
    }

    status.value = 'scheduled';
    statusMessage.value = 'Waiting for typing to pause before formatting HTML…';
    const delay = initialized ? debounceMs : 0;
    initialized = true;
    timer = globalThis.setTimeout(() => {
      timer = undefined;
      void runSnapshot(snapshot, requestedRevision);
    }, delay);
  }

  async function formatNow(): Promise<void> {
    const snapshot = source.value;
    const requestedRevision = ++revision;
    clearTimer();
    client.cancel('HTML formatting replaced by an explicit request.');
    resetOutput();
    const validation = validateSnapshot(snapshot);
    if (validation === 'empty' || validation === 'limit') {
      setNonRunningState(snapshot);
      return;
    }
    await runSnapshot(snapshot, requestedRevision);
  }

  function cancelFormatting(): void {
    ++revision;
    clearTimer();
    client.cancel();
    resetOutput();
    status.value = 'idle';
    statusMessage.value = 'HTML formatting cancelled.';
  }

  watch(source, schedule, { immediate: true });

  onScopeDispose(() => {
    disposed = true;
    ++revision;
    clearTimer();
    resetOutput();
    client.dispose();
  });

  return {
    cancelFormatting,
    error,
    formatNow,
    formattedHtml,
    isFormatting,
    status,
    statusMessage,
  };
}
