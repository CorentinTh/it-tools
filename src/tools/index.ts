import { LockOpen } from '@vicons/tabler';
import type { ToolCategory } from './Tool';

import { tool as tokenGenerator } from './token-generator';
import { tool as hashText } from './hash-text';

export const toolsByCategory: ToolCategory[] = [
  {
    name: 'Crypto',
    icon: LockOpen,
    components: [tokenGenerator, hashText],
  },
];

export const tools = toolsByCategory.flatMap(({ components }) => components);
