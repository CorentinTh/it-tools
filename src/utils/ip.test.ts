import { describe, expect, it } from 'vitest';
import { getIPNetworkType, getNetworksCount, getSubnets, parseAsCIDR, to6to4Prefix, toARPA, toIPv4MappedAddress, toIPv4MappedAddressDecimal } from './ip';

describe('ipv4/6 util', () => {
  describe('parseAsCIDR', () => {
    it('returns cidr', () => {
      expect(parseAsCIDR('1.1.1.1/6')).to.eql('1.1.1.1/6'); // NOSONAR
      expect(parseAsCIDR('172.16.2.2/16')).to.eql('172.16.2.2/16'); // NOSONAR
      expect(parseAsCIDR('1a:b:c::d:e:f/ffff:ffff:f4ff:ffff:ffff:ff5f:ffff:ff00')).to.eql(''); // NOSONAR
      expect(parseAsCIDR('10.1.2.3/255.255.255.252')).to.eql('10.1.2.0/30'); // NOSONAR
      expect(parseAsCIDR('10.*.0.*')).to.eql(''); // NOSONAR
      expect(parseAsCIDR('10.1.0.*')).to.eql('10.1.0.0/24'); // NOSONAR
      expect(parseAsCIDR('10.2.*.*')).to.eql('10.2.0.0/16'); // NOSONAR
      expect(parseAsCIDR('a:b:0:8000::/ffff:ffff:ffff:8000::')).to.eql('a:b:0:8000::/49'); // NOSONAR
      expect(parseAsCIDR('::/::')).to.eql('::/0'); // NOSONAR
      expect(parseAsCIDR('10.20.30.64-10.20.30.127')).to.eql('10.20.30.64/26'); // NOSONAR
      expect(parseAsCIDR('10.0.128.0/255.0.128.0')).to.eql(''); // NOSONAR
      expect(parseAsCIDR('a::bc:1234/128')).to.eql('a::bc:1234/128'); // NOSONAR
      expect(parseAsCIDR('a::bc:ff00-a::bc:ff0f')).to.eql('a::bc:ff00/124'); // NOSONAR
      expect(parseAsCIDR('10.0.1.1/255.255.1.0')).to.eql(''); // NOSONAR
      expect(parseAsCIDR('10.0.0.0/255.255.0.0')).to.eql('10.0.0.0/16'); // NOSONAR
    });
  }); // NOSONAR
  describe('getSubnets', () => {
    it('returns subnets', () => {
      expect(getSubnets('1.1.1.1/1')).to.eql([ // NOSONAR
        '0.0.0.0/1', // NOSONAR
        '128.0.0.0/1', // NOSONAR
      ]); // NOSONAR
      expect(getSubnets('1.1.1.1/6')).to.eql([ // NOSONAR
        '0.0.0.0/6', // NOSONAR
        '4.0.0.0/6', // NOSONAR
        '8.0.0.0/6', // NOSONAR
        '12.0.0.0/6', // NOSONAR
        '16.0.0.0/6', // NOSONAR
        '20.0.0.0/6', // NOSONAR
        '24.0.0.0/6', // NOSONAR
        '28.0.0.0/6', // NOSONAR
        '32.0.0.0/6', // NOSONAR
        '36.0.0.0/6', // NOSONAR
        '40.0.0.0/6', // NOSONAR
        '44.0.0.0/6', // NOSONAR
        '48.0.0.0/6', // NOSONAR
        '52.0.0.0/6', // NOSONAR
        '56.0.0.0/6', // NOSONAR
        '60.0.0.0/6', // NOSONAR
        '64.0.0.0/6', // NOSONAR
        '68.0.0.0/6', // NOSONAR
        '72.0.0.0/6', // NOSONAR
        '76.0.0.0/6', // NOSONAR
        '80.0.0.0/6', // NOSONAR
        '84.0.0.0/6', // NOSONAR
        '88.0.0.0/6', // NOSONAR
        '92.0.0.0/6', // NOSONAR
        '96.0.0.0/6', // NOSONAR
        '100.0.0.0/6', // NOSONAR
        '104.0.0.0/6', // NOSONAR
        '108.0.0.0/6', // NOSONAR
        '112.0.0.0/6', // NOSONAR
        '116.0.0.0/6', // NOSONAR
        '120.0.0.0/6', // NOSONAR
        '124.0.0.0/6', // NOSONAR
        '128.0.0.0/6', // NOSONAR
        '132.0.0.0/6', // NOSONAR
        '136.0.0.0/6', // NOSONAR
        '140.0.0.0/6', // NOSONAR
        '144.0.0.0/6', // NOSONAR
        '148.0.0.0/6', // NOSONAR
        '152.0.0.0/6', // NOSONAR
        '156.0.0.0/6', // NOSONAR
        '160.0.0.0/6', // NOSONAR
        '164.0.0.0/6', // NOSONAR
        '168.0.0.0/6', // NOSONAR
        '172.0.0.0/6', // NOSONAR
        '176.0.0.0/6', // NOSONAR
        '180.0.0.0/6', // NOSONAR
        '184.0.0.0/6', // NOSONAR
        '188.0.0.0/6', // NOSONAR
        '192.0.0.0/6', // NOSONAR
        '196.0.0.0/6', // NOSONAR
        '200.0.0.0/6', // NOSONAR
        '204.0.0.0/6', // NOSONAR
        '208.0.0.0/6', // NOSONAR
        '212.0.0.0/6', // NOSONAR
        '216.0.0.0/6', // NOSONAR
        '220.0.0.0/6', // NOSONAR
        '224.0.0.0/6', // NOSONAR
        '228.0.0.0/6', // NOSONAR
        '232.0.0.0/6', // NOSONAR
        '236.0.0.0/6', // NOSONAR
        '240.0.0.0/6', // NOSONAR
        '244.0.0.0/6', // NOSONAR
        '248.0.0.0/6', // NOSONAR
        '252.0.0.0/6', // NOSONAR
      ]); // NOSONAR
      expect(getSubnets('1.1.1.1/8')).to.eql([]); // NOSONAR
      expect(getSubnets('1.1.1.1/11')).to.eql([ // NOSONAR
        '1.0.0.0/11', // NOSONAR
        '1.32.0.0/11', // NOSONAR
        '1.64.0.0/11', // NOSONAR
        '1.96.0.0/11', // NOSONAR
        '1.128.0.0/11', // NOSONAR
        '1.160.0.0/11', // NOSONAR
        '1.192.0.0/11', // NOSONAR
        '1.224.0.0/11', // NOSONAR
      ]); // NOSONAR
      expect(getSubnets('172.16.2.2/16')).to.eql([]); // NOSONAR
      expect(getSubnets('172.16.2.2/26')).to.eql([ // NOSONAR
        '172.16.2.0/26', // NOSONAR
        '172.16.2.64/26', // NOSONAR
        '172.16.2.128/26', // NOSONAR
        '172.16.2.192/26', // NOSONAR
      ]); // NOSONAR
      expect(getSubnets('172.16.2.2/31').length).to.eql(128); // NOSONAR
      expect(getSubnets('255.255.255.0/32')).to.eql([]); // NOSONAR
      expect(getSubnets('2001:db8:0:85a3::ac1f:8001/62')).to.eql([]); // NOSONAR
      expect(getSubnets('2001:db8:0:85a3:0:0:ac1f:8001/62')).to.eql([]); // NOSONAR
      expect(getSubnets('2001:db8:0:85a3::ac1f:8001/112')).to.eql([]); // NOSONAR
      expect(getSubnets('2001:db8:0:85a3:0:0:ac1f:8001/112')).to.eql([]); // NOSONAR
    }); // NOSONAR
  }); // NOSONAR
  describe('getNetworksCount', () => {
    it('returns networks count', () => {
      expect(getNetworksCount('1.1.1.1/1')).to.eql(2); // NOSONAR
      expect(getNetworksCount('1.1.1.1/2')).to.eql(4); // NOSONAR
      expect(getNetworksCount('1.1.1.1/3')).to.eql(8); // NOSONAR
      expect(getNetworksCount('1.1.1.1/4')).to.eql(16); // NOSONAR
      expect(getNetworksCount('1.1.1.1/5')).to.eql(32); // NOSONAR
      expect(getNetworksCount('1.1.1.1/6')).to.eql(64); // NOSONAR
      expect(getNetworksCount('1.1.1.1/7')).to.eql(128); // NOSONAR
      expect(getNetworksCount('1.1.1.1/8')).to.eql(0); // NOSONAR
      expect(getNetworksCount('1.1.1.1/9')).to.eql(2); // NOSONAR
      expect(getNetworksCount('1.1.1.1/10')).to.eql(4); // NOSONAR
      expect(getNetworksCount('1.1.1.1/11')).to.eql(8); // NOSONAR
      expect(getNetworksCount('1.1.1.1/12')).to.eql(16); // NOSONAR
      expect(getNetworksCount('1.1.1.1/13')).to.eql(32); // NOSONAR
      expect(getNetworksCount('1.1.1.1/14')).to.eql(64); // NOSONAR
      expect(getNetworksCount('1.1.1.1/15')).to.eql(128); // NOSONAR
      expect(getNetworksCount('1.1.1.1/16')).to.eql(0); // NOSONAR
      expect(getNetworksCount('1.1.1.1/17')).to.eql(2); // NOSONAR
      expect(getNetworksCount('1.1.1.1/18')).to.eql(4); // NOSONAR
      expect(getNetworksCount('1.1.1.1/19')).to.eql(8); // NOSONAR
      expect(getNetworksCount('1.1.1.1/20')).to.eql(16); // NOSONAR
      expect(getNetworksCount('1.1.1.1/21')).to.eql(32); // NOSONAR
      expect(getNetworksCount('1.1.1.1/22')).to.eql(64); // NOSONAR
      expect(getNetworksCount('1.1.1.1/23')).to.eql(128); // NOSONAR
      expect(getNetworksCount('1.1.1.1/24')).to.eql(0); // NOSONAR
      expect(getNetworksCount('1.1.1.1/25')).to.eql(2); // NOSONAR
      expect(getNetworksCount('1.1.1.1/26')).to.eql(4); // NOSONAR
      expect(getNetworksCount('1.1.1.1/27')).to.eql(8); // NOSONAR
      expect(getNetworksCount('1.1.1.1/28')).to.eql(16); // NOSONAR
      expect(getNetworksCount('1.1.1.1/29')).to.eql(32); // NOSONAR
      expect(getNetworksCount('1.1.1.1/30')).to.eql(64); // NOSONAR
      expect(getNetworksCount('1.1.1.1/31')).to.eql(128); // NOSONAR
      expect(getNetworksCount('1.1.1.1/32')).to.eql(0); // NOSONAR
      expect(getNetworksCount('2001:db8:0:85a3::ac1f:8001/32')).to.eql(4294967296n); // NOSONAR
      expect(getNetworksCount('2001:db8:0:85a3::ac1f:8001/42')).to.eql(4194304n); // NOSONAR
      expect(getNetworksCount('2001:db8:0:85a3:0:0:ac1f:8001/62')).to.eql(4n); // NOSONAR
      expect(getNetworksCount('2001:db8:0:85a3::ac1f:8001/112')).to.eql(-1); // NOSONAR
      expect(getNetworksCount('2001:db8:0:85a3:0:0:ac1f:8001/122')).to.eql(-1); // NOSONAR
    }); // NOSONAR
  }); // NOSONAR
  describe('getIPNetworkType', () => {
    it('returns network type', () => {
      expect(getIPNetworkType('1.1.1.1')).to.eql('Public'); // NOSONAR
      expect(getIPNetworkType('10.10.1.1')).to.eql('Private Use'); // NOSONAR
      expect(getIPNetworkType('172.16.0.1')).to.eql('Private Use'); // NOSONAR
      expect(getIPNetworkType('192.168.1.1')).to.eql('Private Use'); // NOSONAR
      expect(getIPNetworkType('255.255.255.0')).to.eql('Reserved'); // NOSONAR
      expect(getIPNetworkType('224.0.0.1')).to.eql('Multicast'); // NOSONAR
      expect(getIPNetworkType('198.51.100.1')).to.eql('Documentation (TEST-NET-2)'); // NOSONAR
      expect(getIPNetworkType('198.18.0.1')).to.eql('Benchmarking'); // NOSONAR
      expect(getIPNetworkType('169.254.0.1')).to.eql('Link Local'); // NOSONAR
      expect(getIPNetworkType('127.0.0.1')).to.eql('Loopback'); // NOSONAR
      expect(getIPNetworkType('2001:db8:8:4::2')).to.eql('Documentation'); // NOSONAR
      expect(getIPNetworkType('FF02::2')).to.eql('Multicast address'); // NOSONAR
      expect(getIPNetworkType('2345:0425:2CA1:0000:0000:0567:5673:23b5')).to.eql('Public'); // NOSONAR
      expect(getIPNetworkType('fdf8:f53b:82e4::53')).to.eql('Unique-Local'); // NOSONAR
      expect(getIPNetworkType('::ffff:192.0.2.47')).to.eql('IPv4-mapped Address'); // NOSONAR
      expect(getIPNetworkType('::ffff:ac12:0a09')).to.eql('IPv4-mapped Address'); // NOSONAR
      expect(getIPNetworkType('::1')).to.eql('Loopback Address'); // NOSONAR
      expect(getIPNetworkType('fe80::200:5aee:feaa:20a2')).to.eql('Link-Local Unicast'); // NOSONAR
      expect(getIPNetworkType('2001:0002::6c::430')).to.eql('Benchmarking'); // NOSONAR
      expect(getIPNetworkType('2001:0000:4136:e378:8000:63bf:3fff:fdd2')).to.eql('TEREDO'); // NOSONAR
      expect(getIPNetworkType('2002:cb0a:3cdd:1::1')).to.eql('6to4'); // NOSONAR
      expect(getIPNetworkType('ff01:0:0:0:0:0:0:2')).to.eql('Multicast address'); // NOSONAR
    }); // NOSONAR
  }); // NOSONAR

  describe('toARPA', () => {
    it('returns ARPA address', () => {
      expect(toARPA('1.1.1.1')).to.eql('1.1.1.1.in-addr.arpa'); // NOSONAR
      expect(toARPA('10.10.1.1')).to.eql('1.1.10.10.in-addr.arpa'); // NOSONAR
      expect(toARPA('192.168.1.1')).to.eql('1.1.168.192.in-addr.arpa'); // NOSONAR
      expect(toARPA('255.255.255.0')).to.eql('0.255.255.255.in-addr.arpa'); // NOSONAR
      expect(toARPA('FF02::2')).to.eql('2.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.2.0.f.f.ip6.arpa.'); // NOSONAR
      expect(toARPA('2345:0425:2CA1:0000:0000:0567:5673:23b5')).to.eql('5.b.3.2.3.7.6.5.7.6.5.0.0.0.0.0.0.0.0.0.1.a.c.2.5.2.4.0.5.4.3.2.ip6.arpa.'); // NOSONAR
      expect(toARPA('fdf8:f53b:82e4::53')).to.eql('3.5.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.4.e.2.8.b.3.5.f.8.f.d.f.ip6.arpa.'); // NOSONAR
      expect(toARPA('::ffff:192.0.2.47')).to.eql('f.2.2.0.0.0.0.c.f.f.f.f.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.ip6.arpa.'); // NOSONAR
      expect(toARPA('::1')).to.eql('1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.ip6.arpa.'); // NOSONAR
    }); // NOSONAR
  }); // NOSONAR
  describe('toIPv4MappedAddress', () => {
    it('returns IPv4MappedAddress', () => {
      expect(toIPv4MappedAddress('1.1.1.1')).to.eql('::ffff:0101:0101'); // NOSONAR
      expect(toIPv4MappedAddress('10.10.1.1')).to.eql('::ffff:0a0a:0101'); // NOSONAR
      expect(toIPv4MappedAddress('172.18.10.9')).to.eql('::ffff:ac12:0a09'); // NOSONAR
      expect(toIPv4MappedAddress('192.168.1.1')).to.eql('::ffff:c0a8:0101'); // NOSONAR
      expect(toIPv4MappedAddress('255.255.255.0')).to.eql('::ffff:ffff:ff00'); // NOSONAR
    }); // NOSONAR
  }); // NOSONAR
  describe('toIPv4MappedAddressDecimal', () => {
    it('returns networks count', () => {
      expect(toIPv4MappedAddressDecimal('1.1.1.1')).to.eql('::ffff:1.1.1.1'); // NOSONAR
      expect(toIPv4MappedAddressDecimal('10.10.1.1')).to.eql('::ffff:10.10.1.1'); // NOSONAR
      expect(toIPv4MappedAddressDecimal('192.168.1.1')).to.eql('::ffff:192.168.1.1'); // NOSONAR
      expect(toIPv4MappedAddressDecimal('172.18.10.9')).to.eql('::ffff:172.18.10.9'); // NOSONAR
      expect(toIPv4MappedAddressDecimal('255.255.255.0')).to.eql('::ffff:255.255.255.0'); // NOSONAR
      expect(toIPv4MappedAddressDecimal('2001:db8:0:85a3::ac1f:8001')).to.eql(''); // NOSONAR
    }); // NOSONAR
  }); // NOSONAR
  describe('to6to4Prefix', () => {
    it('returns networks count', () => {
      expect(to6to4Prefix('1.1.1.1')).to.eql('2002:01:0:1:01:01::/48'); // NOSONAR
      expect(to6to4Prefix('10.10.1.1')).to.eql('2002:0a:0:a:01:01::/48'); // NOSONAR
      expect(to6to4Prefix('172.18.10.9')).to.eql('2002:ac:1:2:0a:09::/48'); // NOSONAR
      expect(to6to4Prefix('192.168.1.1')).to.eql('2002:c0:a:8:01:01::/48'); // NOSONAR
      expect(to6to4Prefix('255.255.255.0')).to.eql('2002:ff:f:f:ff:00::/48'); // NOSONAR
      expect(to6to4Prefix('2001:db8:0:85a3::ac1f:8001')).to.eql(''); // NOSONAR
    }); // NOSONAR
  }); // NOSONAR
}); // NOSONAR
