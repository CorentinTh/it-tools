import { Unlink } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Url parser',
  path: '/url-parser',
  description:
    'Parse an url string to get all the different parts (protocol, origin, params, port, username-password, ...)',
  keywords: ['url', 'parser', 'protocol', 'origin', 'params', 'port', 'username', 'password', 'href'],
  component: () => import('./url-parser.vue'),
  icon: Unlink,
});
