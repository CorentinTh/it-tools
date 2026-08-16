import { describe, expect, it, vi } from 'vitest';
import { DNS_MESSAGE_MAX_BYTES, encodeDnsQuery } from './dns-over-https-query.service';
import { DNS_RESOLVERS, DnsOverHttpsClient, DnsQueryError } from './dns-over-https-query.client';

function makeAResponse(name: string, address = [192, 0, 2, 1]): Uint8Array {
  const query = encodeDnsQuery(name, 'A').bytes;
  const response = new Uint8Array(query.length + 16);
  response.set(query);
  response[2] = 0x81;
  response[3] = 0x80;
  response[6] = 0;
  response[7] = 1;
  const offset = query.length;
  response.set([0xC0, 0x0C, 0, 1, 0, 1, 0, 0, 0, 60, 0, 4, ...address], offset);
  return response;
}

function dnsResponse(bytes: Uint8Array, headers: Record<string, string> = {}): Response {
  return new Response(bytes, {
    status: 200,
    headers: { 'Content-Type': 'application/dns-message', ...headers },
  });
}

function abortableFetch(capturedSignals: AbortSignal[]) {
  return vi.fn((_input: RequestInfo | URL, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
    const signal = init?.signal;
    if (!signal) {
      reject(new Error('Missing signal'));
      return;
    }
    capturedSignals.push(signal);
    signal.addEventListener('abort', () => reject(signal.reason), { once: true });
  }));
}

describe('DNS-over-HTTPS client', () => {
  it('uses one fixed POST endpoint and privacy-oriented fetch options', async () => {
    const fetchImpl = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => dnsResponse(makeAResponse('private-marker.example')));
    let clock = 10;
    const client = new DnsOverHttpsClient({ fetchImpl, now: () => clock += 5 });
    const result = await client.run({ resolverId: 'cloudflare', name: 'private-marker.example', typeName: 'A' });

    expect(result.message.answers[0]?.value).toBe('192.0.2.1');
    expect(fetchImpl).toHaveBeenCalledOnce();
    const [url, init] = fetchImpl.mock.calls[0]!;
    expect(url).toBe(DNS_RESOLVERS[0].endpoint);
    expect(String(url)).not.toContain('private-marker');
    expect(init).toMatchObject({
      method: 'POST', mode: 'cors', credentials: 'omit', cache: 'no-store', redirect: 'error', referrerPolicy: 'no-referrer',
    });
    expect(init?.headers).toEqual([
      ['accept', 'application/dns-message'],
      ['content-type', 'application/dns-message'],
    ]);
    expect(init?.body).toBeInstanceOf(Uint8Array);
    expect(new TextDecoder().decode(init?.body as Uint8Array)).toContain('private-marker');
  });

  it('rejects non-wire media, HTTP errors, redirects, malformed wire data, and oversized bodies', async () => {
    const redirectedResponse = dnsResponse(makeAResponse('example.com'));
    Object.defineProperty(redirectedResponse, 'redirected', { value: true });
    const cases: Array<[Response, string]> = [
      [new Response('no', { status: 200, headers: { 'Content-Type': 'text/plain' } }), 'unexpected media type'],
      [new Response('', { status: 429, headers: { 'Content-Type': 'application/dns-message' } }), 'HTTP 429'],
      [redirectedResponse, 'redirects are not accepted'],
      [dnsResponse(Uint8Array.of(1, 2, 3)), '12–65,535'],
      [dnsResponse(makeAResponse('example.com'), { 'Content-Length': String(DNS_MESSAGE_MAX_BYTES + 1) }), 'exceeds the 65,535-byte'],
    ];
    for (const [response, message] of cases) {
      const client = new DnsOverHttpsClient({ fetchImpl: vi.fn(async () => response) });
      await expect(client.run({ resolverId: 'cloudflare', name: 'example.com', typeName: 'A' })).rejects.toThrow(message);
    }

    const oversizedStream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array(40_000));
        controller.enqueue(new Uint8Array(40_000));
        controller.close();
      },
    });
    const streamingClient = new DnsOverHttpsClient({
      fetchImpl: vi.fn(async () => new Response(oversizedStream, { headers: { 'Content-Type': 'application/dns-message' } })),
    });
    await expect(streamingClient.run({ resolverId: 'cloudflare', name: 'example.com', typeName: 'A' })).rejects.toThrow('exceeds the 65,535-byte');
  });

  it('aborts replaced, cancelled, timed-out, and disposed requests', async () => {
    const signals: AbortSignal[] = [];
    const client = new DnsOverHttpsClient({ fetchImpl: abortableFetch(signals), timeoutMs: 20 });
    const first = client.run({ resolverId: 'cloudflare', name: 'first.example', typeName: 'A' });
    const second = client.run({ resolverId: 'cloudflare-security', name: 'second.example', typeName: 'A' });
    await expect(first).rejects.toMatchObject({ code: 'cancelled' });
    expect(signals[0]?.aborted).toBe(true);
    client.cancel();
    await expect(second).rejects.toMatchObject({ code: 'cancelled' });
    expect(signals[1]?.aborted).toBe(true);

    const timed = client.run({ resolverId: 'cloudflare', name: 'timed.example', typeName: 'A' });
    await expect(timed).rejects.toMatchObject({ code: 'timeout' });
    expect(signals[2]?.aborted).toBe(true);

    const disposed = client.run({ resolverId: 'cloudflare', name: 'disposed.example', typeName: 'A' });
    client.dispose();
    await expect(disposed).rejects.toMatchObject({ code: 'cancelled' });
    expect(signals[3]?.aborted).toBe(true);
  });

  it('does not echo a query name from network failures or invalid resolver IDs', async () => {
    const marker = 'secret-error-marker.example';
    const client = new DnsOverHttpsClient({
      fetchImpl: vi.fn(async () => {
        throw new Error(marker);
      }),
    });
    const caught = await client.run({ resolverId: 'cloudflare', name: marker, typeName: 'A' }).catch(error => error);
    expect(caught).toBeInstanceOf(DnsQueryError);
    expect(caught.message).not.toContain(marker);
    await expect(client.run({ resolverId: 'invalid' as never, name: marker, typeName: 'A' })).rejects.toMatchObject({ code: 'validation' });
  });
});
