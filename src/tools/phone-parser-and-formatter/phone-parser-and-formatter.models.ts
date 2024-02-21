import type { CountryCode, NumberType } from 'libphonenumber-js/types';
import lookup from 'country-code-lookup';
import { translate as t } from '@/plugins/i18n.plugin';

export { formatTypeToHumanReadable, getFullCountryName, getDefaultCountryCode };

const typeToLabel: Record<NonNullable<NumberType>, string> = {
  MOBILE: t('tools.phone-parser-and-formatter.mobile'),
  FIXED_LINE: t('tools.phone-parser-and-formatter.fixedLine'),
  FIXED_LINE_OR_MOBILE: t('tools.phone-parser-and-formatter.fixedLineOrMobile'),
  PERSONAL_NUMBER: t('tools.phone-parser-and-formatter.personalNumber'),
  PREMIUM_RATE: t('tools.phone-parser-and-formatter.premiumRate'),
  SHARED_COST: t('tools.phone-parser-and-formatter.sharedCost'),
  TOLL_FREE: t('tools.phone-parser-and-formatter.tollFree'),
  UAN: t('tools.phone-parser-and-formatter.UAN'),
  VOICEMAIL: t('tools.phone-parser-and-formatter.voicemail'),
  VOIP: t('tools.phone-parser-and-formatter.VoIP'),
  PAGER: t('tools.phone-parser-and-formatter.pager'),
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
