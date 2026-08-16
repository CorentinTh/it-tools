import assert from 'node:assert/strict';
import http from 'node:http';

const targetUrl = new URL(process.argv[2] ?? 'http://127.0.0.1:18082');
const listenPort = Number(process.argv[3] ?? 18083);
const configuredBasePath = process.argv[4] ?? '/it-tools/';
const basePath = `/${configuredBasePath.replace(/^\/+|\/+$/g, '')}/`;

if (!Number.isInteger(listenPort) || listenPort < 1024 || listenPort > 65535) {
  throw new RangeError('Proxy port must be an integer between 1024 and 65535');
}

const proxy = http.createServer((request, response) => {
  const incomingUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);

  if (!incomingUrl.pathname.startsWith(basePath)) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  const upstreamPath = `/${incomingUrl.pathname.slice(basePath.length)}${incomingUrl.search}`;
  const upstreamRequest = http.request(new URL(upstreamPath, targetUrl), {
    headers: {
      ...request.headers,
      host: targetUrl.host,
      'x-forwarded-host': request.headers.host ?? '',
      'x-forwarded-prefix': basePath.slice(0, -1),
      'x-forwarded-proto': 'http',
    },
    method: request.method,
  }, (upstreamResponse) => {
    response.writeHead(upstreamResponse.statusCode ?? 502, upstreamResponse.headers);
    upstreamResponse.pipe(response);
  });

  upstreamRequest.on('error', (error) => {
    response.writeHead(502, { 'content-type': 'text/plain; charset=utf-8' });
    response.end(error.message);
  });
  request.pipe(upstreamRequest);
});

await new Promise((resolve, reject) => {
  proxy.once('error', reject);
  proxy.listen(listenPort, '127.0.0.1', resolve);
});

const proxyOrigin = `http://127.0.0.1:${listenPort}`;

async function expectStatus(path, expected) {
  const response = await fetch(`${proxyOrigin}${path}`, { redirect: 'manual' });
  assert.equal(response.status, expected, `${path} returned ${response.status}`);
  return response;
}

try {
  await expectStatus('/', 404);

  const documentResponse = await expectStatus(basePath, 200);
  assert.match(documentResponse.headers.get('cache-control') ?? '', /no-cache/);
  const documentSource = await documentResponse.text();
  const shellAsset = documentSource.match(/(?:src|href)="(\/[^"?]+\/assets\/[^"?]+\.(?:css|js))"/)?.[1];
  assert.ok(shellAsset, 'The subpath document must reference a hashed shell asset');
  assert.ok(shellAsset.startsWith(`${basePath}assets/`), `Shell asset escaped the base path: ${shellAsset}`);

  const assetResponse = await fetch(`${proxyOrigin}${shellAsset}`, {
    headers: { 'accept-encoding': 'gzip' },
  });
  assert.equal(assetResponse.status, 200, 'The proxied shell asset must load');
  assert.match(assetResponse.headers.get('cache-control') ?? '', /immutable/);

  await expectStatus(`${basePath}text-diff`, 200);
  await expectStatus(`${basePath}assets/not-present.js`, 404);
  await expectStatus(`${basePath}healthz`, 200);

  const manifest = await (await expectStatus(`${basePath}manifest.webmanifest`, 200)).json();
  assert.ok(String(manifest.start_url).startsWith(basePath), 'PWA start_url must stay under the base path');
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length > 0, 'PWA manifest must contain icons');
  for (const icon of manifest.icons) {
    assert.ok(String(icon.src).startsWith(basePath), `PWA icon escaped the base path: ${icon.src}`);
    await expectStatus(String(icon.src), 200);
  }

  const serviceWorker = await expectStatus(`${basePath}sw.js`, 200);
  assert.match(serviceWorker.headers.get('cache-control') ?? '', /no-cache/);

  console.log(`reverse-proxy-smoke: ${basePath} assets, SPA fallback, manifest, and service worker passed`);
}
finally {
  await new Promise(resolve => proxy.close(resolve));
}
