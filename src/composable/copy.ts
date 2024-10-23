// eslint-disable-next-line no-restricted-imports
import { useClipboard, useClipboardItems } from '@vueuse/core';
import { useMessage } from 'naive-ui';
import type { MaybeRefOrGetter } from 'vue';

export function useCopy({ source, text = 'Copied to the clipboard', createToast = true }: { source?: MaybeRefOrGetter<string>; text?: string; createToast?: boolean } = {}) {
  const { copy, copied, ...rest } = useClipboard({
    source,
    legacy: true,
  });

  const message = useMessage();

  return {
    ...rest,
    isJustCopied: copied,
    async copy(content?: string, { notificationMessage }: { notificationMessage?: string } = {}) {
      if (source) {
        await copy();
      }
      else {
        await copy(content);
      }

      if (createToast) {
        message.success(notificationMessage ?? text);
      }
    },
  };
}

export function useCopyClipboardItems({ source, text = 'Copied to the clipboard', createToast = true }: { source?: MaybeRefOrGetter<Array<{ mime: string; content: string }>>; text?: string; createToast?: boolean } = {}) {
  function toClipboardItem(item: { mime: string; content: string }) {
    return new ClipboardItem({
      [item.mime]: new Blob([item.content], { type: item.mime }),
    });
  }
  const sourceClipboardItems = computed(() => (toValue(source) || []).map(toClipboardItem));
  const { copy, copied, ...rest } = useClipboardItems({
    source: sourceClipboardItems,
  });

  const message = useMessage();

  return {
    ...rest,
    isJustCopied: copied,
    async copy(content?: { mime: string; content: string }[], { notificationMessage }: { notificationMessage?: string } = {}) {
      if (source) {
        await copy();
      }
      else {
        await copy((content || []).map(toClipboardItem));
      }

      if (createToast) {
        message.success(notificationMessage ?? text);
      }
    },
  };
}
