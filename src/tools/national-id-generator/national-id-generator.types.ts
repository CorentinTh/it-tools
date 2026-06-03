export type Gender = 'male' | 'female';

/**
 * Common options passed to every strategy's generate() method.
 * Each strategy only reads the fields it understands and ignores the rest.
 */
export interface GenerateOptions {
  birthYear?: number
  /** 1–12 */
  birthMonth?: number
  /** 1–31 */
  birthDay?: number
  gender?: Gender
  fictitious?: boolean
}

/** Minimal output every strategy must produce. */
export interface GeneratedId {
  raw: string
  formatted: string
}

/**
 * Strategy interface for country-specific national ID number generators.
 *
 * To add support for a new country:
 *  1. Create `strategies/<cc>.ts` and export a const implementing this interface.
 *  2. Register it in `strategies/index.ts`.
 *  The Vue component automatically picks up the new country and conditionally
 *  renders only the fields the strategy declares it supports.
 */
export interface IdNumberStrategy {
  /** ISO 3166-1 alpha-2 country code, used as the registry key. */
  readonly countryCode: string
  /** Human-readable label shown in the country selector. */
  readonly label: string
  /** True when the country's ID encodes a date of birth. */
  readonly supportsBirthDate: boolean
  /** True when the country's ID encodes gender. */
  readonly supportsGender: boolean
  /** True when a "fictitious / non-assigned" serial range is available. */
  readonly supportsFictitious: boolean
  generate(opts?: GenerateOptions): GeneratedId
}
