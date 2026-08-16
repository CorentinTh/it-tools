import type { OutputBundle } from 'rollup';

export interface StandaloneBuildOptions {
  fontsDirectory: string
  outputFileName?: string
  publicDirectory: string
}

export function inlineStandaloneBundle(
  bundle: OutputBundle,
  options: StandaloneBuildOptions,
): boolean;
