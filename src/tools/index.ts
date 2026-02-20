import type { ToolCategory, ToolWithCategory } from './tools.types';

const modules = import.meta.glob<true, string, ToolWithCategory>('./*/index.ts', { eager: true, import: 'tool' });

export const toolsByCategory = Object.values(modules).reduce((la, moduleDef) => {
  let found = la.find(l => l.name === moduleDef.category);
  if (!found) {
    found = {
      name: moduleDef.category,
      components: [],
    };
    la.push(found);
  }
  found.components.push(moduleDef);
  return la;
}, [] as ToolCategory[]);

export const tools = toolsByCategory.flatMap(({ components }) => components);
export const toolsWithCategory = toolsByCategory.flatMap(({ components, name }) =>
  components.map(tool => ({ category: name, ...tool })),
);
