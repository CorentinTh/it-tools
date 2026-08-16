/// <reference lib="webworker" />
import { lookupGeoIpCsv, parseIpAddress } from './offline-geoip-inspector.service';
import {
  GEOIP_ERROR_MESSAGES,
  GEOIP_MAX_OUTPUT_BYTES,
  parseGeoIpTask,
} from './offline-geoip-inspector.worker.protocol';
import {
  BoundedTextTaskError,
  type BoundedTextWorkerMessage,
  createBoundedTextResult,
  parseBoundedTextWorkerJobId,
  parseBoundedTextWorkerRequest,
} from '@/utils/bounded-text-task';

interface WorkerScope {
  addEventListener: (type: 'message', listener: (event: MessageEvent<unknown>) => void) => void
  postMessage: (message: BoundedTextWorkerMessage) => void
}

const MAX_DECOMPRESSED_DATASET_CHARACTERS = 32 * 1024 * 1024;

async function loadDataset(family: 4 | 6) {
  const fileName = `user-country-ipv${family}.csv.gz`;
  const datasetUrl = __IT_TOOLS_STANDALONE_GEOIP_DATASET_URLS__?.[fileName]
    ?? `${import.meta.env.BASE_URL}assets/geoip/${fileName}`;
  const response = await fetch(datasetUrl, {
    cache: 'force-cache',
    credentials: 'same-origin',
  });
  if (!response.ok) {
    throw new Error(`The local GeoIP dataset returned HTTP ${response.status}.`);
  }
  const body = new Uint8Array(await response.arrayBuffer());
  if (body.byteLength > MAX_DECOMPRESSED_DATASET_CHARACTERS) {
    throw new RangeError('The local GeoIP dataset exceeds its safe decompressed size.');
  }
  // Vite marks .gz assets with Content-Encoding and fetch transparently
  // decodes them. Static nginx serves the same file as raw gzip. Accept both
  // representations without ever contacting a different source.
  let csv: string;
  if (body[0] === 0x1F && body[1] === 0x8B) {
    if (typeof DecompressionStream === 'undefined') {
      throw new TypeError('This browser cannot decompress the local GeoIP dataset.');
    }
    const stream = new Blob([body]).stream().pipeThrough(new DecompressionStream('gzip'));
    csv = await new Response(stream).text();
  }
  else {
    csv = new TextDecoder().decode(body);
  }
  if (csv.length > MAX_DECOMPRESSED_DATASET_CHARACTERS) {
    throw new RangeError('The local GeoIP dataset exceeds its safe decompressed size.');
  }
  return csv;
}

export async function inspectOfflineGeoIp(addressSource: string) {
  const address = parseIpAddress(addressSource);
  return lookupGeoIpCsv(await loadDataset(address.family), address);
}

export async function handleGeoIpWorkerRequest(
  value: unknown,
  inspect: (address: string) => Promise<unknown> = inspectOfflineGeoIp,
): Promise<BoundedTextWorkerMessage> {
  let jobId = 1;
  try {
    jobId = parseBoundedTextWorkerJobId(value);
    const { task } = parseBoundedTextWorkerRequest(value, parseGeoIpTask);
    const result = createBoundedTextResult(JSON.stringify(await inspect(task.address)), GEOIP_MAX_OUTPUT_BYTES);
    return result
      ? { jobId, type: 'result', result }
      : { jobId, type: 'error', code: 'output-limit', message: GEOIP_ERROR_MESSAGES['output-limit'] };
  }
  catch (error) {
    const code = error instanceof BoundedTextTaskError
      && (error.code === 'validation' || error.code === 'input-limit')
      ? error.code
      : 'processing';
    return { jobId, type: 'error', code, message: GEOIP_ERROR_MESSAGES[code] };
  }
}

const scope = globalThis as unknown as WorkerScope;
scope.addEventListener('message', async event => scope.postMessage(await handleGeoIpWorkerRequest(event.data)));
