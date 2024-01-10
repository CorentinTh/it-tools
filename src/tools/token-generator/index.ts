import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.token-generator.title'),
  path: '/token-generator',
  description: t('tools.token-generator.description'),
  keywords: [
    'token',
    'random',
    'string',
    'alphanumeric',
    'symbols',
    'number',
    'letters',
    'lowercase',
    'uppercase',
    'password',
  ],
  component: () => import('./token-generator.tool.vue'),
  icon: ArrowsShuffle,
});
