import { exportBytesToStandaloneHost } from '@/utils/standalone-host';

export interface TextDownloadPlatform {
  createAnchor: () => Pick<HTMLAnchorElement, 'click' | 'download' | 'href'>
  createObjectUrl: (blob: Blob) => string
  revokeObjectUrl: (url: string) => void
}

const browserTextDownloadPlatform: TextDownloadPlatform = {
  createAnchor: () => document.createElement('a'),
  createObjectUrl: blob => URL.createObjectURL(blob),
  revokeObjectUrl: url => URL.revokeObjectURL(url),
};

export function downloadTextFile({
  content,
  filename,
  platform = browserTextDownloadPlatform,
}: {
  content: string
  filename: string
  platform?: TextDownloadPlatform
}) {
  if (content.length === 0) {
    throw new Error('Text content is empty.');
  }

  const normalizedFilename = filename.trim();
  if (!normalizedFilename || /[\\/]/.test(normalizedFilename)) {
    throw new Error('Download filename must be a non-empty file name without path separators.');
  }

  if (platform === browserTextDownloadPlatform && exportBytesToStandaloneHost({
    bytes: new TextEncoder().encode(content),
    mime: 'text/plain;charset=utf-8',
    name: normalizedFilename,
  })) {
    return;
  }

  const objectUrl = platform.createObjectUrl(new Blob([content], { type: 'text/plain;charset=utf-8' }));

  try {
    const anchor = platform.createAnchor();
    anchor.href = objectUrl;
    anchor.download = normalizedFilename;
    anchor.click();
  }
  finally {
    platform.revokeObjectUrl(objectUrl);
  }
}
