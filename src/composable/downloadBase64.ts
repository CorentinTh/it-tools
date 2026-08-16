import { extension as getExtensionFromMimeType, lookup as lookupMimeTypeFromExtension } from 'mime-types';
import type { Ref } from 'vue';
import { exportBytesToStandaloneHost } from '@/utils/standalone-host';

export {
  getMimeTypeFromBase64,
  getMimeTypeFromExtension, getExtensionFromMimeType,
  useDownloadFileFromBase64, useDownloadFileFromBase64Refs,
  previewImageFromBase64,
};

const commonMimeTypesSignatures = {
  'JVBERi0': 'application/pdf',
  'R0lGODdh': 'image/gif',
  'R0lGODlh': 'image/gif',
  'iVBORw0KGgo': 'image/png',
  '/9j/': 'image/jpg',
};

function getMimeTypeFromBase64({ base64String }: { base64String: string }) {
  const normalizedBase64 = base64String.trim();
  const [,mimeTypeFromBase64] = normalizedBase64.match(/^data:([^;,]+)(?:;[^,]*)?;base64,/i) ?? [];

  if (mimeTypeFromBase64) {
    return { mimeType: mimeTypeFromBase64 };
  }

  const inferredMimeType = Object.entries(commonMimeTypesSignatures)
    .find(([signature]) => normalizedBase64.startsWith(signature))?.[1];

  if (inferredMimeType) {
    return { mimeType: inferredMimeType };
  }

  return { mimeType: undefined };
}

function getMimeTypeFromExtension(extension: string): string | undefined {
  return lookupMimeTypeFromExtension(extension) || undefined;
}

function asBase64DataUri({ base64String, mimeType }: { base64String: string; mimeType: string }): string {
  const normalizedBase64 = base64String.trim();
  if (/^data:[^;,]+(?:;[^,]*)?;base64,/i.test(normalizedBase64)) {
    return normalizedBase64;
  }

  return `data:${mimeType};base64,${normalizedBase64}`;
}

function getFileExtensionFromMimeType({
  mimeType,
  defaultExtension = 'txt',
}: {
  mimeType: string | undefined
  defaultExtension?: string
}) {
  if (mimeType) {
    return getExtensionFromMimeType(mimeType) ?? defaultExtension;
  }

  return defaultExtension;
}

function downloadFromBase64({ sourceValue, filename, extension, fileMimeType }:
{ sourceValue: string; filename?: string; extension?: string; fileMimeType?: string }) {
  if (sourceValue.trim() === '') {
    throw new Error('Base64 string is empty');
  }

  const cleanRequestedExtension = extension?.trim().replace(/^\./, '') || undefined;
  const defaultExtension = cleanRequestedExtension ?? 'txt';
  const { mimeType } = getMimeTypeFromBase64({ base64String: sourceValue });
  const targetMimeType = mimeType
    ?? fileMimeType
    ?? getMimeTypeFromExtension(defaultExtension)
    ?? 'application/octet-stream';
  const base64String = asBase64DataUri({ base64String: sourceValue, mimeType: targetMimeType });

  const cleanExtension = cleanRequestedExtension ?? getFileExtensionFromMimeType(
    { mimeType: targetMimeType, defaultExtension });
  let cleanFileName = filename ?? `file.${cleanExtension}`;
  if (cleanRequestedExtension && !cleanFileName.endsWith(`.${cleanRequestedExtension}`)) {
    cleanFileName = `${cleanFileName}.${cleanExtension}`;
  }

  const encodedPayload = base64String.slice(base64String.indexOf(',') + 1);
  const decoded = atob(encodedPayload);
  const bytes = Uint8Array.from(decoded, character => character.charCodeAt(0));
  if (exportBytesToStandaloneHost({ bytes, mime: targetMimeType, name: cleanFileName })) {
    return;
  }

  const a = document.createElement('a');
  a.href = base64String;
  a.download = cleanFileName;
  a.click();
}

function useDownloadFileFromBase64(
  { source, filename, extension, fileMimeType }:
  { source: Ref<string>; filename?: string; extension?: string; fileMimeType?: string }) {
  return {
    download() {
      downloadFromBase64({ sourceValue: source.value, filename, extension, fileMimeType });
    },
  };
}

function useDownloadFileFromBase64Refs(
  { source, filename, extension }:
  { source: Ref<string>; filename?: Ref<string>; extension?: Ref<string> }) {
  return {
    download() {
      downloadFromBase64({ sourceValue: source.value, filename: filename?.value, extension: extension?.value });
    },
  };
}

function previewImageFromBase64(base64String: string, fallbackMimeType?: string): HTMLImageElement {
  if (base64String.trim() === '') {
    throw new Error('Base64 string is empty');
  }

  const { mimeType } = getMimeTypeFromBase64({ base64String });
  const img = document.createElement('img');
  img.src = asBase64DataUri({
    base64String,
    mimeType: mimeType ?? fallbackMimeType ?? 'application/octet-stream',
  });

  const container = document.createElement('div');
  container.appendChild(img);

  const previewContainer = document.getElementById('previewContainer');
  if (previewContainer) {
    previewContainer.innerHTML = '';
    previewContainer.appendChild(container);
  }
  else {
    throw new Error('Preview container element not found');
  }

  return img;
}
