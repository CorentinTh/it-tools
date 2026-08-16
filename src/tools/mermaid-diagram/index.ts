import { AccountTreeOutlined } from '@vicons/material';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Development',
  order: 7,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.mermaid-diagram.title'),
  path: '/mermaid-diagram',
  description: translate('tools.mermaid-diagram.description'),
  keywords: ['mermaid', 'diagram', 'flowchart', 'sequence', 'class', 'state', 'entity relationship', 'svg', 'png'],
  component: () => import('./mermaid-diagram.vue'),
  icon: AccountTreeOutlined,
});
