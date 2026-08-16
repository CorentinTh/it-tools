import { describe, expect, it } from 'vitest';
import { groupPaletteOptions, rankPaletteOptions } from './command-palette.search';
import type { PaletteOption } from './command-palette.types';

const options: PaletteOption[] = [
  { name: 'JSON Viewer', category: 'Tools', to: '/json-viewer', keywords: ['tree', 'inspect'] },
  { name: 'JSON Repair & Query', category: 'Tools', to: '/json-repair-query', keywords: ['repair', 'JSONPath'] },
  { name: 'Repair notes', category: 'Actions', keywords: ['json'] },
];

describe('command palette search', () => {
  it('ranks exact titles, keywords, and paths before fuzzy descriptions', () => {
    expect(rankPaletteOptions(options, 'JSON Viewer')[0]?.name).toBe('JSON Viewer');
    expect(rankPaletteOptions(options, 'repair')[0]?.name).toBe('JSON Repair & Query');
    expect(rankPaletteOptions(options, 'json-repair-query')[0]?.name).toBe('JSON Repair & Query');
  });

  it('returns no default result for an empty prompt', () => {
    expect(rankPaletteOptions(options, '   ')).toEqual([]);
  });

  it('can limit each category or expose the complete bounded result', () => {
    const many = Array.from({ length: 8 }, (_, index): PaletteOption => ({ name: `Tool ${index}`, category: 'Tools' }));
    expect(groupPaletteOptions(many, 5).Tools).toHaveLength(5);
    expect(groupPaletteOptions(many).Tools).toHaveLength(8);
  });
});
