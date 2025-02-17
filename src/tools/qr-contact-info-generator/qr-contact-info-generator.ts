import { type MaybeRef, get } from '@vueuse/core';
import QRCode, { type QRCodeErrorCorrectionLevel, type QRCodeToDataURLOptions } from 'qrcode';
import { isRef, ref, watch } from 'vue';

interface ContactInfo {
  firstName: string;
  lastName: string;
  jobRole: string;
  phoneNumber: string;
  emailAddress: string;
  companyName: string;
  companyWebsite: string;
  companyAddress: string;
}

interface QRCodeOptions {
  foregroundColor?: string;
  backgroundColor?: string;
}

export function generateContactQRCode(contact: MaybeRef<ContactInfo>, options: MaybeRef<QRCodeOptions> = {}): Promise<string> {
  const vCard = ref(`
BEGIN:VCARD
VERSION:3.0
FN:${get(contact).firstName} ${get(contact).lastName}
ORG:${get(contact).companyName}
TITLE:${get(contact).jobRole}
TEL:${get(contact).phoneNumber}
EMAIL:${get(contact).emailAddress}
URL:${get(contact).companyWebsite}
ADR:${get(contact).companyAddress}
END:VCARD
  `);

  const qrOptions: QRCodeToDataURLOptions = {
    errorCorrectionLevel: 'H' as QRCodeErrorCorrectionLevel,
    type: 'image/png',
    margin: 1,
    color: {
      dark: get(options).foregroundColor || '#000000ff',
      light: get(options).backgroundColor || '#ffffffff',
    },
  };

  const qrCodeDataUrl = ref('');

  watch(
    [vCard, options].filter(isRef),
    async () => {
      qrCodeDataUrl.value = await QRCode.toDataURL(get(vCard), qrOptions);
    },
    { immediate: true },
  );

  return qrCodeDataUrl.value;
}