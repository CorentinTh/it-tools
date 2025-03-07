import { computed, ref, watchEffect } from "vue";
import QRCode, { type QRCodeToDataURLOptions } from "qrcode";
import { get, MaybeRef } from "@vueuse/core";

interface IContactQRCodeOptions {
  fullName: MaybeRef<string>;
  jobRole: MaybeRef<string>;
  phoneNumber: MaybeRef<string>;
  email: MaybeRef<string>;
  website: MaybeRef<string>;
  address: MaybeRef<string>;
  color: { foreground: MaybeRef<string>; background: MaybeRef<string> };
  options?: QRCodeToDataURLOptions;
}

// Computed vCard to ensure reactivity works correctly
const useVCard = (options: IContactQRCodeOptions) => {
  return computed(() => {
    return `BEGIN:VCARD
VERSION:3.0
${get(options.fullName) ? `FN:${get(options.fullName)}` : ""}
${get(options.jobRole) ? `TITLE:${get(options.jobRole)}` : ""}
${get(options.phoneNumber) ? `TEL:${get(options.phoneNumber)}` : ""}
${get(options.email) ? `EMAIL:${get(options.email)}` : ""}
${get(options.website) ? `URL:${get(options.website)}` : ""}
${get(options.address) ? `ADR:${get(options.address)}` : ""}
END:VCARD`.trim();
  });
};

export function useContactQRCode(options: IContactQRCodeOptions) {
  const qrcode = ref("");
  const vCardText = useVCard(options); // Computed property for reactivity

  watchEffect(async () => {
    if (vCardText.value) {
      qrcode.value = await QRCode.toDataURL(vCardText.value, {
        color: {
          dark: get(options.color.foreground),
          light: get(options.color.background),
        },
        errorCorrectionLevel: "M",
        ...options.options,
      });
    }
  });

  return { qrcode };
}
