import { LockOpen } from '@vicons/tabler';
import type { ToolCategory } from './Tool';

import { tool as bcrypt } from './bcrypt';
import { tool as caseConverter } from './case-converter';
import { tool as colorConverter } from './color-converter';
import { tool as qrCodeGenerator } from './qr-code-generator';
import { tool as base64Converter } from './base64-converter';
import { tool as crontabGenerator } from './crontab-generator';
import { tool as textStatistics } from './text-statistics';
import { tool as tokenGenerator } from './token-generator';
import { tool as hashText } from './hash-text';
import { tool as uuidGenerator } from './uuid-generator';
import { tool as romanNumeralConverter } from './roman-numeral-converter';
import { tool as cypher } from './encryption';
import { tool as bip39 } from './bip39-generator';
import { tool as dateTimeConverter } from './date-time-converter';
import { tool as gitMemo } from './git-memo';
import { tool as baseConverter } from './integer-base-converter';
import { tool as urlEncoder } from './url-encoder';
import { tool as randomPortGenerator } from './random-port-generator';
import { tool as loremIpsumGenerator } from './lorem-ipsum-generator';

export const toolsByCategory: ToolCategory[] = [
  {
    name: 'Crypto',
    icon: LockOpen,
    components: [tokenGenerator, hashText, bcrypt, uuidGenerator, cypher, bip39],
  },
  {
    name: 'Converter',
    icon: LockOpen,
    components: [dateTimeConverter, baseConverter, romanNumeralConverter, base64Converter, colorConverter, caseConverter],
  },
  {
    name: 'Web',
    icon: LockOpen,
    components: [urlEncoder, qrCodeGenerator],
  },
  {
    name: 'Development',
    icon: LockOpen,
    components: [gitMemo, randomPortGenerator, crontabGenerator],
  },
  {
    name: 'Text',
    icon: LockOpen,
    components: [loremIpsumGenerator, textStatistics],
  },
];

export const tools = toolsByCategory.flatMap(({ components }) => components);
export const toolsWithCategory = toolsByCategory.flatMap(({ components, name }) => components.map((tool) => ({ category: name, ...tool })));
