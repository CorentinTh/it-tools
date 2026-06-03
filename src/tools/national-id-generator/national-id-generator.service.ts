/**
 * Re-exports from the Belgian strategy for backwards compatibility.
 * Tests and any other consumers that import from this file continue to work
 * without changes. New code should import from `./strategies/be` directly
 * or use the strategy registry in `./strategies/index`.
 */
export type { Gender, GenerateBelgianSSINOptions, BelgianSSIN } from './strategies/be';
export { generateBelgianSSIN, formatBelgianSSIN } from './strategies/be';
