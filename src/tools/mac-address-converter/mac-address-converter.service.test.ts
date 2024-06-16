import { describe, expect, it } from 'vitest';
import {
  convertMacCISCO, convertMacCanonical,
  convertMacCanonicalIEEE, convertMacCanonicalIETF,
  convertMacToEUI64CISCO, convertMacToEUI64CanonicalIEEE,
  convertMacToEUI64CanonicalIETF, convertMacToLinkLocalIPv6,
  convertMacToNumber,
} from './mac-address-converter.service';

describe('mac-address-converter', () => {
  it('Convert MAC Address to given format', async () => {
    expect(convertMacCanonical('')).to.equal('');

    const macValue = '00:0a:95:9d:68:16';

    expect(convertMacCanonicalIETF(macValue)).to.equal('00:0a:95:9d:68:16');
    expect(convertMacCanonical(macValue)).to.equal('00.0a.95.9d.68.16');
    expect(convertMacCanonicalIEEE(macValue)).to.equal('00-0A-95-9D-68-16');
    expect(convertMacCISCO(macValue)).to.equal('000a.959d.6816');

    expect(convertMacToEUI64CanonicalIETF(macValue, true)).to.equal('02:0a:95:ff:fe:9d:68:16'); // NOSONAR
    expect(convertMacToEUI64CanonicalIETF(macValue, false)).to.equal('00:0a:95:ff:fe:9d:68:16'); // NOSONAR
    expect(convertMacToEUI64CanonicalIEEE(macValue, true)).to.equal('02-0A-95-FF-FE-9D-68-16');
    expect(convertMacToEUI64CanonicalIEEE(macValue, false)).to.equal('00-0A-95-FF-FE-9D-68-16');
    expect(convertMacToEUI64CISCO(macValue, true)).to.equal('020a.95ff.fe9d.6816');
    expect(convertMacToEUI64CISCO(macValue, false)).to.equal('000a.95ff.fe9d.6816');
    expect(convertMacToNumber(macValue)).to.equal(45459793942);
    expect(convertMacToLinkLocalIPv6(macValue)).to.equal(':fe80::20a:95ff:fe9d:6816');
  });
});
