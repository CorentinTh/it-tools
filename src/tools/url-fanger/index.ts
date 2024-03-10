import { EyeOff } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Url Fanger',
  path: '/url-fanger',
  description: 'Defang/Refang an URL or email address',
  keywords: ['url', 'fanger', 'fange', 'defang', 'refang'],
  component: () => import('./url-fanger.vue'),
  icon: EyeOff,
  createdAt: new Date('2024-03-09'),
});
