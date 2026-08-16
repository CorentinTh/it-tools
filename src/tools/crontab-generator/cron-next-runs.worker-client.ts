import type { CronNextRunsOptions } from './cron-next-runs.service';
import {
  CRON_ERROR_MESSAGES,
  CRON_MAX_OUTPUT_BYTES,
  CRON_TASK_TIMEOUT_MS,
  parseCronTask,
} from './cron-next-runs.worker.protocol';
import { BoundedTextWorkerClient } from '@/utils/bounded-text-task';
import type { WorkerTaskRequest } from '@/utils/worker-protocol';
import type { WorkerTaskHandle } from '@/utils/worker-task';

export function createCronWorkerClient(
  workerFactory: () => WorkerTaskHandle<WorkerTaskRequest<CronNextRunsOptions>> = () => new Worker(
    new URL('./cron-next-runs.worker.ts', import.meta.url),
    { type: 'module', name: 'it-tools-cron-next-runs' },
  ),
  timeoutMs = CRON_TASK_TIMEOUT_MS,
): BoundedTextWorkerClient<CronNextRunsOptions> {
  return new BoundedTextWorkerClient({
    errorMessages: CRON_ERROR_MESSAGES,
    maxOutputBytes: CRON_MAX_OUTPUT_BYTES,
    taskName: 'cron next-run calculation',
    timeoutMs,
    validateTask: parseCronTask,
    workerFactory,
  });
}
