import { effectScope, nextTick, ref } from 'vue';
import { flushPromises } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  HTML_AUTO_FORMAT_MAX_BYTES,
  HTML_FORMAT_DEBOUNCE_MS,
  HTML_FORMAT_MAX_BYTES,
  type HtmlFormatClient,
  useHtmlFormatting,
} from './useHtmlFormatting';

function deferred<T>() {
  let resolveDeferred!: (value: T) => void;
  let rejectDeferred!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolve, reject) => {
    resolveDeferred = resolve;
    rejectDeferred = reject;
  });
  return { promise, reject: rejectDeferred, resolve: resolveDeferred };
}

function createClient(run: HtmlFormatClient['run']): HtmlFormatClient {
  return {
    cancel: vi.fn(),
    dispose: vi.fn(),
    run,
  };
}

afterEach(() => {
  vi.useRealTimers();
});

describe('useHtmlFormatting', () => {
  it('debounces small edits and formats only the newest snapshot', async () => {
    vi.useFakeTimers();
    const source = ref('');
    const client = createClient(vi.fn(async ({ html }) => ({ elapsedMs: 4, value: `formatted:${html}` })));
    const scope = effectScope();
    const formatting = scope.run(() => useHtmlFormatting(source, { client }))!;

    source.value = '<p>first</p>';
    await nextTick();
    source.value = '<p>second</p>';
    await nextTick();

    await vi.advanceTimersByTimeAsync(HTML_FORMAT_DEBOUNCE_MS - 1);
    expect(client.run).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);

    expect(client.run).toHaveBeenCalledTimes(1);
    expect(client.run).toHaveBeenCalledWith({ html: '<p>second</p>' });
    expect(formatting.formattedHtml.value).toBe('formatted:<p>second</p>');
    scope.stop();
  });

  it('requires an explicit action for a large document below the hard limit', async () => {
    vi.useFakeTimers();
    const source = ref('x'.repeat(HTML_AUTO_FORMAT_MAX_BYTES + 1));
    const client = createClient(vi.fn(async ({ html }) => ({ elapsedMs: 8, value: `formatted:${html}` })));
    const scope = effectScope();
    const formatting = scope.run(() => useHtmlFormatting(source, { client }))!;

    await nextTick();
    await vi.runAllTimersAsync();
    expect(client.run).not.toHaveBeenCalled();
    expect(formatting.status.value).toBe('manual');

    await formatting.formatNow();
    expect(client.run).toHaveBeenCalledTimes(1);
    expect(formatting.status.value).toBe('ready');
    scope.stop();
  });

  it('rejects oversized documents before starting a worker', async () => {
    const source = ref('x'.repeat(HTML_FORMAT_MAX_BYTES + 1));
    const client = createClient(vi.fn());
    const scope = effectScope();
    const formatting = scope.run(() => useHtmlFormatting(source, { client }))!;

    await nextTick();
    await formatting.formatNow();

    expect(client.run).not.toHaveBeenCalled();
    expect(formatting.status.value).toBe('limit');
    expect(formatting.error.value).toContain(HTML_FORMAT_MAX_BYTES.toLocaleString('en'));
    scope.stop();
  });

  it('does not let a cancelled result overwrite a newer formatted document', async () => {
    vi.useFakeTimers();
    const first = deferred<{ elapsedMs: number; value: string }>();
    const second = deferred<{ elapsedMs: number; value: string }>();
    const source = ref('');
    const client = createClient(vi.fn()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise));
    const scope = effectScope();
    const formatting = scope.run(() => useHtmlFormatting(source, { client }))!;

    source.value = '<p>old</p>';
    await nextTick();
    await vi.advanceTimersByTimeAsync(HTML_FORMAT_DEBOUNCE_MS);
    source.value = '<p>new</p>';
    await nextTick();
    await vi.advanceTimersByTimeAsync(HTML_FORMAT_DEBOUNCE_MS);

    second.resolve({ elapsedMs: 2, value: '<p>new</p>\n' });
    await flushPromises();
    first.resolve({ elapsedMs: 10, value: '<p>old</p>\n' });
    await flushPromises();

    expect(formatting.formattedHtml.value).toBe('<p>new</p>\n');
    expect(client.cancel).toHaveBeenCalled();
    scope.stop();
  });

  it('cancels scheduled work and disposes the worker client with its scope', async () => {
    vi.useFakeTimers();
    const source = ref('');
    const client = createClient(vi.fn());
    const scope = effectScope();
    scope.run(() => useHtmlFormatting(source, { client }));

    source.value = '<p>secret</p>';
    await nextTick();
    scope.stop();
    await vi.runAllTimersAsync();

    expect(client.run).not.toHaveBeenCalled();
    expect(client.dispose).toHaveBeenCalledTimes(1);
  });
});
