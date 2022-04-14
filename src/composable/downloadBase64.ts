import type { Ref } from 'vue';

export function useDownloadFileFromBase64({ source, filename = 'file' }: { source: Ref<string>; filename?: string }) {
  return {
    download() {
      const a = document.createElement('a');
      a.href = source.value;
      a.download = filename;
      a.click();
    },
  };
}
