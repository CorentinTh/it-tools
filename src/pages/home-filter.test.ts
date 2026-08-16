import { describe, expect, it } from 'vitest';
import { HOME_SEARCH_MAX_LENGTH, createHomeQuery, filterHomeTools, readHomeFilter } from './home-filter';
import type { ToolWithCategory } from '@/tools/tools.types';

const tools = [
  { name: 'JSON Viewer', description: 'Inspect JSON', category: 'Development', keywords: ['tree', 'format'], path: '/json', isNew: false },
  { name: 'IPv6 Calculator', description: 'CIDR ranges', category: 'Network', keywords: ['subnet'], path: '/ipv6', isNew: false },
] as ToolWithCategory[];

describe('home-filter', () => {
  it('reads only bounded scalar harmless query state and rejects unknown categories', () => {
    expect(readHomeFilter({ q: ['secret', 'second'], category: 'Missing', extra: 'ignored' }, ['Development']))
      .toEqual({ query: '', category: '' });
    expect(readHomeFilter({ q: `  ${'x'.repeat(100)}  `, category: 'Development' }, ['Development']))
      .toEqual({ query: 'x'.repeat(HOME_SEARCH_MAX_LENGTH), category: 'Development' });
  });

  it('serializes only non-empty recognized filter fields', () => {
    expect(createHomeQuery({ query: '  json  ', category: 'Development' }))
      .toEqual({ q: 'json', category: 'Development' });
    expect(createHomeQuery({ query: ' ', category: '' })).toEqual({});
  });

  it('filters deterministically across names, descriptions, categories, and keywords', () => {
    expect(filterHomeTools(tools, { query: 'TREE', category: '' }).map(tool => tool.path)).toEqual(['/json']);
    expect(filterHomeTools(tools, { query: 'cidr', category: 'Network' }).map(tool => tool.path)).toEqual(['/ipv6']);
    expect(filterHomeTools(tools, { query: 'json', category: 'Network' })).toEqual([]);
  });
});
