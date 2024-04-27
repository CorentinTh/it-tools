import { useClipboard } from '@vueuse/core';
import { useMessage } from 'naive-ui';

function useCopy({ source, text = "Copied to the clipboard", createToast = true } = {}) {
  const { copy, copied, ...rest } = useClipboard({
    source,
    legacy: true
  });
  const message = useMessage();
  return {
    ...rest,
    isJustCopied: copied,
    async copy(content, { notificationMessage } = {}) {
      if (source) {
        await copy();
      } else {
        await copy(content);
      }
      if (createToast) {
        message.success(notificationMessage ?? text);
      }
    }
  };
}

export { useCopy as u };
