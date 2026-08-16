export const APP_ICON_MAX_FILE_BYTES = 10 * 1024 * 1024;
export const APP_ICON_MAX_SOURCE_DIMENSION = 4096;
export const APP_ICON_MAX_SOURCE_PIXELS = 16_777_216;

export interface AppIconSpec {
  name: string
  size: number
  purpose?: 'any' | 'maskable'
}

export interface GeneratedAppIcon extends AppIconSpec {
  blob: Blob
}

export interface AppIconOptions {
  background: string
  paddingPercent: number
  transparent: boolean
}

export interface AppIconSource {
  width: number
  height: number
}

export interface AppIconPlatform<TSource extends AppIconSource = ImageBitmap> {
  decode: (file: Blob) => Promise<TSource>
  render: (source: TSource, spec: AppIconSpec, options: AppIconOptions) => Promise<Blob>
  close: (source: TSource) => void
}

export const APP_ICON_SPECS: readonly AppIconSpec[] = [
  { name: 'favicon-16.png', size: 16 },
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon-48.png', size: 48 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192, purpose: 'any' },
  { name: 'icon-512.png', size: 512, purpose: 'any' },
  { name: 'maskable-icon-512.png', size: 512, purpose: 'maskable' },
] as const;

function validateOptions(options: AppIconOptions): void {
  if (!/^#[0-9a-f]{6}$/iu.test(options.background)
    || !Number.isInteger(options.paddingPercent)
    || options.paddingPercent < 0
    || options.paddingPercent > 30
    || typeof options.transparent !== 'boolean') {
    throw new Error('Choose a six-digit background color and whole-number padding from 0% to 30%.');
  }
}

function validateFile(file: File): void {
  if (file.size === 0 || file.size > APP_ICON_MAX_FILE_BYTES) {
    throw new Error('Source images must be between 1 byte and 10 MiB.');
  }
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    throw new Error('Use a local PNG, JPEG, or WebP image.');
  }
}

async function renderBrowserIcon(source: ImageBitmap, spec: AppIconSpec, options: AppIconOptions): Promise<Blob> {
  const padding = Math.max(options.paddingPercent, spec.purpose === 'maskable' ? 10 : 0) / 100;
  const available = spec.size * (1 - 2 * padding);
  const scale = Math.min(available / source.width, available / source.height);
  const width = source.width * scale;
  const height = source.height * scale;
  const x = (spec.size - width) / 2;
  const y = (spec.size - height) / 2;

  if (typeof OffscreenCanvas !== 'undefined') {
    const canvas = new OffscreenCanvas(spec.size, spec.size);
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('The browser could not create a 2D icon canvas.');
    }
    context.clearRect(0, 0, spec.size, spec.size);
    if (!options.transparent || spec.purpose === 'maskable') {
      context.fillStyle = options.background;
      context.fillRect(0, 0, spec.size, spec.size);
    }
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(source, x, y, width, height);
    return canvas.convertToBlob({ type: 'image/png' });
  }

  const canvas = document.createElement('canvas');
  canvas.width = spec.size;
  canvas.height = spec.size;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('The browser could not create a 2D icon canvas.');
  }
  context.clearRect(0, 0, spec.size, spec.size);
  if (!options.transparent || spec.purpose === 'maskable') {
    context.fillStyle = options.background;
    context.fillRect(0, 0, spec.size, spec.size);
  }
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(source, x, y, width, height);
  return new Promise((resolve, reject) => canvas.toBlob(
    blob => blob ? resolve(blob) : reject(new Error('The browser could not encode a PNG icon.')),
    'image/png',
  ));
}

const browserPlatform: AppIconPlatform = {
  decode: file => createImageBitmap(file),
  render: renderBrowserIcon,
  close: source => source.close(),
};

export async function generateAppIcons<TSource extends AppIconSource>(
  file: File,
  options: AppIconOptions,
  platform: AppIconPlatform<TSource> = browserPlatform as unknown as AppIconPlatform<TSource>,
): Promise<GeneratedAppIcon[]> {
  validateFile(file);
  validateOptions(options);
  let source: TSource;
  try {
    source = await platform.decode(file);
  }
  catch {
    throw new Error('The selected image could not be decoded locally.');
  }
  try {
    if (!Number.isInteger(source.width) || !Number.isInteger(source.height)
      || source.width < 1 || source.height < 1
      || source.width > APP_ICON_MAX_SOURCE_DIMENSION || source.height > APP_ICON_MAX_SOURCE_DIMENSION
      || source.width * source.height > APP_ICON_MAX_SOURCE_PIXELS) {
      throw new Error('Decoded images are limited to 4096×4096 and 16 megapixels.');
    }
    const generated: GeneratedAppIcon[] = [];
    for (const spec of APP_ICON_SPECS) {
      const blob = await platform.render(source, spec, options);
      if (blob.type !== 'image/png' || blob.size === 0 || blob.size > 4 * 1024 * 1024) {
        throw new Error(`The browser returned an invalid or oversized ${spec.name}.`);
      }
      generated.push({ ...spec, blob });
    }
    return generated;
  }
  finally {
    platform.close(source);
  }
}

export function createAppManifest(icons: readonly Pick<GeneratedAppIcon, 'name' | 'purpose' | 'size'>[]): string {
  return JSON.stringify({
    name: 'Application',
    short_name: 'App',
    icons: icons.filter(icon => icon.purpose).map(icon => ({
      src: `/${icon.name}`,
      sizes: `${icon.size}x${icon.size}`,
      type: 'image/png',
      purpose: icon.purpose,
    })),
  }, null, 2);
}

function writeAscii(target: Uint8Array, offset: number, length: number, value: string): void {
  const bytes = new TextEncoder().encode(value);
  target.set(bytes.slice(0, length), offset);
}

function writeOctal(target: Uint8Array, offset: number, length: number, value: number): void {
  writeAscii(target, offset, length, value.toString(8).padStart(length - 1, '0'));
}

export async function createAppIconTar(icons: readonly GeneratedAppIcon[], manifest: string): Promise<Blob> {
  const entries = await Promise.all([
    ...icons.map(async icon => ({ name: icon.name, bytes: new Uint8Array(await icon.blob.arrayBuffer()) })),
    { name: 'manifest.webmanifest', bytes: new TextEncoder().encode(manifest) },
  ]);
  const chunks: Uint8Array[] = [];
  for (const entry of entries) {
    if (!/^[a-z0-9.-]{1,100}$/u.test(entry.name) || entry.bytes.byteLength > 4 * 1024 * 1024) {
      throw new Error('Archive entries must have bounded portable file names and sizes.');
    }
    const header = new Uint8Array(512);
    writeAscii(header, 0, 100, entry.name);
    writeOctal(header, 100, 8, 0o644);
    writeOctal(header, 108, 8, 0);
    writeOctal(header, 116, 8, 0);
    writeOctal(header, 124, 12, entry.bytes.byteLength);
    writeOctal(header, 136, 12, 0);
    header.fill(0x20, 148, 156);
    header[156] = 0x30;
    writeAscii(header, 257, 6, 'ustar');
    writeAscii(header, 263, 2, '00');
    const checksum = header.reduce((sum, byte) => sum + byte, 0);
    writeAscii(header, 148, 8, `${checksum.toString(8).padStart(6, '0')}\0 `);
    chunks.push(header, entry.bytes);
    const padding = (512 - entry.bytes.byteLength % 512) % 512;
    if (padding > 0) {
      chunks.push(new Uint8Array(padding));
    }
  }
  chunks.push(new Uint8Array(1024));
  return new Blob(chunks, { type: 'application/x-tar' });
}
