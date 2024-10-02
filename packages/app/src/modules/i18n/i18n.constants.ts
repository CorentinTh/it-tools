import { map } from 'lodash-es';

export const locales = [
  {
    key: 'en',
    file: 'en',
    name: 'English',
    switchToLabel: 'Change language to English',
  },
  {
    key: 'fr',
    file: 'fr',
    name: 'Français',
    switchToLabel: 'Changer la langue en Français',
  },
] as const;

export const localeKeys = map(locales, 'key');
