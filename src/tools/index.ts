import { LockOpen } from '@vicons/tabler';
import type { ToolCategory } from './Tool';

import { tool as tokenGenerator } from './token-generator';
import { tool as hashText } from './hash-text';
import { tool as uuidGenerator } from './uuid-generator';

export const toolsByCategory: ToolCategory[] = [
  {
    name: 'Crypto',
    icon: LockOpen,
    components: [tokenGenerator, hashText, uuidGenerator],
  },
];

export const tools = toolsByCategory.flatMap(({ components }) => components);
