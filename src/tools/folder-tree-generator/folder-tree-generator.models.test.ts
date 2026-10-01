import { describe, expect, it } from 'vitest';
import { buildTree, renderTree } from './folder-tree-generator.models';

describe('folder-tree-generator: buildTree', () => {
  it('builds a hierarchy from indentation', () => {
    const tree = buildTree('src\n  main.ts\n  tools\n    index.ts\npackage.json');
    expect(tree).toEqual([
      {
        name: 'src',
        children: [
          { name: 'main.ts', children: [] },
          { name: 'tools', children: [{ name: 'index.ts', children: [] }] },
        ],
      },
      { name: 'package.json', children: [] },
    ]);
  });

  it('treats tabs as four spaces', () => {
    const tree = buildTree('a\n\tb');
    expect(tree[0]?.children[0]?.name).toBe('b');
  });

  it('skips empty lines', () => {
    const tree = buildTree('a\n\n  b\n');
    expect(tree).toEqual([{ name: 'a', children: [{ name: 'b', children: [] }] }]);
  });

  it('returns to root level after deep nesting', () => {
    const tree = buildTree('a\n  b\n    c\nd');
    expect(tree).toHaveLength(2);
    expect(tree[1]?.name).toBe('d');
  });
});

describe('folder-tree-generator: renderTree', () => {
  it('renders box-drawing output like the tree command', () => {
    const tree = buildTree('src\n  main.ts\n  tools\n    index.ts\npackage.json');
    expect(renderTree(tree)).toBe([
      'src',
      '├── main.ts',
      '└── tools',
      '    └── index.ts',
      'package.json',
    ].join('\n'));
  });

  it('uses the vertical continuation line for non-last parents', () => {
    const tree = buildTree('a\n  b\n  c');
    expect(renderTree(tree)).toBe(['a', '├── b', '└── c'].join('\n'));
  });

  it('renders nested siblings with continuation prefixes', () => {
    const tree = buildTree('a\n  x\n  y\n    deep\nz');
    expect(renderTree(tree)).toBe([
      'a',
      '├── x',
      '└── y',
      '    └── deep',
      'z',
    ].join('\n'));
  });
});
