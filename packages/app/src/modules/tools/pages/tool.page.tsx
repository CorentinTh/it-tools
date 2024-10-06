import { useI18n } from '@/modules/i18n/i18n.provider';
import { safely } from '@corentinth/chisels';
import { useParams } from '@solidjs/router';
import { type Component, createResource, lazy, Show } from 'solid-js';
import { CurrentToolProvider } from '../tools.provider';
import { getToolDefinitionBySlug } from '../tools.registry';

export const ToolPage: Component = () => {
  const params = useParams();
  const { getLocale, t } = useI18n();

  const toolDefinition = getToolDefinitionBySlug({ slug: params.toolSlug });
  const ToolComponent = lazy(toolDefinition.entryFile);

  const [toolDict] = createResource(getLocale, async (locale) => {
    const [dict, error] = await safely(import(`../definitions/${toolDefinition.dirName}/locales/${locale}.json`));

    if (error) {
      console.error(error);
    }

    return dict ?? { default: {} };
  });

  return (
    <Show when={toolDict()}>
      {toolLocaleDict => (
        <CurrentToolProvider
          toolLocaleDict={toolLocaleDict}
          tool={() => ({
            icon: toolDefinition.icon,
            dirName: toolDefinition.dirName,
            createdAt: toolDefinition.createdAt,
            name: t(`tools.${toolDefinition.slug}.name` as any),
            description: t(`tools.${toolDefinition.slug}.description` as any),
          })}
        >
          <ToolComponent />
        </CurrentToolProvider>
      )}
    </Show>
  );
};
