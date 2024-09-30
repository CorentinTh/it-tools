import type { Flatten, Translator } from '@solid-primitives/i18n';

export type ToolI18nFactory = <T extends Record<string, string>>(args: { defaultDictionary: T }) => { t: Translator<Flatten<T>> };
