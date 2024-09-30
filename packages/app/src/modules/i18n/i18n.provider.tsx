import type { ParentComponent } from 'solid-js';
import type { LocaleKey } from './i18n.types';
import * as i18n from '@solid-primitives/i18n';
import { makePersisted } from '@solid-primitives/storage';
import { merge } from 'lodash-es';
import { createContext, createResource, createSignal, Show, useContext } from 'solid-js';
import defaultDict from '../../locales/en.json';
import { locales } from './i18n.constants';

export {
  useI18n,
};

type RawDictionary = typeof defaultDict;
type Dictionary = i18n.Flatten<RawDictionary>;

const RootI18nContext = createContext<{
  t: i18n.Translator<Dictionary>;
  getLocale: () => LocaleKey;
  setLocale: (locale: LocaleKey) => void;
  locales: typeof locales;
} | undefined>(undefined);

function useI18n() {
  const context = useContext(RootI18nContext);

  if (!context) {
    throw new Error('I18n context not found');
  }

  const { t, getLocale, setLocale, locales } = context;

  return {
    t,
    getLocale,
    setLocale,
    locales,
  };
}

async function fetchDictionary(locale: LocaleKey): Promise<Dictionary> {
  const dict: RawDictionary = (await import(`../../locales/${locale}.json`));
  const mergedDict = merge({}, defaultDict, dict);
  const flattened = i18n.flatten(mergedDict);

  return flattened;
}

export function getBrowserLocale(): LocaleKey {
  const browserLocale = navigator.language?.split('-')[0];

  if (!browserLocale) {
    return 'en';
  }

  return locales.find(locale => locale.key === browserLocale)?.key ?? 'en';
}

export const RootI18nProvider: ParentComponent = (props) => {
  const browserLocale = getBrowserLocale();
  const [getLocale, setLocale] = makePersisted(createSignal<LocaleKey>(browserLocale), { name: 'it_tools_locale', storage: localStorage });

  const [dict] = createResource(getLocale, fetchDictionary);

  return (
    <Show when={dict()}>
      {dict => (
        <RootI18nContext.Provider
          value={{
            t: i18n.translator(dict),
            getLocale,
            setLocale,
            locales,
          }}
        >
          {props.children}
        </RootI18nContext.Provider>
      )}
    </Show>
  );
};
