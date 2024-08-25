import { World } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Punycode Converter',
  path: '/punycode-converter',
  description: 'Convert international unicode domain names or emails from/to ASCII Punycode version',
  keywords: ['punycode', 'converter', 'rfc3492', 'bootstring', 'domain', 'dns'],
  component: () => import('./punycode-converter.vue'),
  icon: World,
  createdAt: new Date('2024-08-15'),
});
