import { LockOpen } from '@vicons/tabler';
import type { ToolCategory } from './Tool';

import { tool as tokenGenerator } from './token-generator';
import { tool as hashText } from './hash-text';
import { tool as uuidGenerator } from './uuid-generator';
import { tool as romanNumeralConverter } from './roman-numeral-converter';
import { tool as cypher } from './encryption';
import { tool as bip39 } from './bip39-generator';
import { tool as dateTimeConverter } from './date-time-converter';
import { tool as gitMemo } from './git-memo';
import { tool as baseConverter } from './integer-base-converter';

export const toolsByCategory: ToolCategory[] = [
  {
    name: 'Crypto',
    icon: LockOpen,
    components: [tokenGenerator, hashText, uuidGenerator, cypher, bip39],
  },
  {
    name: 'Converter',
    icon: LockOpen,
    components: [dateTimeConverter, baseConverter, romanNumeralConverter],
  },
  {
    name: 'Development',
    icon: LockOpen,
    components: [gitMemo],
  },
];

export const tools = toolsByCategory.flatMap(({ components }) => components);
export const toolsWithCategory = toolsByCategory.flatMap(({ components, name }) => components.map((tool) => ({ category: name, ...tool })));
