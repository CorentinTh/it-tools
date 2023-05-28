import { type MaybeRef, get, useClipboard } from '@vueuse/core';
import { useMessage } from 'naive-ui';

export function useCopy({ source, text = 'Copied to the clipboard' }: { source: MaybeRef<unknown>; text?: string }) {
  const { copy } = useClipboard({ source: computed(() => String(get(source))) });
  const message = useMessage();

  return {
    async copy() {
      await copy();
      message.success(text);
    },
  };
}
