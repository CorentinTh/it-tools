import { type MaybeRef, get } from '@vueuse/core';
import QRCode, { type QRCodeDataURLType, type QRCodeErrorCorrectionLevel, type QRCodeRenderersOptions, type QRCodeStringType } from 'qrcode';
import { isRef, ref, watch } from 'vue';
import type {
  CornerDotType,
  CornerSquareType,
  DotType,
  DrawType,
  ErrorCorrectionLevel,
  FileExtension,
  Mode,
  TypeNumber,
} from 'pp-qr-code';
import QRCodeStyling from 'pp-qr-code';

function blobToBase64(blob: Blob | null): Promise<string> {
  if (blob === null) {
    return Promise.resolve('');
  }
  return new Promise((resolve, _reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

export function useQRCodeStyling({
  text,
  color: { background, foreground },
  errorCorrectionLevel,
  imageBase64,
  imageOptions: { imageSize, margin: imageMargin },
  dotOptions: { type: dotType, color: dotColor },
  cornersSquareOptions: { type: cornersSquareType, color: cornersSquareColor },
  cornersDotOptions: { type: cornersDotType, color: cornersDotColor },
  outputType,
  width,
  margin,
}: {
  text: MaybeRef<string>
  color: { foreground: MaybeRef<string>; background: MaybeRef<string> }
  outputType: MaybeRef<FileExtension>
  errorCorrectionLevel?: MaybeRef<ErrorCorrectionLevel>
  imageBase64?: MaybeRef<string>
  imageOptions: { imageSize: MaybeRef<number>; margin: MaybeRef<number> }
  dotOptions: { type: MaybeRef<DotType>; color: MaybeRef<string> }
  cornersSquareOptions: { type: MaybeRef<CornerSquareType>; color: MaybeRef<string> }
  cornersDotOptions: { type: MaybeRef<CornerDotType>; color: MaybeRef<string> }
  width?: MaybeRef<number>
  margin?: MaybeRef<number>
}) {
  const qrcode = ref('');

  watch(
    [text, background, foreground, errorCorrectionLevel,
      imageBase64, imageSize, imageMargin,
      dotType, dotColor, cornersSquareType, cornersSquareColor,
      cornersDotType, cornersDotColor,
      outputType, width, margin].filter(isRef),
    async () => {
      const qrCodeText = get(text)?.trim();
      const qrCodeOutputType = get(outputType) || 'png';
      if (qrCodeText) {
        const getOrForeground = (colorRef: MaybeRef<string>) => {
          const color = get(colorRef) || get(foreground);
          if (color?.toLowerCase() === '#ffffffff') {
            return get(foreground);
          }
          return color;
        };
        const qrCodeOptions = {
          width: get(width) ?? 1024,
          height: get(width) ?? 1024,
          type: 'svg' as DrawType,
          data: qrCodeText,
          image: get(imageBase64),
          margin: get(margin) || 10,
          qrOptions: {
            typeNumber: 0 as TypeNumber,
            mode: 'Byte' as Mode,
            errorCorrectionLevel: get(errorCorrectionLevel) || 'Q',
          },
          imageOptions: {
            hideBackgroundDots: true,
            imageSize: get(imageSize) || 0.4,
            margin: get(imageMargin) || 20,
            crossOrigin: 'anonymous',
          },
          dotsOptions: {
            color: getOrForeground(dotColor),
            // gradient: {
            //   type: 'linear', // 'radial'
            //   rotation: 0,
            //   colorStops: [{ offset: 0, color: '#8688B2' }, { offset: 1, color: '#77779C' }]
            // },
            type: get(dotType) || 'square',
          },
          backgroundOptions: {
            color: get(background),
            // gradient: {
            //   type: 'linear', // 'radial'
            //   rotation: 0,
            //   colorStops: [{ offset: 0, color: '#ededff' }, { offset: 1, color: '#e6e7ff' }]
            // },
          },
          cornersSquareOptions: {
            color: getOrForeground(cornersSquareColor),
            type: get(cornersSquareType) || 'extra-rounded',
            // gradient: {
            //   type: 'linear', // 'radial'
            //   rotation: 180,
            //   colorStops: [{ offset: 0, color: '#25456e' }, { offset: 1, color: '#4267b2' }]
            // },
          },
          cornersDotOptions: {
            color: getOrForeground(cornersDotColor),
            type: get(cornersDotType) || 'dot',
            // gradient: {
            //   type: 'linear', // 'radial'
            //   rotation: 180,
            //   colorStops: [{ offset: 0, color: '#00266e' }, { offset: 1, color: '#4060b3' }]
            // },
          },
        };

        const qrGenerator = new QRCodeStyling(qrCodeOptions);
        qrcode.value = await blobToBase64(await qrGenerator.getRawData(qrCodeOutputType));
      }
    },
    { immediate: true },
  );

  return { qrcode };
}

export function useQRCode<QRCodeOptions extends QRCodeRenderersOptions>({
  text,
  color: { background, foreground },
  errorCorrectionLevel,
  outputType,
  width,
  options,
}: {
  text: MaybeRef<string>
  color: { foreground: MaybeRef<string>; background: MaybeRef<string> }
  errorCorrectionLevel?: MaybeRef<QRCodeErrorCorrectionLevel>
  outputType?: MaybeRef<QRCodeDataURLType | QRCodeStringType>
  width?: MaybeRef<number>
  options?: QRCodeOptions
}) {
  const qrcode = ref('');

  watch(
    [text, background, foreground, errorCorrectionLevel, outputType, width].filter(isRef),
    async () => {
      const qrCodeText = get(text)?.trim();
      const qrCodeType = get(outputType) || '';
      if (qrCodeText) {
        const qrCodeOptions = {
          color: {
            dark: get(foreground),
            light: get(background),
            ...options?.color,
          },
          errorCorrectionLevel: get(errorCorrectionLevel) ?? 'M',
          width: get(width) ?? 1024,
          ...options,
        };
        if (['utf8', 'svg', 'terminal'].includes(qrCodeType)) {
          qrcode.value = await QRCode.toString(qrCodeText, {
            type: qrCodeType as QRCodeStringType,
          });
        }
        else {
          qrcode.value = await QRCode.toDataURL(qrCodeText, {
            ...qrCodeOptions,
            type: qrCodeType as QRCodeDataURLType,
          });
        }
      }
    },
    { immediate: true },
  );

  return { qrcode };
}
