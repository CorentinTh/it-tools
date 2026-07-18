import { describe, expect, it } from 'vitest';
import { getOuiPrefix } from './mac-address-lookup.service';

describe('MAC address vendor lookup', () => {
  it('normalizes common MAC separators and rejects incomplete prefixes', () => {
    expect(getOuiPrefix('20:37:06:12:34:56')).toBe('203706');
    expect(getOuiPrefix('20-37-06-12-34-56')).toBe('203706');
    expect(getOuiPrefix('2037.0612.3456')).toBe('203706');
    expect(getOuiPrefix(' 20:37:06 ')).toBe('203706');
    expect(getOuiPrefix('20:37')).toBe('');
    expect(getOuiPrefix('not-a-mac')).toBe('');
  });
});
