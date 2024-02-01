import { Keyboard } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.keycode-info.title'),
  path: '/keycode-info',
  description: translate('tools.keycode-info.description'),
  keywords: [
    'keycode',
    'info',
    'code',
    'javascript',
    'event',
    'keycodes',
    'which',
    'keyboard',
    'press',
    'modifier',
    'alt',
    'ctrl',
    'meta',
    'shift',
  ],
  component: () => import('./keycode-info.vue'),
  icon: Keyboard,
});
