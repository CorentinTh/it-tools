import { defineTool } from '../tool';
import n7mIcon from './n7m-icon.svg?component';

export const tool = defineTool({
  name: 'Numeronym generator',
  path: '/numeronym-generator',
  description: 'A numeronym is a word where a number is used to form an abbreviation. For example, "i18n" is a numeronym of "internationalization" where 18 stands for the number of letters between the first i and the last n in the word.',
  keywords: ['numeronym', 'generator', 'abbreviation', 'i18n', 'a11y', 'l10n'],
  component: () => import('./numeronym-generator.vue'),
  icon: n7mIcon,
  createdAt: new Date('2023-11-05'),
});
