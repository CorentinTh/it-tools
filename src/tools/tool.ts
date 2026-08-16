import type { Tool } from './tools.types';

type ToolSource = Omit<Tool, 'isNew'> & Partial<Pick<Tool, 'isNew'>>;

const NEW_TOOL_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

export function defineTool(tool: ToolSource): Tool {
  const isNew = tool.createdAt
    ? tool.createdAt.getTime() > Date.now() - NEW_TOOL_WINDOW_MS
    : false;

  return {
    isNew,
    ...tool,
  };
}
