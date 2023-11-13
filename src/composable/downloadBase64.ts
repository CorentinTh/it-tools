import { extension as getExtensionFromMime } from 'mime-types';
import type { Ref } from 'vue';

function getFileExtensionFromMime({
  hasMimeType,
  defaultExtension = 'txt',
}: {
  hasMimeType: string[] | null
  defaultExtension?: string
}) {
  if (hasMimeType) {
    return getExtensionFromMime(hasMimeType[1]) || defaultExtension;
  }

  return defaultExtension;
}

export function useDownloadFileFromBase64({ source, filename }: { source: Ref<string>; filename?: string }) {
  return {
    download() {
      if (source.value === '') {
        throw new Error('Base64 string is empty');
      }

      const hasMimeType = source.value.match(/data:(.*?);base64/i);
      const base64String = hasMimeType
        ? source.value
        : `data:text/plain;base64,${source.value}`;

      const cleanFileName = filename ?? `file.${getFileExtensionFromMime({ hasMimeType })}`;

      const a = document.createElement('a');
      a.href = base64String;
      a.download = cleanFileName;
      a.click();
    },
  };
}
