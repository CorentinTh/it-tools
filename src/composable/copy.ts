import { type MaybeRef, get, useClipboard } from '@vueuse/core';
import { useMessage } from 'naive-ui';

export function useCopy({ source, text = 'Copied to the clipboard' }: { source?: MaybeRef<unknown>; text?: string } = {}) {
  const { copy } = useClipboard(source ? { source: computed(() => String(get(source))) } : {});
  const message = useMessage();

  return {
    async copy(content?: string, { notificationMessage }: { notificationMessage?: string } = {}) {
      await copy(content);
      message.success(notificationMessage ?? text);
    },
  };
}
