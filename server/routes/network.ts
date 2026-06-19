import { Hono } from 'hono';
import CryptoJSLib from 'crypto-js';
const { SHA1 } = CryptoJSLib as any;
import db from 'oui-data';
import { Netmask } from 'netmask';
import { ipv4ToInt, ipv4ToIpv6, isValidIpv4 } from '@/tools/ipv4-address-converter/ipv4-address-converter.service.js';
import { calculateCidr } from '@/tools/ipv4-range-expander/ipv4-range-expander.service.js';
import { getIPClass } from '@/tools/ipv4-subnet-calculator/ipv4-subnet-calculator.models.js';
import { generateRandomMacAddress } from '@/tools/mac-address-generator/mac-adress-generator.models.js';

const router = new Hono();

// IPv4 subnet calculator
router.post('/ipv4/subnet', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { cidr = '' } = body;
  try {
    const block = new Netmask(cidr);
    const ip = cidr.split('/')[0];
    return c.json({
      result: {
        networkAddress: block.base,
        broadcastAddress: block.broadcast,
        subnetMask: block.mask,
        wildcardMask: block.hostmask,
        firstHost: block.first,
        lastHost: block.last,
        totalHosts: block.size,
        usableHosts: Math.max(block.size - 2, 0),
        ipClass: getIPClass({ ip }),
        cidr: `${block.base}/${block.bitmask}`,
      },
    });
  } catch (e: any) {
    return c.json({ error: `Invalid CIDR: ${e.message}` }, 400);
  }
});

// IPv4 address converter
router.post('/ipv4/convert', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { ip = '' } = body;
  if (!isValidIpv4({ ip })) return c.json({ error: 'Invalid IPv4 address' }, 400);
  const decimal = ipv4ToInt({ ip });
  const ipv6 = ipv4ToIpv6({ ip });
  const hex = decimal.toString(16).padStart(8, '0').toUpperCase();
  const binary = decimal.toString(2).padStart(32, '0').match(/.{8}/g)!.join('.');
  return c.json({ result: { dotDecimal: ip, decimal, hex, binary, ipv6 } });
});

// IPv4 range expander
router.post('/ipv4/range', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { startIp = '', endIp = '' } = body;
  if (!isValidIpv4({ ip: startIp })) return c.json({ error: 'Invalid start IP' }, 400);
  if (!isValidIpv4({ ip: endIp })) return c.json({ error: 'Invalid end IP' }, 400);
  const result = calculateCidr({ startIp, endIp });
  if (!result) return c.json({ error: 'Could not calculate CIDR for given range' }, 400);
  return c.json({ result });
});

// MAC address generator
router.post('/mac/generate', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { count = 1, prefix = '', separator = ':' } = body;
  const result = Array.from({ length: Math.min(count, 100) }, () =>
    generateRandomMacAddress({ prefix, separator }),
  );
  return c.json({ result });
});

// MAC address lookup (OUI)
router.post('/mac/lookup', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { mac = '' } = body;
  const key = mac.trim().replace(/[.:-]/g, '').toUpperCase().substring(0, 6);
  const vendor = (db as Record<string, string>)[key];
  return c.json({ result: { mac, vendor: vendor ?? null, found: !!vendor } });
});

// IPv6 ULA generator
router.post('/ipv6/ula', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const mac = body.mac ?? '00:00:00:00:00:00';
  const timestamp = Date.now();
  const hex40bit = SHA1(timestamp + mac).toString().substring(30);
  const ula = `fd${hex40bit.substring(0, 2)}:${hex40bit.substring(2, 6)}:${hex40bit.substring(6)}`;
  return c.json({
    result: {
      ula: `${ula}::/48`,
      firstRoutableBlock: `${ula}:0::/64`,
      lastRoutableBlock: `${ula}:ffff::/64`,
    },
  });
});

export default router;
