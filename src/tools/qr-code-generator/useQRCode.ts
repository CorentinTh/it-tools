import { type MaybeRef, get } from '@vueuse/core';
import QRCode, { type QRCodeErrorCorrectionLevel, type QRCodeToDataURLOptions } from 'qrcode';
import {
  type WatchSource,
  computed,
  isRef,
  onScopeDispose,
  ref,
  shallowRef,
  watch,
} from 'vue';
import { exceedsUtf8ByteLimit } from '@/utils/utf8';

export const QR_CODE_DEBOUNCE_MS = 150;
export const QR_CODE_MAX_INPUT_BYTES = 4_096;
export const QR_CODE_GENERATION_ERROR = 'QR code generation failed. Check that the current input fits the selected error resistance.';

export type QrCodeGenerationStatus = 'idle' | 'scheduled' | 'running' | 'ready' | 'error';

export interface QrCodeRequest {
  text: string
  options: QRCodeToDataURLOptions
}

export interface QrCodeGenerationDependencies {
  debounceMs?: number
  generate?: (text: string, options: QRCodeToDataURLOptions) => Promise<string>
}

function reactiveSources(values: unknown[]): WatchSource<unknown>[] {
  return values.filter(isRef) as WatchSource<unknown>[];
}

export function useLatestQRCode(
  sources: WatchSource<unknown>[],
  createRequest: () => QrCodeRequest | null,
  dependencies: QrCodeGenerationDependencies = {},
) {
  const qrcode = ref('');
  const encodedText = ref('');
  const status = shallowRef<QrCodeGenerationStatus>('idle');
  const error = ref('');
  const isGenerating = computed(() => status.value === 'scheduled' || status.value === 'running');
  const debounceMs = dependencies.debounceMs ?? QR_CODE_DEBOUNCE_MS;
  const generate = dependencies.generate
    ?? ((text: string, generationOptions: QRCodeToDataURLOptions) => QRCode.toDataURL(text, generationOptions));
  let latestGeneration = 0;
  let timer: ReturnType<typeof globalThis.setTimeout> | undefined;
  let initialized = false;
  let disposed = false;

  if (!Number.isSafeInteger(debounceMs) || debounceMs < 0 || debounceMs > 5_000) {
    throw new RangeError('QR code debounce must be a whole number between 0 and 5,000 ms.');
  }

  function clearTimer(): void {
    if (timer !== undefined) {
      globalThis.clearTimeout(timer);
      timer = undefined;
    }
  }

  function schedule(): void {
    const generation = ++latestGeneration;
    clearTimer();

    const request = createRequest();
    if (!request || !request.text) {
      qrcode.value = '';
      encodedText.value = '';
      error.value = '';
      status.value = 'idle';
      initialized = true;
      return;
    }

    if (exceedsUtf8ByteLimit(request.text, QR_CODE_MAX_INPUT_BYTES)) {
      qrcode.value = '';
      encodedText.value = '';
      error.value = `QR code input exceeds ${QR_CODE_MAX_INPUT_BYTES.toLocaleString('en-US')} UTF-8 bytes.`;
      status.value = 'error';
      initialized = true;
      return;
    }

    error.value = '';
    status.value = 'scheduled';
    const delay = initialized ? debounceMs : 0;
    initialized = true;
    timer = globalThis.setTimeout(async () => {
      timer = undefined;
      if (disposed || generation !== latestGeneration) {
        return;
      }

      status.value = 'running';
      try {
        const result = await generate(request.text, request.options);
        if (disposed || generation !== latestGeneration) {
          return;
        }

        qrcode.value = result;
        encodedText.value = request.text;
        status.value = 'ready';
      }
      catch {
        if (disposed || generation !== latestGeneration) {
          return;
        }

        qrcode.value = '';
        encodedText.value = '';
        error.value = QR_CODE_GENERATION_ERROR;
        status.value = 'error';
      }
    }, delay);
  }

  if (sources.length > 0) {
    watch(sources, schedule, { immediate: true });
  }
  else {
    schedule();
  }

  onScopeDispose(() => {
    disposed = true;
    ++latestGeneration;
    clearTimer();
    qrcode.value = '';
    encodedText.value = '';
    error.value = '';
    status.value = 'idle';
  });

  return { encodedText, error, isGenerating, qrcode, status };
}

export function useQRCode({
  text,
  color: { background, foreground },
  errorCorrectionLevel,
  options,
}: {
  text: MaybeRef<string>
  color: { foreground: MaybeRef<string>; background: MaybeRef<string> }
  errorCorrectionLevel?: MaybeRef<QRCodeErrorCorrectionLevel>
  options?: QRCodeToDataURLOptions
}, dependencies: QrCodeGenerationDependencies = {}) {
  return useLatestQRCode(
    reactiveSources([text, background, foreground, errorCorrectionLevel]),
    () => {
      const normalizedText = get(text)?.trim();
      if (!normalizedText) {
        return null;
      }

      return {
        text: normalizedText,
        options: {
          ...options,
          color: {
            ...options?.color,
            dark: get(foreground),
            light: get(background),
          },
          errorCorrectionLevel: get(errorCorrectionLevel) ?? options?.errorCorrectionLevel ?? 'M',
        },
      };
    },
    dependencies,
  );
}
