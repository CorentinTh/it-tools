import type { Component } from 'solid-js';

export { defineTool };

function defineTool(toolDefinition: {
  slug: string;
  entryFile: () => Promise<{ default: Component }>;
  dirName: string;
  icon: string;
  createdAt: Date;
}) {
  return {
    ...toolDefinition,
    key: toolDefinition.slug,
  };
}
