import { LockOpen } from '@vicons/tabler';
import type { ToolCategory } from './tool';

import { tool as base64Converter } from './base64-converter';
import { tool as bcrypt } from './bcrypt';
import { tool as bip39 } from './bip39-generator';
import { tool as caseConverter } from './case-converter';
import { tool as chronometer } from './chronometer';
import { tool as colorConverter } from './color-converter';
import { tool as crontabGenerator } from './crontab-generator';
import { tool as dateTimeConverter } from './date-time-converter';
import { tool as deviceInformation } from './device-information';
import { tool as cypher } from './encryption';
import { tool as etaCalculator } from './eta-calculator';
import { tool as gitMemo } from './git-memo';
import { tool as hashText } from './hash-text';
import { tool as htmlEntities } from './html-entities';
import { tool as baseConverter } from './integer-base-converter';
import { tool as jsonViewer } from './json-viewer';
import { tool as loremIpsumGenerator } from './lorem-ipsum-generator';
import { tool as mathEvaluator } from './math-evaluator';
import { tool as qrCodeGenerator } from './qr-code-generator';
import { tool as randomPortGenerator } from './random-port-generator';
import { tool as romanNumeralConverter } from './roman-numeral-converter';
import { tool as sqlPrettify } from './sql-prettify';
import { tool as textStatistics } from './text-statistics';
import { tool as tokenGenerator } from './token-generator';
import { tool as urlEncoder } from './url-encoder';
import { tool as urlParser } from './url-parser';
import { tool as uuidGenerator } from './uuid-generator';

export const toolsByCategory: ToolCategory[] = [
  {
    name: 'Crypto',
    icon: LockOpen,
    components: [tokenGenerator, hashText, bcrypt, uuidGenerator, cypher, bip39],
  },
  {
    name: 'Converter',
    icon: LockOpen,
    components: [
      dateTimeConverter,
      baseConverter,
      romanNumeralConverter,
      base64Converter,
      colorConverter,
      caseConverter,
    ],
  },
  {
    name: 'Web',
    icon: LockOpen,
    components: [urlEncoder, htmlEntities, qrCodeGenerator, urlParser, deviceInformation],
  },
  {
    name: 'Development',
    icon: LockOpen,
    components: [gitMemo, randomPortGenerator, crontabGenerator, jsonViewer, sqlPrettify],
  },
  {
    name: 'Math',
    icon: LockOpen,
    components: [mathEvaluator, etaCalculator],
  },
  {
    name: 'Measurement',
    icon: LockOpen,
    components: [chronometer],
  },
  {
    name: 'Text',
    icon: LockOpen,
    components: [loremIpsumGenerator, textStatistics],
  },
];

export const tools = toolsByCategory.flatMap(({ components }) => components);
export const toolsWithCategory = toolsByCategory.flatMap(({ components, name }) =>
  components.map((tool) => ({ category: name, ...tool })),
);
