import type { Flatten, Translator } from '@solid-primitives/i18n';
import type { defineTool } from './tools.models';

export type ToolI18nFactory = <T extends Record<string, string>>(args: { defaultDictionary: T }) => { t: Translator<Flatten<T>> };

export type ToolDefinition = ReturnType<typeof defineTool>;
