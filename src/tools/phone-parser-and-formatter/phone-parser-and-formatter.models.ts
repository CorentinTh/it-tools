import type { CountryCode, NumberType } from 'libphonenumber-js/types';
import lookup from 'country-code-lookup';

export { formatTypeToHumanReadable, getFullCountryName, getDefaultCountryCode };

const typeToLabel: Record<NonNullable<NumberType>, string> = {
  MOBILE: 'Mobile',
  FIXED_LINE: 'Fixed line',
  FIXED_LINE_OR_MOBILE: 'Fixed line or mobile',
  PERSONAL_NUMBER: 'Personal number',
  PREMIUM_RATE: 'Premium rate',
  SHARED_COST: 'Shared cost',
  TOLL_FREE: 'Toll free',
  UAN: 'Universal access number',
  VOICEMAIL: 'Voicemail',
  VOIP: 'VoIP',
  PAGER: 'Pager',
};

function formatTypeToHumanReadable(type: NumberType): string | undefined {
  if (!type) {
    return undefined;
  }

  return typeToLabel[type];
}

function getFullCountryName(countryCode: string | undefined) {
  if (!countryCode) {
    return undefined;
  }

  return lookup.byIso(countryCode)?.country;
}

function getDefaultCountryCode({
  locale = window.navigator.language,
  defaultCode = 'FR',
}: { locale?: string; defaultCode?: CountryCode } = {}): CountryCode {
  const countryCode = locale.split('-')[1]?.toUpperCase();

  if (!countryCode) {
    return defaultCode;
  }

  return (lookup.byIso(countryCode)?.iso2 ?? defaultCode) as CountryCode;
}
