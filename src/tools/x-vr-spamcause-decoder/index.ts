import { RecordMail } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'X-VR-SpamCause Decoder',
  path: '/x-vr-spamcause-decoder',
  description: 'Decode X-VR-SPAMCAUSE header in OVH mails',
  keywords: ['ovh', 'vade', 'retro', 'vr', 'spam', 'spamcause', 'decoder'],
  component: () => import('./x-vr-spamcause-decoder.vue'),
  icon: RecordMail,
  createdAt: new Date('2024-08-15'),
});
