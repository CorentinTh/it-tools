import type { Component } from 'solid-js';

export { defineTool };

function defineTool(toolDefinition: {
  slug: string;
  entryFile: () => Promise<{ default: Component }>;
  currentDirUrl: string;
  icon: string;
  createdAt: Date;
}) {
  return {
    ...toolDefinition,
    key: toolDefinition.slug,
    dirName: toolDefinition.currentDirUrl.split('/').slice(-2)[0],
  };
}
