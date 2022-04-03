import type { ToolCategory } from './Tool';

export const toolsByCategory: ToolCategory[] = [];

export const tools = toolsByCategory.flatMap(({ components }) => components);
