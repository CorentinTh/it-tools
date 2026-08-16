export const BARCODE_MAX_FILE_BYTES = 20 * 1024 * 1024;
export const BARCODE_MAX_IMAGE_PIXELS = 25_000_000;
export const BARCODE_MAX_RESULTS = 50;
export const BARCODE_MAX_VALUE_LENGTH = 4_096;

export interface BarcodeReaderResult {
  format: string
  rawValue: string
}

interface NativeBarcode {
  format: string
  rawValue: string
}

interface NativeBarcodeDetector {
  detect: (source: ImageBitmap) => Promise<NativeBarcode[]>
}

interface NativeBarcodeDetectorConstructor {
  new(options?: { formats?: string[] }): NativeBarcodeDetector
  getSupportedFormats?: () => Promise<string[]>
}

export interface BarcodeReaderPlatform {
  createImageBitmap: (file: Blob) => Promise<ImageBitmap>
  detector: NativeBarcodeDetectorConstructor | undefined
}

function browserPlatform(): BarcodeReaderPlatform {
  const browser = globalThis as typeof globalThis & {
    BarcodeDetector?: NativeBarcodeDetectorConstructor
  };
  return {
    createImageBitmap: file => globalThis.createImageBitmap(file),
    detector: browser.BarcodeDetector,
  };
}

export async function getBarcodeDetectorFormats(platform = browserPlatform()): Promise<string[]> {
  if (!platform.detector) {
    return [];
  }
  try {
    const formats = await platform.detector.getSupportedFormats?.();
    return formats?.filter(format => typeof format === 'string').sort() ?? [];
  }
  catch {
    return [];
  }
}

export async function readBarcodesFromFile(
  file: File,
  formats: string[],
  platform = browserPlatform(),
): Promise<BarcodeReaderResult[]> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Select a local image file.');
  }
  if (!Number.isSafeInteger(file.size) || file.size < 1 || file.size > BARCODE_MAX_FILE_BYTES) {
    throw new Error(`Barcode images are limited to ${BARCODE_MAX_FILE_BYTES.toLocaleString('en-US')} bytes.`);
  }
  if (!platform.detector) {
    throw new Error('BarcodeDetector is not available in this browser. The generator remains available.');
  }

  let bitmap: ImageBitmap | undefined;
  try {
    bitmap = await platform.createImageBitmap(file);
    if (
      !Number.isSafeInteger(bitmap.width)
      || !Number.isSafeInteger(bitmap.height)
      || bitmap.width < 1
      || bitmap.height < 1
      || bitmap.width * bitmap.height > BARCODE_MAX_IMAGE_PIXELS
    ) {
      throw new Error(`Decoded images are limited to ${BARCODE_MAX_IMAGE_PIXELS.toLocaleString('en-US')} pixels.`);
    }
    const Detector = platform.detector;
    const detector = new Detector(formats.length > 0 ? { formats } : undefined);
    const detected = await detector.detect(bitmap);
    if (!Array.isArray(detected) || detected.length > BARCODE_MAX_RESULTS) {
      throw new Error('The browser returned too many or invalid barcode results.');
    }
    return detected.map((result) => {
      if (
        typeof result.format !== 'string'
        || typeof result.rawValue !== 'string'
        || result.rawValue.length > BARCODE_MAX_VALUE_LENGTH
      ) {
        throw new Error('The browser returned an invalid barcode result.');
      }
      return { format: result.format, rawValue: result.rawValue };
    });
  }
  finally {
    bitmap?.close();
  }
}
