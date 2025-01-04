import { isAfter, subWeeks } from 'date-fns';
import type { ToolWithCategory } from './tools.types';

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export function defineTool(tool: WithOptional<ToolWithCategory, 'isNew'>) {
  const isNew = tool.createdAt ? isAfter(tool.createdAt, subWeeks(new Date(), 2)) : false;

  return {
    isNew,
    ...tool,
  };
}
