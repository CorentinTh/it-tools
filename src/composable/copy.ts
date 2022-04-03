import { useClipboard } from '@vueuse/core';
import { useMessage } from 'naive-ui';
import type { Ref } from 'vue';

export function useCopy({ source, text = 'Copied to the clipboard' }: { source: Ref; text?: string }) {
  const { copy } = useClipboard({ source });
  const message = useMessage();

  return {
    async copy() {
      await copy();
      message.success(text);
    },
  };
}
