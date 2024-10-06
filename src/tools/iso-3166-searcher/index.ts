import { Flag } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'ISO 3166 Country Codes Searcher',
  path: '/iso-3166-searcher',
  description: 'Allow searching for Country Code (ISO 3166) and info',
  keywords: ['iso', 'iso2', 'iso3', 'phone', 'currency', 'timezones', 'domain', 'lang', 'iso3166', 'country', 'ccltd', 'searcher'],
  component: () => import('./iso-3166-searcher.vue'),
  icon: Flag,
  createdAt: new Date('2024-04-20'),
});
