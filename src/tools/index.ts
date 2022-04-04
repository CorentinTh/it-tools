import { LockOpen } from '@vicons/tabler';
import type { ToolCategory } from './Tool';

import { tool as tokenGenerator } from './token-generator';
import { tool as hashText } from './hash-text';
import { tool as uuidGenerator } from './uuid-generator';
import { tool as romanNumeralConverter } from './roman-numeral-converter';

export const toolsByCategory: ToolCategory[] = [
  {
    name: 'Crypto',
    icon: LockOpen,
    components: [tokenGenerator, hashText, uuidGenerator],
  },
  {
    name: 'Converter',
    icon: LockOpen,
    components: [romanNumeralConverter],
  },
];

export const tools = toolsByCategory.flatMap(({ components }) => components);
