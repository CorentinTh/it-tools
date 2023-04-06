import { config } from '@/config';
import { isAfter, subWeeks } from 'date-fns';
import type { Tool } from './tools.types';

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export function defineTool(
  tool: WithOptional<Tool, 'isNew'>,
  { newTools }: { newTools: string[] } = { newTools: config.tools.newTools },
) {
  const isInNewToolConfig = newTools.includes(tool.name);
  const isRecentTool = tool.createdAt ? isAfter(tool.createdAt, subWeeks(new Date(), 2)) : false;

  const isNew = isInNewToolConfig || isRecentTool;

  return {
    isNew,
    ...tool,
  };
}
