import { Contrast } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Color contrast checker',
  path: '/color-contrast-checker',
  description: 'Check the contrast ratio of two colors against the WCAG 2.1 AA and AAA text and UI component thresholds',
  keywords: ['color', 'contrast', 'wcag', 'accessibility', 'a11y', 'ratio', 'luminance'],
  component: () => import('./color-contrast-checker.vue'),
  icon: Contrast,
  createdAt: new Date('2026-10-01'),
});
