import { map } from 'lodash-es';

export const locales = [
  {
    key: 'en',
    file: 'en',
    name: 'English',
  },
  {
    key: 'fr',
    file: 'fr',
    name: 'Français',
  },
] as const;

export const localeKeys = map(locales, 'key');
