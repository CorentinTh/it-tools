import type { Accessor, ParentComponent } from 'solid-js';
import type { ToolI18nFactory } from './tools.types';
import { flatten, type Flatten, translator, type Translator } from '@solid-primitives/i18n';
import { merge } from 'lodash-es';
import { createContext, useContext } from 'solid-js';

type ToolProviderContext = {
  toolLocaleDict: Accessor<Record<string, string>>;
};

const CurrentToolContext = createContext<ToolProviderContext>();

export function useCurrentTool<T>({ defaultDictionary }: { defaultDictionary: T }) {
  const context = useContext(CurrentToolContext);

  if (!context) {
    throw new Error('useCurrentTool must be used within a CurrentToolProvider');
  }

  return {
    t: translator(() => flatten(merge({}, defaultDictionary, context.toolLocaleDict()))),
  };
}

export const CurrentToolProvider: ParentComponent<ToolProviderContext> = (props) => {
  return (
    <CurrentToolContext.Provider value={props}>
      {props.children}
    </CurrentToolContext.Provider>
  );
};
