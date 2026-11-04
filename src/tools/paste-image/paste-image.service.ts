import { format as formatDate } from 'date-fns';
import { getExtensionFromMimeType } from '@/composable/downloadBase64';

export {
  outputFormats,
  defaultOutputFormat,
  defaultQuality,
  isOutputFormat,
  clampQuality,
  getDefaultFileName,
  getUniqueFileName,
  getFileExtension,
  getTypeLabel,
  isFallbackOutput,
  formatSizeDelta,
  getImageFromDataTransfer,
  readImageFromClipboard,
  readImageDimensions,
  convertImage,
  blobToDataUrl,
  writeImageToClipboard,
  writeDataUrlToClipboard,
};

export type OutputFormat = 'png' | 'jpeg' | 'webp';

const outputFormats: Record<OutputFormat, { label: string; mimeType: string; isLossy: boolean }> = {
  png: { label: 'PNG', mimeType: 'image/png', isLossy: false },
  jpeg: { label: 'JPEG', mimeType: 'image/jpeg', isLossy: true },
  webp: { label: 'WebP', mimeType: 'image/webp', isLossy: true },
};

const defaultOutputFormat: OutputFormat = 'png';
const defaultQuality = 90;

function isOutputFormat(value: unknown): value is OutputFormat {
  return typeof value === 'string' && Object.keys(outputFormats).includes(value);
}

function clampQuality(value: unknown) {
  const quality = Number(value);

  if (!Number.isFinite(quality)) {
    return defaultQuality;
  }

  return Math.min(100, Math.max(1, Math.round(quality)));
}

function getDefaultFileName({ date }: { date: Date }) {
  return `pasted-image-${formatDate(date, 'yyyyMMdd-HHmmss')}`;
}

function getUniqueFileName({ fileName, existingFileNames }: { fileName: string; existingFileNames: string[] }) {
  if (!existingFileNames.includes(fileName)) {
    return fileName;
  }

  let suffix = 2;
  while (existingFileNames.includes(`${fileName}-${suffix}`)) {
    suffix++;
  }

  return `${fileName}-${suffix}`;
}

function getFileExtension(mimeType: string) {
  // mime-types returns "jpeg", but "jpg" is the extension most tools and people expect.
  if (mimeType === 'image/jpeg') {
    return 'jpg';
  }

  return getExtensionFromMimeType(mimeType) || mimeType.replace(/^image\//, '').replace(/\+.*$/, '');
}

function getTypeLabel(mimeType: string) {
  const outputFormat = Object.values(outputFormats).find(format => format.mimeType === mimeType);

  return outputFormat?.label ?? getFileExtension(mimeType).toUpperCase();
}

function isFallbackOutput({ output, format }: { output: Blob; format: OutputFormat }) {
  return output.type !== outputFormats[format].mimeType;
}

function formatSizeDelta({ originalSize, outputSize }: { originalSize: number; outputSize: number }) {
  const delta = originalSize === 0 ? 0 : Math.round(((outputSize - originalSize) / originalSize) * 100);

  return `${delta > 0 ? '+' : ''}${delta}%`;
}

function getImageFromDataTransfer(dataTransfer: Pick<DataTransfer, 'items'> | null | undefined): File | undefined {
  if (!dataTransfer) {
    return undefined;
  }

  const imageItem = Array.from(dataTransfer.items ?? []).find(item => item.kind === 'file' && item.type.startsWith('image/'));

  return imageItem?.getAsFile() ?? undefined;
}

async function readImageFromClipboard(): Promise<Blob | undefined> {
  const clipboardItems = await navigator.clipboard.read();

  for (const clipboardItem of clipboardItems) {
    const imageType = clipboardItem.types.find(type => type.startsWith('image/'));

    if (imageType) {
      return clipboardItem.getType(imageType);
    }
  }

  return undefined;
}

async function readImageDimensions(source: Blob) {
  const bitmap = await createImageBitmap(source);
  const { width, height } = bitmap;
  bitmap.close();

  return { width, height };
}

function canvasToBlob({ canvas, mimeType, quality }: { canvas: HTMLCanvasElement; mimeType: string; quality?: number }) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error('The browser could not encode the image.'))),
      mimeType,
      quality,
    );
  });
}

async function convertImage({ source, format, quality }: { source: Blob; format: OutputFormat; quality: number }): Promise<Blob> {
  const { mimeType, isLossy } = outputFormats[format];

  // Re-encoding a lossless image into the same lossless format gains nothing, so the original bytes are kept.
  if (!isLossy && source.type === mimeType) {
    return source;
  }

  // The image is decoded only for the conversion, so the history does not keep decoded pixels in memory.
  const bitmap = await createImageBitmap(source);
  const canvas = document.createElement('canvas');

  try {
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('The browser could not create a canvas to convert the image.');
    }

    // JPEG has no alpha channel, so transparent pixels would turn black without a white background.
    if (format === 'jpeg') {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    context.drawImage(bitmap, 0, 0);
    bitmap.close();

    return await canvasToBlob({ canvas, mimeType, quality: isLossy ? quality / 100 : undefined });
  }
  finally {
    bitmap.close();
    // A zero-sized canvas releases its pixel buffer without waiting for garbage collection.
    canvas.width = 0;
    canvas.height = 0;
  }
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function canWriteClipboardItems() {
  return typeof ClipboardItem !== 'undefined' && typeof navigator.clipboard?.write === 'function';
}

// Each value goes into the ClipboardItem as an unresolved promise.
// Safari rejects the write once an await before it has consumed the user gesture.

async function writeImageToClipboard({ source }: { source: Blob }) {
  // Browsers only guarantee clipboard support for PNG images.
  const pngBlob = convertImage({ source, format: 'png', quality: 100 });

  await navigator.clipboard.write([new ClipboardItem({ 'image/png': pngBlob })]);
}

async function writeDataUrlToClipboard({ source, writeText }: { source: Blob; writeText: (text: string) => Promise<void> }) {
  if (!canWriteClipboardItems()) {
    await writeText(await blobToDataUrl(source));
    return;
  }

  const textBlob = blobToDataUrl(source).then(dataUrl => new Blob([dataUrl], { type: 'text/plain' }));

  await navigator.clipboard.write([new ClipboardItem({ 'text/plain': textBlob })]);
}
