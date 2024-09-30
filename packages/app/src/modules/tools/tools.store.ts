import { useI18n } from '../i18n/i18n.provider';
import { toolDefinitions } from './tools.registry';

export { useToolsStore };

function useToolsStore() {
  const { t } = useI18n();

  const tools = toolDefinitions.map((tool) => {
    return {
      ...tool,
      name: t(`tools.${tool.slug}.name` as any) ?? tool.slug,
      description: t(`tools.${tool.slug}.description` as any) ?? tool.slug,
    };
  });

  return { tools };
}
