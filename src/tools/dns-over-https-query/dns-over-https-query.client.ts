import {
  DNS_MESSAGE_MAX_BYTES,
  type DnsQueryType,
  type ParsedDnsMessage,
  encodeDnsQuery,
  parseDnsResponse,
} from './dns-over-https-query.service';

export const DNS_QUERY_TIMEOUT_MS = 10_000;
export const DNS_RESPONSE_MAX_CHUNKS = 1_024;

export const DNS_RESOLVERS = [
  {
    id: 'cloudflare',
    label: 'Cloudflare 1.1.1.1 — standard',
    endpoint: 'https://cloudflare-dns.com/dns-query',
    policy: 'Standard recursive resolution.',
  },
  {
    id: 'cloudflare-security',
    label: 'Cloudflare 1.1.1.2 — malware blocking',
    endpoint: 'https://security.cloudflare-dns.com/dns-query',
    policy: 'May block domains classified as malicious.',
  },
] as const;

export type DnsResolverId = typeof DNS_RESOLVERS[number]['id'];
export type DnsQueryErrorCode = 'validation' | 'network' | 'http' | 'content-type' | 'response' | 'timeout' | 'cancelled';

export class DnsQueryError extends Error {
  constructor(public readonly code: DnsQueryErrorCode, message: string) {
    super(message);
    this.name = 'DnsQueryError';
  }
}

export interface DnsQueryResult {
  resolverId: DnsResolverId
  resolverLabel: string
  canonicalName: string
  typeName: DnsQueryType
  requestBytes: number
  responseBytes: number
  elapsedMs: number
  message: ParsedDnsMessage
}

export interface DnsQueryTask {
  resolverId: DnsResolverId
  name: string
  typeName: DnsQueryType
}

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

interface DnsClientOptions {
  fetchImpl?: FetchLike
  timeoutMs?: number
  now?: () => number
}

function resolveResolver(id: DnsResolverId) {
  const resolver = DNS_RESOLVERS.find(candidate => candidate.id === id);
  if (!resolver) {
    throw new DnsQueryError('validation', 'Choose one of the fixed DNS resolvers.');
  }
  return resolver;
}

async function readBoundedBody(response: Response, signal: AbortSignal): Promise<Uint8Array> {
  const declaredLength = response.headers.get('content-length');
  if (declaredLength !== null && (!/^\d+$/u.test(declaredLength) || Number(declaredLength) > DNS_MESSAGE_MAX_BYTES)) {
    throw new DnsQueryError('response', `The resolver response exceeds the ${DNS_MESSAGE_MAX_BYTES.toLocaleString('en-US')}-byte DNS wire limit.`);
  }
  if (!response.body) {
    throw new DnsQueryError('response', 'The resolver returned no readable DNS response body.');
  }
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  let chunkCount = 0;
  try {
    while (true) {
      if (signal.aborted) {
        throw signal.reason;
      }
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      chunkCount += 1;
      if (chunkCount > DNS_RESPONSE_MAX_CHUNKS || !(value instanceof Uint8Array)) {
        throw new DnsQueryError('response', 'The resolver response stream exceeded its structural limits.');
      }
      total += value.byteLength;
      if (total > DNS_MESSAGE_MAX_BYTES) {
        throw new DnsQueryError('response', `The resolver response exceeds the ${DNS_MESSAGE_MAX_BYTES.toLocaleString('en-US')}-byte DNS wire limit.`);
      }
      chunks.push(value);
    }
  }
  catch (caught) {
    await reader.cancel().catch(() => undefined);
    throw caught;
  }
  finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

export class DnsOverHttpsClient {
  private readonly fetchImpl: FetchLike;
  private readonly timeoutMs: number;
  private readonly now: () => number;
  private activeController: AbortController | undefined;
  private generation = 0;

  constructor(options: DnsClientOptions = {}) {
    this.fetchImpl = options.fetchImpl ?? globalThis.fetch.bind(globalThis);
    this.timeoutMs = options.timeoutMs ?? DNS_QUERY_TIMEOUT_MS;
    this.now = options.now ?? (() => performance.now());
    if (!Number.isSafeInteger(this.timeoutMs) || this.timeoutMs < 1 || this.timeoutMs > 60_000) {
      throw new RangeError('The DNS query timeout must be a whole number from 1 to 60,000 milliseconds.');
    }
  }

  async run(task: DnsQueryTask): Promise<DnsQueryResult> {
    this.cancel('The previous DNS query was replaced by a newer request.');
    const resolver = resolveResolver(task.resolverId);
    let encoded;
    try {
      encoded = encodeDnsQuery(task.name, task.typeName);
    }
    catch (caught) {
      throw new DnsQueryError('validation', caught instanceof Error ? caught.message : 'The DNS query is invalid.');
    }
    const generation = ++this.generation;
    const controller = new AbortController();
    this.activeController = controller;
    const startedAt = this.now();
    const timeout = globalThis.setTimeout(() => {
      controller.abort(new DnsQueryError('timeout', `The DNS-over-HTTPS request exceeded the ${this.timeoutMs / 1000}-second limit.`));
    }, this.timeoutMs);

    try {
      const response = await this.fetchImpl(resolver.endpoint, {
        method: 'POST',
        headers: [
          ['accept', 'application/dns-message'],
          ['content-type', 'application/dns-message'],
        ],
        body: encoded.bytes,
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-store',
        redirect: 'error',
        referrerPolicy: 'no-referrer',
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new DnsQueryError('http', `The selected resolver returned HTTP ${response.status}.`);
      }
      if (response.redirected) {
        throw new DnsQueryError('network', 'Resolver redirects are not accepted.');
      }
      const mediaType = response.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase();
      if (mediaType !== 'application/dns-message') {
        throw new DnsQueryError('content-type', 'The selected resolver returned an unexpected media type.');
      }
      const bytes = await readBoundedBody(response, controller.signal);
      let message: ParsedDnsMessage;
      try {
        message = parseDnsResponse(bytes, encoded);
      }
      catch (caught) {
        throw new DnsQueryError('response', caught instanceof Error ? caught.message : 'The DNS response is malformed.');
      }
      return {
        resolverId: resolver.id,
        resolverLabel: resolver.label,
        canonicalName: encoded.canonicalName,
        typeName: encoded.typeName,
        requestBytes: encoded.bytes.byteLength,
        responseBytes: bytes.byteLength,
        elapsedMs: Math.max(0, this.now() - startedAt),
        message,
      };
    }
    catch (caught) {
      if (controller.signal.aborted) {
        const reason = controller.signal.reason;
        if (reason instanceof DnsQueryError) {
          throw reason;
        }
        throw new DnsQueryError('cancelled', 'The DNS-over-HTTPS request was cancelled.');
      }
      if (caught instanceof DnsQueryError) {
        throw caught;
      }
      throw new DnsQueryError('network', 'The DNS-over-HTTPS request failed before a valid response was received.');
    }
    finally {
      globalThis.clearTimeout(timeout);
      if (generation === this.generation) {
        this.activeController = undefined;
      }
    }
  }

  cancel(message = 'The DNS-over-HTTPS request was cancelled.') {
    if (!this.activeController) {
      return;
    }
    this.generation += 1;
    this.activeController.abort(new DnsQueryError('cancelled', message));
    this.activeController = undefined;
  }

  dispose() {
    this.cancel('The DNS-over-HTTPS request was cancelled when the tool closed.');
  }
}
