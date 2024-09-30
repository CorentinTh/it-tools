import type { LocaleKey } from '@/modules/i18n/i18n.types';
import type { Flatten } from '@solid-primitives/i18n';
import type { ToolI18nFactory } from '../tools.types';
import { useI18n } from '@/modules/i18n/i18n.provider';
import { safely } from '@corentinth/chisels';
import { flatten, translator } from '@solid-primitives/i18n';
import { useParams } from '@solidjs/router';
import { merge } from 'lodash-es';
import { type Component, createContext, createResource, lazy, Show } from 'solid-js';
import { CurrentToolProvider } from '../tools.provider';
import { getToolDefinitionBySlug } from '../tools.registry';

export const ToolPage: Component = () => {
  const params = useParams();
  const { getLocale } = useI18n();

  const toolDefinition = getToolDefinitionBySlug({ slug: params.toolSlug });
  const ToolComponent = lazy(toolDefinition.entryFile);

  const [toolDict] = createResource(getLocale, async (locale) => {
    const [dict = { default: {} }] = await safely(import(`../definitions/${toolDefinition.dirName}/locales/${locale}.json`));

    return dict;
  });

  return (
    <Show when={toolDict()}>
      {toolLocaleDict => (
        <CurrentToolProvider toolLocaleDict={toolLocaleDict}>
          <ToolComponent />
        </CurrentToolProvider>
      )}
    </Show>
  );
};
