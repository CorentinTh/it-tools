import { Database } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.data-storage-converter.title'),
  path: '/data-storage-converter',
  description: translate('tools.data-storage-converter.description'),
  keywords: [
    'data',
    'storage',
    'converter',
    'bytes',
    'bits',
    'kilobyte',
    'megabyte',
    'gigabyte',
    'terabyte',
    'petabyte',
    'kibibyte',
    'mebibyte',
    'gibibyte',
    'tebibyte',
    'pebibyte',
    'bandwidth',
    'transfer',
    'speed',
    'bps',
    'kbps',
    'mbps',
    'gbps',
  ],
  component: () => import('./data-storage-converter.vue'),
  icon: Database,
});
