import { config } from '@/config';
import type { Tool } from './tools.types';

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export function defineTool(
  tool: WithOptional<Tool, 'isNew'>,
  { newTools }: { newTools: string[] } = { newTools: config.tools.newTools },
) {
  const isNew = newTools.includes(tool.name);

  return {
    isNew,
    ...tool,
  };
}
