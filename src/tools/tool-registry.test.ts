import { describe, expect, it } from 'vitest';
import { TOOL_CATEGORY_NAMES } from './tools.types';
import { tools, toolsByCategory } from './index';

describe('generated tool registry', () => {
  it('publishes one stable descriptor for every route', () => {
    expect(tools.length).toBeGreaterThanOrEqual(129);
    expect(new Set(tools.map(({ path }) => path)).size).toBe(tools.length);
    expect(tools.every(({ component }) => typeof component === 'function')).toBe(true);
  });

  it('keeps canonical category and per-category order in the generated output', () => {
    expect(toolsByCategory.map(({ name }) => name)).toEqual([...TOOL_CATEGORY_NAMES]);
    expect(toolsByCategory.flatMap(({ components }) => components)).toEqual(tools);

    for (const { name, components } of toolsByCategory) {
      expect(name).toBeTruthy();
      expect(components.length).toBeGreaterThan(0);
    }
  });

  it('uses canonical public paths as stable locale-independent identities', () => {
    for (const tool of tools) {
      expect(tool.path).toMatch(/^\/[a-z0-9-]+$/);
    }
  });
});
