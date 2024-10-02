import type { Accessor, Component, ComponentProps } from 'solid-js';
import { Button } from '@/modules/ui/components/button';
import { omit } from 'lodash-es';
import { Show, splitProps } from 'solid-js';
import { useCopy } from './copy';

export const CopyButton: Component<{ textToCopy: Accessor<string | number>; toastMessage?: string } & ComponentProps<typeof Button>> = (props) => {
  const [localProps, buttonProps] = splitProps(props, ['textToCopy', 'toastMessage']);
  const { copy, getIsJustCopied } = useCopy(localProps.textToCopy, { toastMessage: localProps.toastMessage });

  return (
    <Button onClick={copy} {...omit(buttonProps, ['textToCopy', 'toastMessage'])}>
      <Show
        when={buttonProps.children}
        fallback={(

          getIsJustCopied()
            ? (
                <>
                  <div class="i-tabler-check mr-2 text-base" />
                  Copied!
                </>
              )
            : (
                <>
                  <div class="i-tabler-copy mr-2 text-base" />
                  Copy to clipboard
                </>
              )

        )}
      >
        {buttonProps.children}
      </Show>
    </Button>
  );
};
