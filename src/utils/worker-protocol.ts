export interface WorkerTaskRequest<TTask> {
  jobId: number
  task: TTask
}

export interface WorkerMessageEnvelope {
  jobId: number
}

export function isUnknownRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isWorkerJobId(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 1;
}

export function nextWorkerJobId(current: number): number {
  if (!Number.isSafeInteger(current) || current < 0) {
    throw new RangeError('The current worker job identifier must be a non-negative safe integer.');
  }

  return current === Number.MAX_SAFE_INTEGER ? 1 : current + 1;
}
