import { describe, expect, it } from 'vitest';
import { convertMacCISCO, convertMacCanonical, convertMacCanonicalIEEE, convertMacCanonicalIETF } from './mac-address-converter.service';

describe('mac-address-converter', () => {
  it('Convert MAC Address to given format', async () => {
    expect(convertMacCanonical('')).to.equal('');

    const macValue = 'AA:BB:CC:DD:EE:FF';

    expect(convertMacCanonicalIETF(macValue)).to.equal('aa:bb:cc:dd:ee:ff');
    expect(convertMacCanonical(macValue)).to.equal('AA.BB.CC.DD.EE.FF');
    expect(convertMacCanonicalIEEE(macValue)).to.equal('AA-BB-CC-DD-EE-FF');
    expect(convertMacCISCO(macValue)).to.equal('aabb.ccdd.eeff');
  });
});
