import { useClipboard, type MaybeRef } from '@vueuse/core';
import { useMessage } from 'naive-ui';

export function useCopy({ source, text = 'Copied to the clipboard' }: { source: MaybeRef<string>; text?: string }) {
  const { copy } = useClipboard({ source });
  const message = useMessage();

  return {
    async copy() {
      await copy();
      message.success(text);
    },
  };
}
