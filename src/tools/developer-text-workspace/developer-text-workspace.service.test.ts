import { describe, expect, it } from 'vitest';
import { transformDeveloperText } from './developer-text-workspace.service';

const baseTask = {
  find: '',
  replacement: '',
  regex: false,
  caseSensitive: true,
} as const;

describe('developer text transformations', () => {
  it('normalizes stack trace indentation and blank lines', () => {
    expect(transformDeveloperText({ ...baseTask, operation: 'stack-trace', source: ' Error: boom \r\n at run (app.ts:1:2)\r\n\r\n\r\nCaused by: bad ' }))
      .toBe('Error: boom\n  at run (app.ts:1:2)\n\nCaused by: bad');
  });

  it('performs literal and capture-aware regular expression replacement', () => {
    expect(transformDeveloperText({ ...baseTask, operation: 'smart-replace', source: 'A.b a.b', find: 'a.b', replacement: 'x', caseSensitive: false }))
      .toBe('x x');
    expect(transformDeveloperText({ ...baseTask, operation: 'smart-replace', source: 'api-v12', find: 'api-v(\\d+)', replacement: 'service-$1-$$-$&', regex: true }))
      .toBe('service-12-$-api-v12');
  });

  it('renders a stable sorted folder tree and rejects parent traversal', () => {
    expect(transformDeveloperText({ ...baseTask, operation: 'folder-tree', source: 'src/z.ts\nsrc/a.ts\nREADME.md' }))
      .toBe('├── README.md\n└── src/\n    ├── a.ts\n    └── z.ts');
    expect(() => transformDeveloperText({ ...baseTask, operation: 'folder-tree', source: '../secret' }))
      .toThrow('safe segments');
  });

  it('builds duplicate-safe Markdown anchors and ignores fenced examples', () => {
    const source = '# Guide\n## Install\n```md\n# Ignored\n```\n## Install';
    expect(transformDeveloperText({ ...baseTask, operation: 'markdown-toc', source }))
      .toBe('- [Guide](#guide)\n  - [Install](#install)\n  - [Install](#install-1)');
  });
});
