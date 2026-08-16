import { GEOIP_ERROR_MESSAGES, GEOIP_MAX_OUTPUT_BYTES, GEOIP_TIMEOUT_MS, type GeoIpInspectionTask, parseGeoIpTask } from './offline-geoip-inspector.worker.protocol';
import { BoundedTextWorkerClient } from '@/utils/bounded-text-task';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

export function createGeoIpWorkerClient(
  workerFactory: () => WorkerTaskHandle<WorkerTaskRequest<GeoIpInspectionTask>> = () => new Worker(
    new URL('./offline-geoip-inspector.worker.ts', import.meta.url),
    { type: 'module', name: 'it-tools-offline-geoip' },
  ),
) {
  return new BoundedTextWorkerClient({
    errorMessages: GEOIP_ERROR_MESSAGES,
    maxOutputBytes: GEOIP_MAX_OUTPUT_BYTES,
    taskName: 'Offline GeoIP inspection',
    timeoutMs: GEOIP_TIMEOUT_MS,
    validateTask: parseGeoIpTask,
    workerFactory,
  });
}
