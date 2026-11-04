import { ClearFormatting } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Whitespace cleaner',
  path: '/whitespace-cleaner',
  description: 'Clean terminal and Claude Code output: strip line numbers, ANSI codes, box drawing, bullet markers, diff markers, and extra whitespace.',
  keywords: ['whitespace', 'cleaner', 'clean', 'claude', 'terminal', 'ansi', 'indent', 'trailing', 'line', 'numbers', 'box', 'drawing', 'diff', 'unwrap', 'markdown'],
  component: () => import('./whitespace-cleaner.vue'),
  icon: ClearFormatting,
  createdAt: new Date('2026-11-04'),
});
