import { LockOpen } from '@vicons/tabler';
import type { ToolCategory } from './Tool';

import { tool as tokenGenerator } from './token-generator';

export const toolsByCategory: ToolCategory[] = [
  {
    name: 'Crypto',
    icon: LockOpen,
    components: [tokenGenerator],
  },
];

export const tools = toolsByCategory.flatMap(({ components }) => components);
