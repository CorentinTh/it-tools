import type { Accessor, ParentComponent } from 'solid-js';
import type { ToolDefinition } from './tools.types';
import { flatten, translator } from '@solid-primitives/i18n';
import { merge } from 'lodash-es';
import { createContext, useContext } from 'solid-js';

type ToolProviderContext = {
  toolLocaleDict: Accessor<Record<string, string>>;
  tool: Accessor<Pick<ToolDefinition, 'icon' | 'dirName' | 'createdAt'> & { name: string; description: string }>;
};

const CurrentToolContext = createContext<ToolProviderContext>();

export function useCurrentTool<T>({ defaultDictionary }: { defaultDictionary: T }) {
  const context = useContext(CurrentToolContext);

  if (!context) {
    throw new Error('useCurrentTool must be used within a CurrentToolProvider');
  }

  const { toolLocaleDict, tool } = context;

  return {
    t: translator(() => flatten(merge({}, defaultDictionary, toolLocaleDict()))),
    getTool: tool,
  };
}

export const CurrentToolProvider: ParentComponent<ToolProviderContext> = (props) => {
  return (
    <CurrentToolContext.Provider value={props}>
      {props.children}
    </CurrentToolContext.Provider>
  );
};
