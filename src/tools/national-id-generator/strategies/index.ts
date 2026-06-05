import type { IdNumberStrategy } from '../national-id-generator.types';
import { belgianStrategy } from './be';

/**
 * Registry of all supported country strategies.
 * To add a new country: import its strategy and add it here.
 * The Vue component derives the country dropdown and conditional UI
 * fields automatically from this map.
 */
export const strategies: Readonly<Record<string, IdNumberStrategy>> = {
  be: belgianStrategy,
};
