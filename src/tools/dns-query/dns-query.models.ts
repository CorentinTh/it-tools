export type DnsRecordType = 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SOA' | 'SRV' | 'CAA';

export interface DnsAnswer {
  name: string
  type: number
  /** Human-readable type name when it is one we know. */
  typeLabel?: string
  TTL: number
  data: string
}

export interface DohResponse {
  Status: number
  Answer?: DnsAnswer[]
  Authority?: DnsAnswer[]
}

export interface DnsQueryResult {
  status: number
  /** 0 = NOERROR, 3 = NXDOMAIN. */
  statusLabel: string
  answers: DnsAnswer[]
  authority: DnsAnswer[]
}

const TYPE_LABELS: Record<number, string> = {
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

export const recordTypes: DnsRecordType[] = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SOA', 'SRV', 'CAA'];

function statusLabel(status: number): string {
  const labels: Record<number, string> = {
    0: 'NOERROR — the query succeeded',
    1: 'FORMERR — format error',
    2: 'SERVFAIL — the server failed',
    3: 'NXDOMAIN — name does not exist',
    4: 'NOTIMP — not implemented',
    5: 'REFUSED — query refused',
  };
  return labels[status] ?? `Status ${status}`;
}

/** URL for a DNS-over-HTTPS JSON query against the given provider. */
export function buildDohUrl({ name, type, provider }: { name: string; type: string; provider: 'cloudflare' | 'google' }): string {
  const base = provider === 'google' ? 'https://dns.google/resolve' : 'https://cloudflare-dns.com/dns-query';
  const host = encodeURIComponent(name.trim());
  return `${base}?name=${host}&type=${type}`;
}

export function parseDohResponse(json: DohResponse): DnsQueryResult {
  return {
    status: json.Status,
    statusLabel: statusLabel(json.Status),
    answers: (json.Answer ?? []).map(answer => ({
      ...answer,
      typeLabel: TYPE_LABELS[answer.type] ?? String(answer.type),
    })),
    authority: json.Authority ?? [],
  };
}
