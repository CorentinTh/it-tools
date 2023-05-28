import { type MaybeRef, get } from '@vueuse/core';
import QRCode, { type QRCodeErrorCorrectionLevel, type QRCodeToDataURLOptions } from 'qrcode';
import { isRef, ref, watch } from 'vue';

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
}) {
  const qrcode = ref('');

  watch(
    [text, background, foreground, errorCorrectionLevel].filter(isRef),
    async () => {
      if (get(text)) {
        qrcode.value = await QRCode.toDataURL(get(text).trim(), {
          color: {
            dark: get(foreground),
            light: get(background),
            ...options?.color,
          },
          errorCorrectionLevel: get(errorCorrectionLevel) ?? 'M',
          ...options,
        });
      }
    },
    { immediate: true },
  );

  return { qrcode };
}
