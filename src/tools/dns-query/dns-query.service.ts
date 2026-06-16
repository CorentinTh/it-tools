export const defaultRecordTypes = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SOA'] as const;

export const allRecordTypes = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SOA', 'SRV', 'CAA', 'PTR'] as const;

export type DnsRecordType = typeof allRecordTypes[number];

const dnsTypeNumberToName: Record<number, string> = {
  1: 'A',
  2: 'NS',
  5: 'CNAME',
  6: 'SOA',
  12: 'PTR',
  15: 'MX',
  16: 'TXT',
  28: 'AAAA',
  33: 'SRV',
  257: 'CAA',
};

export function getTypeName(typeNumber: number): string {
  return dnsTypeNumberToName[typeNumber] ?? `TYPE${typeNumber}`;
}

export interface DnsAnswer {
  name: string
  type: number
  TTL: number
  data: string
}

export interface DnsResponse {
  Status: number
  TC: boolean
  RD: boolean
  RA: boolean
  AD: boolean
  CD: boolean
  Question: { name: string; type: number }[]
  Answer?: DnsAnswer[]
  Authority?: DnsAnswer[]
}

export async function queryDns({ domain, type }: { domain: string; type: string }): Promise<DnsResponse> {
  const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${encodeURIComponent(type)}`;

  const response = await fetch(url, {
    headers: { Accept: 'application/dns-json' },
  });

  if (!response.ok) {
    throw new Error(`DNS query failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function queryAllDns(domain: string, types: readonly string[]): Promise<DnsAnswer[]> {
  const results = await Promise.allSettled(
    types.map(type => queryDns({ domain, type })),
  );

  const seen = new Set<string>();
  const answers: DnsAnswer[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled' && result.value.Answer) {
      for (const answer of result.value.Answer) {
        const key = `${answer.type}|${answer.name}|${answer.data}`;
        if (!seen.has(key)) {
          seen.add(key);
          answers.push(answer);
        }
      }
    }
  }

  return answers;
}

export function formatDnsRecords(answers: DnsAnswer[]): string {
  if (answers.length === 0) {
    return 'No records found';
  }

  const lines = answers.map((answer) => {
    const typeName = getTypeName(answer.type);
    return `${typeName}\t${answer.name}\t${answer.TTL}s\t${answer.data}`;
  });

  return lines.join('\n');
}

export interface WhoisInfo {
  domainName: string
  registrar: string
  registrationDate: string
  expirationDate: string
  updatedDate: string
  status: string[]
  nameServers: string[]
  dnssec: string
  registrantCountry: string
  registrantProvince: string
}

export async function queryWhois(domain: string): Promise<WhoisInfo | null> {
  try {
    const response = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return parseRdapResponse(data, domain);
  }
  catch {
    return null;
  }
}

function parseRdapResponse(data: any, domain: string): WhoisInfo {
  const events = data.events ?? [];
  const findEvent = (action: string) => {
    const ev = events.find((e: any) => e.eventAction === action);
    return ev?.eventDate ? formatDate(ev.eventDate) : '';
  };

  const registrarEntity = (data.entities ?? []).find((e: any) => e.roles?.includes('registrar'));
  const registrar = registrarEntity?.vcardArray?.[1]
    ?.find((v: any) => v[0] === 'fn')?.[3] ?? '';

  const registrantEntity = (data.entities ?? []).find((e: any) => e.roles?.includes('registrant'));
  const registrantVcard = registrantEntity?.vcardArray?.[1] ?? [];
  const adr = registrantVcard.find((v: any) => v[0] === 'adr');
  const registrantCountry = adr?.[1]?.cc ?? '';
  const registrantProvince = adr?.[3]?.[4] ?? '';

  const nameServers = (data.nameservers ?? [])
    .map((ns: any) => (ns.ldhName ?? '').replace(/\.$/, ''))
    .filter(Boolean);

  const status = (data.status ?? []).map((s: string) => s.replaceAll(' ', ''));

  const dnssec = data.secureDNS?.delegationSigned ? 'signed' : 'unsigned';

  return {
    domainName: data.ldhName ?? domain,
    registrar,
    registrationDate: findEvent('registration'),
    expirationDate: findEvent('expiration'),
    updatedDate: findEvent('last changed'),
    status,
    nameServers,
    dnssec,
    registrantCountry,
    registrantProvince,
  };
}

function formatDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
  }
  catch {
    return isoDate;
  }
}
