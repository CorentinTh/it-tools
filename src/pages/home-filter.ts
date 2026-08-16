import type { LocationQuery, LocationQueryRaw } from 'vue-router';
import type { ToolWithCategory } from '@/tools/tools.types';

export const HOME_SEARCH_MAX_LENGTH = 80;

export interface HomeFilterState {
  category: string
  query: string
}

function singleQueryValue(value: LocationQuery[string]): string {
  return typeof value === 'string' ? value : '';
}

export function normalizeHomeSearch(value: string): string {
  return value.trim().slice(0, HOME_SEARCH_MAX_LENGTH);
}

export function readHomeFilter(query: LocationQuery, categories: readonly string[]): HomeFilterState {
  const requestedCategory = singleQueryValue(query.category);
  return {
    category: categories.includes(requestedCategory) ? requestedCategory : '',
    query: normalizeHomeSearch(singleQueryValue(query.q)),
  };
}

export function createHomeQuery({ category, query }: HomeFilterState): LocationQueryRaw {
  const normalizedQuery = normalizeHomeSearch(query);
  return {
    ...(normalizedQuery ? { q: normalizedQuery } : {}),
    ...(category ? { category } : {}),
  };
}

export function filterHomeTools(tools: readonly ToolWithCategory[], filter: HomeFilterState): ToolWithCategory[] {
  const normalizedQuery = normalizeHomeSearch(filter.query).normalize('NFKC').toLocaleLowerCase('en');

  return tools.filter((tool) => {
    if (filter.category && tool.category !== filter.category) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }

    return [tool.name, tool.description, tool.category, ...tool.keywords]
      .some(value => value.normalize('NFKC').toLocaleLowerCase('en').includes(normalizedQuery));
  });
}
