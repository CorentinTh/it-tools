/// <reference lib="webworker" />

import { presentableDiff } from '@codemirror/merge';

const MAX_SIDE_BYTES = 1024 * 1024;
const MAX_CHANGES = 10_000;

type Request = { jobId: number; original: string; modified: string };

function isRequest(value: unknown): value is Request {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const candidate = value as Partial<Request>;
  return Number.isSafeInteger(candidate.jobId)
    && typeof candidate.original === 'string'
    && typeof candidate.modified === 'string'
    && Object.keys(value).sort().join(',') === 'jobId,modified,original';
}

self.addEventListener('message', (event: MessageEvent<unknown>) => {
  const startedAt = performance.now();
  if (!isRequest(event.data)) {
    self.postMessage({ jobId: 0, type: 'error', code: 'validation' });
    return;
  }
  const { jobId, original, modified } = event.data;
  if (
    new TextEncoder().encode(original).byteLength > MAX_SIDE_BYTES
    || new TextEncoder().encode(modified).byteLength > MAX_SIDE_BYTES
  ) {
    self.postMessage({ jobId, type: 'error', code: 'input-limit' });
    return;
  }

  try {
    const changes = presentableDiff(original, modified, { scanLimit: 50_000, timeout: 1_500 });
    if (changes.length > MAX_CHANGES) {
      self.postMessage({ jobId, type: 'error', code: 'change-limit' });
      return;
    }
    self.postMessage({
      jobId,
      type: 'result',
      elapsedMs: performance.now() - startedAt,
      changes: changes.map(({ fromA, toA, fromB, toB }) => ({ fromA, toA, fromB, toB })),
    });
  }
  catch {
    self.postMessage({ jobId, type: 'error', code: 'processing' });
  }
});
