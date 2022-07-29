import { extension as getExtensionFromMime } from 'mime-types';
import type { Ref } from 'vue';

function getFileExtensionFromBase64({
  base64String,
  defaultExtension = 'txt',
}: {
  base64String: string;
  defaultExtension?: string;
}) {
  const hasMimeType = base64String.match(/data:(.*?);base64/i);

  if (hasMimeType) {
    return getExtensionFromMime(hasMimeType[1]) || defaultExtension;
  }

  return defaultExtension;
}

export function useDownloadFileFromBase64({ source, filename }: { source: Ref<string>; filename?: string }) {
  return {
    download() {
      const base64String = source.value;

      if (base64String === '') {
        throw new Error('Base64 string is empty');
      }

      const cleanFileName = filename ?? `file.${getFileExtensionFromBase64({ base64String })}`;

      const a = document.createElement('a');
      a.href = base64String;
      a.download = cleanFileName;
      a.click();
    },
  };
}
