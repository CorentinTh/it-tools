import JSZip from 'jszip';

export interface FaviconSize {
  filename: string
  size: number
}

export const FAVICON_SIZES: FaviconSize[] = [
  { filename: 'favicon-16x16.png', size: 16 },
  { filename: 'favicon-32x32.png', size: 32 },
  { filename: 'favicon-48x48.png', size: 48 },
  { filename: 'apple-touch-icon.png', size: 180 },
  { filename: 'android-chrome-192x192.png', size: 192 },
  { filename: 'android-chrome-512x512.png', size: 512 },
];

export function generateSiteWebmanifest(appName: string = 'My App'): string {
  return JSON.stringify(
    {
      name: appName,
      short_name: appName,
      icons: [
        { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
    },
    null,
    2,
  );
}

export async function resizeImageToBlob(img: HTMLImageElement, size: number): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get 2D context');
  }
  ctx.drawImage(img, 0, 0, size, size);
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      }
      else {
        reject(new Error(`Failed to create blob for size ${size}`));
      }
    }, 'image/png');
  });
}

const ICO_SIZES = [16, 32, 48];

export function buildIcoBuffer(pngBuffers: ArrayBuffer[], sizes: number[]): ArrayBuffer {
  const headerSize = 6;
  const dirEntrySize = 16;
  const totalHeaderSize = headerSize + dirEntrySize * sizes.length;

  let offset = totalHeaderSize;
  const offsets = pngBuffers.map((buf) => {
    const o = offset;
    offset += buf.byteLength;
    return o;
  });

  const buffer = new ArrayBuffer(offset);
  const view = new DataView(buffer);

  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, sizes.length, true);

  sizes.forEach((size, i) => {
    const base = headerSize + i * dirEntrySize;
    view.setUint8(base, size);
    view.setUint8(base + 1, size);
    view.setUint8(base + 2, 0);
    view.setUint8(base + 3, 0);
    view.setUint16(base + 4, 1, true);
    view.setUint16(base + 6, 32, true);
    view.setUint32(base + 8, pngBuffers[i].byteLength, true);
    view.setUint32(base + 12, offsets[i], true);
  });

  const uint8 = new Uint8Array(buffer);
  pngBuffers.forEach((pngBuf, i) => uint8.set(new Uint8Array(pngBuf), offsets[i]));

  return buffer;
}

export async function generateIcoBlob(img: HTMLImageElement): Promise<Blob> {
  const pngBlobs = await Promise.all(ICO_SIZES.map(s => resizeImageToBlob(img, s)));
  const pngBuffers = await Promise.all(pngBlobs.map(b => b.arrayBuffer()));
  return new Blob([buildIcoBuffer(pngBuffers, ICO_SIZES)], { type: 'image/x-icon' });
}

export async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

export async function generateFaviconZip(file: File): Promise<Blob> {
  const img = await loadImageFromFile(file);
  const zip = new JSZip();

  for (const { filename, size } of FAVICON_SIZES) {
    const blob = await resizeImageToBlob(img, size);
    zip.file(filename, blob);
  }

  const icoBlob = await generateIcoBlob(img);
  zip.file('favicon.ico', icoBlob);

  zip.file('site.webmanifest', generateSiteWebmanifest());

  return zip.generateAsync({ type: 'blob' });
}
