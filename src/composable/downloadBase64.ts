import { extension as getExtensionFromMime } from 'mime-types';
import type { Ref } from 'vue';

export function useDownloadFileFromBase64({ source, filename }: { source: Ref<string>; filename?: string }) {
  return {
    download() {
      const base64 = source.value;
      const mimeType = base64.match(/data:(.*?);base64/i)?.[1] ?? 'text/plain';
      console.log({ mimeType });
      const cleanFileName = filename ?? `file.${getExtensionFromMime(mimeType)}`;

      const a = document.createElement('a');
      a.href = source.value;
      a.download = cleanFileName;
      a.click();
    },
  };
}
