import { effectScope, nextTick, ref } from 'vue';
import { flushPromises } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { QR_CODE_MAX_INPUT_BYTES, useQRCode } from './useQRCode';

function deferred<T>() {
  let resolveDeferred!: (value: T) => void;
  let rejectDeferred!: (reason: unknown) => void;
  const promise = new Promise<T>((resolve, reject) => {
    resolveDeferred = resolve;
    rejectDeferred = reject;
  });
  return { promise, reject: rejectDeferred, resolve: resolveDeferred };
}

function mountQrCode(
  initialText: string,
  generate: (text: string) => Promise<string>,
  debounceMs = 25,
) {
  const text = ref(initialText);
  const scope = effectScope();
  const result = scope.run(() => useQRCode({
    text,
    color: { background: '#fff', foreground: '#000' },
  }, { debounceMs, generate }));
  if (!result) {
    throw new Error('QR code composable did not initialize.');
  }
  return { ...result, scope, text };
}

afterEach(() => {
  vi.useRealTimers();
});

describe('useQRCode ordered generation', () => {
  it('runs the initial value once and debounces rapid reactive changes to the latest snapshot', async () => {
    vi.useFakeTimers();
    const generate = vi.fn(async (text: string) => `data:${text}`);
    const qr = mountQrCode('initial', generate);

    await vi.advanceTimersByTimeAsync(0);
    expect(generate).toHaveBeenCalledTimes(1);
    expect(qr.qrcode.value).toBe('data:initial');

    qr.text.value = 'a';
    await nextTick();
    qr.text.value = 'ab';
    await nextTick();
    qr.text.value = 'latest';
    await nextTick();
    await vi.advanceTimersByTimeAsync(24);
    expect(generate).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(1);
    expect(generate).toHaveBeenCalledTimes(2);
    expect(generate).toHaveBeenLastCalledWith('latest', expect.any(Object));
    expect(qr.qrcode.value).toBe('data:latest');
    qr.scope.stop();
  });

  it('never lets a late older promise overwrite the latest QR code', async () => {
    vi.useFakeTimers();
    const first = deferred<string>();
    const latest = deferred<string>();
    const generate = vi.fn()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(latest.promise);
    const qr = mountQrCode('first', generate);

    await vi.advanceTimersByTimeAsync(0);
    qr.text.value = 'latest';
    await nextTick();
    await vi.advanceTimersByTimeAsync(25);

    latest.resolve('data:latest');
    await flushPromises();
    expect(qr.qrcode.value).toBe('data:latest');

    first.resolve('data:first');
    await flushPromises();
    expect(qr.qrcode.value).toBe('data:latest');
    qr.scope.stop();
  });

  it('clears stale output for empty input and rejects oversized UTF-8 input before generation', async () => {
    vi.useFakeTimers();
    const generate = vi.fn(async (text: string) => `data:${text}`);
    const qr = mountQrCode('ready', generate);
    await vi.advanceTimersByTimeAsync(0);
    expect(qr.qrcode.value).toBe('data:ready');

    qr.text.value = '';
    await nextTick();
    expect(qr.qrcode.value).toBe('');
    expect(qr.status.value).toBe('idle');

    qr.text.value = 'é'.repeat(Math.floor(QR_CODE_MAX_INPUT_BYTES / 2) + 1);
    await nextTick();
    await vi.runAllTimersAsync();
    expect(generate).toHaveBeenCalledTimes(1);
    expect(qr.status.value).toBe('error');
    expect(qr.error.value).toContain('UTF-8 bytes');
    qr.scope.stop();
  });

  it('invalidates timers and in-flight results when the owning scope is disposed', async () => {
    vi.useFakeTimers();
    const pending = deferred<string>();
    const generate = vi.fn(() => pending.promise);
    const qr = mountQrCode('private', generate);

    await vi.advanceTimersByTimeAsync(0);
    qr.scope.stop();
    pending.resolve('data:private');
    await nextTick();

    expect(qr.qrcode.value).toBe('');
    expect(qr.status.value).toBe('idle');
  });
});
