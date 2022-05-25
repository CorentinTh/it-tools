import { Link } from '@vicons/tabler';
import type { ITool } from '../tool';

export const tool: ITool = {
  name: 'Encode/decode url formatted strings',
  path: '/url-encoder',
  description: 'Encode to url-encoded format (also known as "percent-encoded") or decode from it.',
  keywords: ['url', 'encode', 'decode', 'percent', '%20', 'format'],
  component: () => import('./url-encoder.vue'),
  icon: Link,
};
