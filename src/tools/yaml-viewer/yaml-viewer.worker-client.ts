import {
  YAML_TASK_TIMEOUT_MS,
  type YamlFormatTask,
  YamlTaskError,
  type YamlWorkerMessage,
  type YamlWorkerRequest,
  parseYamlTask,
  parseYamlWorkerMessage,
  toYamlTaskError,
} from './yaml-viewer.worker.protocol';
import {
  TerminateAndReplaceWorkerTask,
  type WorkerTaskEvent,
  type WorkerTaskHandle,
} from '@/utils/worker-task';

export type YamlWorkerHandle = WorkerTaskHandle<YamlWorkerRequest>;
export type YamlWorkerFactory = () => YamlWorkerHandle;

export interface YamlTaskResult {
  value: string
  elapsedMs: number
}

type YamlWorkerErrorCode = Extract<YamlWorkerMessage, { type: 'error' }>['code'];
type YamlWorkerResult = Extract<YamlWorkerMessage, { type: 'result' }>;

const REPLACEMENT_MESSAGE = 'A newer YAML formatting operation replaced this one.';

function createWorker(): YamlWorkerHandle {
  return new Worker(new URL('./yaml-viewer.worker.ts', import.meta.url), {
    type: 'module',
    name: 'it-tools-yaml-format',
  });
}

function decodeWorkerMessage(
  value: unknown,
): WorkerTaskEvent<YamlWorkerResult, YamlWorkerErrorCode> {
  const message = parseYamlWorkerMessage(value);

  if (message.type === 'error') {
    return message;
  }

  return { jobId: message.jobId, type: 'result', result: message };
}

function resolveWorkerResult(result: YamlWorkerResult, expectedTask: YamlFormatTask): string {
  if (result.operation !== expectedTask.operation) {
    throw new YamlTaskError('worker', 'The YAML worker returned a result for the wrong operation.');
  }

  return result.value;
}

export class YamlWorkerClient {
  private readonly taskRunner: TerminateAndReplaceWorkerTask<
    YamlFormatTask,
    YamlWorkerResult,
    string,
    YamlWorkerErrorCode,
    YamlTaskError
  >;

  constructor(
    workerFactory: YamlWorkerFactory = createWorker,
    timeoutMs = YAML_TASK_TIMEOUT_MS,
  ) {
    this.taskRunner = new TerminateAndReplaceWorkerTask({
      workerFactory,
      timeoutMs,
      messages: {
        replacement: REPLACEMENT_MESSAGE,
        unavailable: 'YAML formatting workers are not available in this browser.',
        timeout: (_task, deadlineMs) => `YAML formatting exceeded the ${deadlineMs / 1000}-second time limit.`,
        crash: 'The YAML worker stopped unexpectedly.',
        postMessageFailure: 'YAML formatting could not be started.',
      },
      decodeMessage: decodeWorkerMessage,
      resolveResult: resolveWorkerResult,
      createError: (code, message, elapsedMs) => new YamlTaskError(code, message, elapsedMs),
      protocolError: (error, elapsedMs) => {
        const taskError = toYamlTaskError(error, 'worker');
        return new YamlTaskError('worker', taskError.message, elapsedMs);
      },
    });
  }

  run(task: YamlFormatTask): Promise<YamlTaskResult> {
    // YAML formatting is latest-input-wins even when the replacement is
    // invalid, so cancel before validating the new task.
    this.cancel(REPLACEMENT_MESSAGE);

    let validatedTask: YamlFormatTask;
    try {
      validatedTask = parseYamlTask(task);
    }
    catch (error) {
      return Promise.reject(toYamlTaskError(error, 'validation'));
    }

    return this.taskRunner.run(validatedTask);
  }

  cancel(message = 'YAML formatting cancelled.'): void {
    this.taskRunner.cancel(message);
  }

  dispose(): void {
    this.cancel('YAML formatting cancelled because the tool was closed.');
  }
}
