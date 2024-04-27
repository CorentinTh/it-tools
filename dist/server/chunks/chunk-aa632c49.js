import { get } from '@vueuse/core';
import QRCode from 'qrcode';
import { ref, watch, isRef } from 'vue';

function useQRCode({
  text,
  color: { background, foreground },
  errorCorrectionLevel,
  options
}) {
  const qrcode = ref("");
  watch(
    [text, background, foreground, errorCorrectionLevel].filter(isRef),
    async () => {
      if (get(text)) {
        qrcode.value = await QRCode.toDataURL(get(text).trim(), {
          color: {
            dark: get(foreground),
            light: get(background),
            ...options?.color
          },
          errorCorrectionLevel: get(errorCorrectionLevel) ?? "M",
          ...options
        });
      }
    },
    { immediate: true }
  );
  return { qrcode };
}

export { useQRCode as u };
