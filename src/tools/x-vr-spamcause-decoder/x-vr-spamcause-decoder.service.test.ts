import { describe, expect, it } from 'vitest';
import { spamCauseDecode } from './x-vr-spamcause-decoder.service';

describe('x-vr-spamcause-decoder', () => {
  it('should decode X-VR-SPAMCAUSE', () => {
    expect(spamCauseDecode('gggruggvucftvghtrhhoucdtuddrfeelgedrvdduucetufdoteggodetrfdotffvucfrrhhofhhilhgvmecuqfggjfenuceurghilhhouhhtmecufedttdenucgohfhorhgsihguuggvnhfjughrucdlhedttddm')).toBe(
      'Vade Retro 01.394.21 AS+AV+AP+RT Profile: OVH; Bailout: 300; ^ForbiddenHdr (500)',
    );
  });
});
