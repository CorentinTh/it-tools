import Fuse from 'fuse.js';
import type { PaletteOption } from './command-palette.types';

function normalize(value: string) {
  return value.trim().toLocaleLowerCase('en-US');
}

function routeText(option: PaletteOption) {
  return typeof option.to === 'string' ? option.to : '';
}

function exactRank(option: PaletteOption, query: string): number {
  const name = normalize(option.name);
  const route = normalize(routeText(option));
  const keywords = option.keywords?.map(normalize) ?? [];
  if (name === query) {
    return 0;
  }
  if (keywords.includes(query)) {
    return 1;
  }
  if (route === query || route.replace(/^\//, '') === query) {
    return 2;
  }
  if (name.startsWith(query)) {
    return 3;
  }
  if (keywords.some(keyword => keyword.startsWith(query))) {
    return 4;
  }
  if (route.includes(query)) {
    return 5;
  }
  return 10;
}

export function rankPaletteOptions(options: readonly PaletteOption[], prompt: string): PaletteOption[] {
  const query = normalize(prompt);
  if (!query) {
    return [];
  }

  const fuse = new Fuse([...options], {
    includeScore: true,
    keys: [
      { name: 'name', weight: 4 },
      { name: 'keywords', weight: 3 },
      { name: 'to', weight: 2 },
      { name: 'description', weight: 1 },
      { name: 'category', weight: 0.5 },
    ],
    threshold: 0.3,
  });

  return fuse.search(query)
    .map((result, index) => ({ option: result.item, fuzzyRank: result.score ?? 1, index }))
    .sort((left, right) => exactRank(left.option, query) - exactRank(right.option, query)
      || left.fuzzyRank - right.fuzzyRank
      || left.index - right.index)
    .map(result => result.option);
}

export function groupPaletteOptions(options: readonly PaletteOption[], limit?: number) {
  const grouped: Record<string, PaletteOption[]> = {};
  for (const option of options) {
    const category = grouped[option.category] ?? [];
    if (limit === undefined || category.length < limit) {
      category.push(option);
      grouped[option.category] = category;
    }
  }
  return grouped;
}
