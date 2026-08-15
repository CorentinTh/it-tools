import type { WatchSource } from 'vue';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';
import { BoundedTextTaskError, type BoundedTextWorkerClient } from '@/utils/bounded-text-task';

export type BoundedTransformStatus = 'idle' | 'pending' | 'running' | 'success' | 'cancelled' | 'timeout' | 'error';

export interface UseBoundedTextTransformOptions<TTask> {
  allowEmptySource?: boolean
  client: BoundedTextWorkerClient<TTask>
  createTask: () => TTask
  debounceMs: number
  label: string
  liveMaxBytes: number
  maxInputBytes: number
  source: Ref<string>
  watchSources: WatchSource<unknown>[]
}

export function useBoundedTextTransform<TTask>({
  allowEmptySource = false,
  client,
  createTask,
  debounceMs,
  label,
  liveMaxBytes,
  maxInputBytes,
  source,
  watchSources,
}: UseBoundedTextTransformOptions<TTask>) {
  const output = shallowRef('');
  const requiresExplicitRun = ref(false);
  const state = reactive<{ message: string; status: BoundedTransformStatus }>({ message: '', status: 'idle' });
  let timer: ReturnType<typeof globalThis.setTimeout> | undefined;
  let requestId = 0;

  const isRunning = computed(() => state.status === 'running');
  const hasError = computed(() => state.status === 'error' || state.status === 'timeout');

  function clearTimer(): void {
    if (timer !== undefined) {
      globalThis.clearTimeout(timer);
      timer = undefined;
    }
  }

  async function run(): Promise<void> {
    clearTimer();
    if (!allowEmptySource && source.value === '') {
      output.value = '';
      state.status = 'idle';
      state.message = '';
      return;
    }

    const currentRequest = ++requestId;
    state.status = 'running';
    state.message = `${label} is running…`;
    try {
      const result = await client.run(createTask());
      if (currentRequest !== requestId) {
        return;
      }
      output.value = result.value;
      state.status = 'success';
      state.message = `${label} completed in ${result.elapsedMs < 1_000 ? `${Math.round(result.elapsedMs)} ms` : `${(result.elapsedMs / 1_000).toFixed(2)} s`}.`;
    }
    catch (error) {
      if (currentRequest !== requestId) {
        return;
      }
      const taskError = error instanceof BoundedTextTaskError
        ? error
        : new BoundedTextTaskError('processing', `${label} failed.`);
      state.status = taskError.code === 'timeout' ? 'timeout' : taskError.code === 'cancelled' ? 'cancelled' : 'error';
      state.message = output.value === '' ? taskError.message : `${taskError.message} The previous result remains available.`;
    }
  }

  function schedule(): void {
    clearTimer();
    ++requestId;
    client.cancel(`${label} was cancelled because its input or options changed.`);

    if (!allowEmptySource && source.value === '') {
      output.value = '';
      requiresExplicitRun.value = false;
      state.status = 'idle';
      state.message = '';
      return;
    }

    // Keep input-event work bounded. An over-limit UTF-16 length is a cheap,
    // conclusive rejection; ambiguous UTF-8 sizes are checked by the worker
    // when the user explicitly starts a large task.
    if (source.value.length > maxInputBytes) {
      requiresExplicitRun.value = true;
      state.status = 'error';
      state.message = `${label} is limited to ${maxInputBytes.toLocaleString('en')} UTF-8 bytes.`;
      return;
    }

    requiresExplicitRun.value = exceedsUtf8ByteLimit(source.value, liveMaxBytes);
    state.status = 'pending';
    if (requiresExplicitRun.value) {
      state.message = `Large input runs only on request. Select Run ${label}.`;
      return;
    }

    state.message = `Waiting to run ${label}…`;
    timer = globalThis.setTimeout(() => {
      timer = undefined;
      run();
    }, debounceMs);
  }

  function cancel(): void {
    clearTimer();
    ++requestId;
    client.cancel();
    state.status = 'cancelled';
    state.message = `${label} cancelled. The previous result remains available.`;
  }

  watch(watchSources, schedule, { flush: 'post', immediate: true });
  onUnmounted(() => {
    clearTimer();
    ++requestId;
    client.dispose();
  });

  return { cancel, hasError, isRunning, output, requiresExplicitRun, run, state };
}
