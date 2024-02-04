import { defineTool } from '../tool';

import BracketIcon from '~icons/mdi/code-brackets';

export const tool = defineTool({
  name: 'TOML 转 JSON',
  path: '/toml-to-json',
  description: '将TOML解析并转换到JSON',
  keywords: ['toml', 'json', '转', '转换', '在线', '解析'],
  component: () => import('./toml-to-json.vue'),
  icon: BracketIcon,
  createdAt: new Date('2023-06-23'),
});
