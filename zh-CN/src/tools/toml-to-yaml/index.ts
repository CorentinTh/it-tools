import { defineTool } from '../tool';
import BracketIcon from '~icons/mdi/code-brackets';

export const tool = defineTool({
  name: 'TOML 转 YAML',
  path: '/toml-to-yaml',
  description: '将TOML解析并转换到YAML',
  keywords: ['toml', 'yaml', '转', '在线', '转换', '解析'],
  component: () => import('./toml-to-yaml.vue'),
  icon: BracketIcon,
  createdAt: new Date('2023-06-23'),
});
