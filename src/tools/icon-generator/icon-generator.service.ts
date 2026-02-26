export type IconPresetKey = 'pwa' | 'android' | 'ios';
export type IconFitMode = 'cover' | 'contain';

export interface IconPreset {
  key: IconPresetKey
  sizes: number[]
}

export interface GeneratedIcon {
  size: number
  filename: string
  dataUrl: string
}

export function createWebAppManifest({
  appName,
  icons,
  description,
  startUrl = '/',
  scope = '/',
  lang = 'en',
  backgroundColor = '#ffffff',
  themeColor = '#ffffff',
}: {
  appName: string
  icons: { filename: string; size: number }[]
  description?: string
  startUrl?: string
  scope?: string
  lang?: string
  backgroundColor?: string
  themeColor?: string
}) {
  return JSON.stringify({
    id: startUrl,
    name: appName,
    short_name: appName,
    description: description ?? `${appName} icons`,
    lang,
    start_url: startUrl,
    scope,
    display: 'standalone',
    background_color: backgroundColor,
    theme_color: themeColor,
    icons: icons.map(icon => ({
      src: icon.filename,
      sizes: `${icon.size}x${icon.size}`,
      type: 'image/png',
      purpose: 'any maskable',
    })),
  }, null, 2);
}

export const ICON_PRESETS: IconPreset[] = [
  { key: 'pwa', sizes: [72, 96, 128, 144, 152, 192, 384, 512] },
  { key: 'android', sizes: [48, 72, 96, 144, 192, 512] },
  { key: 'ios', sizes: [20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024] },
];

export function normalizeSizes(sizes: number[]) {
  return Array.from(
    new Set(
      sizes
        .map(size => Math.floor(size))
        .filter(size => Number.isFinite(size) && size > 0),
    ),
  ).sort((a, b) => a - b);
}

export function getPresetSizes(presetKeys: IconPresetKey[]) {
  const selectedSizes = ICON_PRESETS
    .filter(preset => presetKeys.includes(preset.key))
    .flatMap(preset => preset.sizes);

  return normalizeSizes(selectedSizes);
}

export function sanitizeBaseName(baseName: string) {
  const normalized = baseName.trim().replaceAll(/[<>:"/\\|?*]+/g, '-').replaceAll(/\s+/g, '-');
  return normalized || 'icon';
}

export function buildIconFilename(size: number, baseName = 'icon') {
  const safeBaseName = sanitizeBaseName(baseName);
  return `${safeBaseName}-${size}x${size}.png`;
}

export function calculateDrawArea({
  sourceWidth,
  sourceHeight,
  targetSize,
  fitMode,
}: {
  sourceWidth: number
  sourceHeight: number
  targetSize: number
  fitMode: IconFitMode
}) {
  const scale = fitMode === 'cover'
    ? Math.max(targetSize / sourceWidth, targetSize / sourceHeight)
    : Math.min(targetSize / sourceWidth, targetSize / sourceHeight);

  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;

  return {
    x: (targetSize - drawWidth) / 2,
    y: (targetSize - drawHeight) / 2,
    width: drawWidth,
    height: drawHeight,
  };
}

export function loadImageFromFile(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Unable to load image file.'));
    };
    image.src = url;
  });
}

export function createResizedIcon({
  image,
  size,
  fitMode,
}: {
  image: HTMLImageElement
  size: number
  fitMode: IconFitMode
}) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Unable to get canvas context.');
  }

  const drawArea = calculateDrawArea({
    sourceWidth: image.width,
    sourceHeight: image.height,
    targetSize: size,
    fitMode,
  });

  context.clearRect(0, 0, size, size);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(image, drawArea.x, drawArea.y, drawArea.width, drawArea.height);

  return canvas.toDataURL('image/png');
}

export function createResizedIcons({
  image,
  sizes,
  fitMode,
  baseName,
}: {
  image: HTMLImageElement
  sizes: number[]
  fitMode: IconFitMode
  baseName?: string
}) {
  return normalizeSizes(sizes).map((size): GeneratedIcon => ({
    size,
    filename: buildIconFilename(size, baseName),
    dataUrl: createResizedIcon({ image, size, fitMode }),
  }));
}
