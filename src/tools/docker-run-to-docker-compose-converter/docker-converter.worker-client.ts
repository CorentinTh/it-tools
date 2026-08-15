import {
  DOCKER_CONVERTER_TASK_TIMEOUT_MS,
  type DockerConverterErrorCode,
  type DockerConverterResult,
  type DockerConverterTask,
  type DockerConverterWireResult,
  type DockerConverterWorkerMessage,
  type DockerConverterWorkerRequest,
  parseDockerConverterTask,
  parseDockerConverterWorkerMessage,
} from './docker-converter.worker.protocol';
import { BoundedTextTaskError } from '@/utils/bounded-text-task';
import {
  TerminateAndReplaceWorkerTask,
  type WorkerTaskEvent,
  type WorkerTaskHandle,
  type WorkerTaskResult,
} from '@/utils/worker-task';

function createWorker(): WorkerTaskHandle<DockerConverterWorkerRequest> {
  return new Worker(new URL('./docker-converter.worker.ts', import.meta.url), {
    type: 'module',
    name: 'it-tools-docker-converter',
  });
}

function decodeMessage(value: unknown): WorkerTaskEvent<DockerConverterWireResult, DockerConverterErrorCode> {
  const message: DockerConverterWorkerMessage = parseDockerConverterWorkerMessage(value);
  return message.type === 'result'
    ? { jobId: message.jobId, type: 'result', result: message.result }
    : message;
}

export class DockerConverterWorkerClient {
  private readonly runner: TerminateAndReplaceWorkerTask<
    DockerConverterTask,
    DockerConverterWireResult,
    DockerConverterResult,
    DockerConverterErrorCode,
    BoundedTextTaskError
  >;

  constructor(workerFactory = createWorker, timeoutMs = DOCKER_CONVERTER_TASK_TIMEOUT_MS) {
    this.runner = new TerminateAndReplaceWorkerTask({
      workerFactory,
      timeoutMs,
      messages: {
        replacement: 'A newer Docker conversion replaced this one.',
        unavailable: 'Docker conversion workers are not available in this browser.',
        timeout: (_task, deadlineMs) => `Docker conversion exceeded the ${deadlineMs / 1000}-second time limit.`,
        crash: 'The Docker conversion worker stopped unexpectedly.',
        postMessageFailure: 'Docker conversion could not be started.',
      },
      decodeMessage,
      resolveResult: result => ({
        yaml: result.yaml.value,
        messages: result.messages.map(message => ({ type: message.type, value: message.value })),
      }),
      createError: (code, message, elapsedMs) => new BoundedTextTaskError(code, message, elapsedMs),
      protocolError: (_error, elapsedMs) => new BoundedTextTaskError(
        'worker',
        'The Docker conversion worker returned an invalid message.',
        elapsedMs,
      ),
    });
  }

  run(task: DockerConverterTask): Promise<WorkerTaskResult<DockerConverterResult>> {
    this.cancel();
    try {
      return this.runner.run(parseDockerConverterTask(task));
    }
    catch (error) {
      return Promise.reject(error);
    }
  }

  cancel(message = 'Docker conversion cancelled.'): void {
    this.runner.cancel(message);
  }

  dispose(): void {
    this.cancel('Docker conversion cancelled because the tool was closed.');
  }
}
