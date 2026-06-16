import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.json-to-types.title'),
  path: '/json-to-types',
  description: translate('tools.json-to-types.description'),
  keywords: ['json', 'typescript', 'go', 'struct', 'interface', 'type', 'convert', 'generate', 'definition'],
  component: () => import('./json-to-types.vue'),
  icon: Braces,
  createdAt: new Date('2026-06-04'),
});
