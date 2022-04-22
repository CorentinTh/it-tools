import QRCode, { type QRCodeErrorCorrectionLevel, type QRCodeToDataURLOptions } from 'qrcode';
import { ref, watch, type Ref } from 'vue';

export function useQRCode({
  text,
  color: { background, foreground },
  errorCorrectionLevel,
  options,
}: {
  text: Ref<string>;
  color: { foreground: Ref<string>; background: Ref<string> };
  errorCorrectionLevel: Ref<QRCodeErrorCorrectionLevel>;
  options?: QRCodeToDataURLOptions;
}) {
  const qrcode = ref('');

  watch(
    [text, background, foreground, errorCorrectionLevel],
    async () => {
      if (text.value)
        qrcode.value = await QRCode.toDataURL(text.value, {
          color: {
            dark: foreground.value,
            light: background.value,
            ...options?.color,
          },
          errorCorrectionLevel: errorCorrectionLevel.value,
          ...options,
        });
    },
    { immediate: true },
  );

  return { qrcode };
}
