import { joinUrlPaths } from '@corentinth/chisels';
import { toolDefinitions } from './tools.registry';

export const useToolsStore = defineStore('tools', () => {
  const { t, locale } = useI18n();

  const localizedTools = computed(() => {
    return toolDefinitions.map((tool) => {
      const { key, slug } = tool;

      return {
        ...tool,
        title: t(`tools.${key}.title`),
        description: t(`tools.${key}.description`),
        path: `/${joinUrlPaths(locale.value, slug)}`,
      };
    });
  });

  return {
    tools: localizedTools,
    getToolByKey({ key }: { key: unknown }) {
      if (typeof key !== 'string') {
        throw new TypeError('Invalid key');
      }

      const tool = localizedTools.value.find(tool => tool.key === key);

      if (!tool) {
        throw new Error('Tool not found');
      }

      return tool;
    },
  };
});
