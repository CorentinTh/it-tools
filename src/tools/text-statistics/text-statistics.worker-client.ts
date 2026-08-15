import type { TextStatistics } from './text-statistics.service';
import {
  TEXT_STATISTICS_TASK_TIMEOUT_MS,
  type TextStatisticsTask,
  type TextStatisticsWorkerMessage,
  type TextStatisticsWorkerRequest,
  parseTextStatisticsTask,
  parseTextStatisticsWorkerMessage,
} from './text-statistics.worker.protocol';
import { BoundedTextTaskError } from '@/utils/bounded-text-task';
import {
  TerminateAndReplaceWorkerTask,
  type WorkerTaskEvent,
  type WorkerTaskHandle,
  type WorkerTaskResult,
} from '@/utils/worker-task';

function createWorker(): WorkerTaskHandle<TextStatisticsWorkerRequest> {
  return new Worker(new URL('./text-statistics.worker.ts', import.meta.url), {
    type: 'module',
    name: 'it-tools-text-statistics',
  });
}

export class TextStatisticsWorkerClient {
  private readonly runner: TerminateAndReplaceWorkerTask<
    TextStatisticsTask,
    TextStatistics,
    TextStatistics,
    'validation' | 'input-limit' | 'processing',
    BoundedTextTaskError
  >;

  constructor(workerFactory = createWorker, timeoutMs = TEXT_STATISTICS_TASK_TIMEOUT_MS) {
    this.runner = new TerminateAndReplaceWorkerTask({
      workerFactory,
      timeoutMs,
      messages: {
        replacement: 'A newer text analysis replaced this one.',
        unavailable: 'Text statistics workers are not available in this browser.',
        timeout: (_task, deadlineMs) => `Text analysis exceeded the ${deadlineMs / 1000}-second time limit.`,
        crash: 'The text statistics worker stopped unexpectedly.',
        postMessageFailure: 'Text analysis could not be started.',
      },
      decodeMessage: (value): WorkerTaskEvent<TextStatistics, 'validation' | 'input-limit' | 'processing'> => {
        const message: TextStatisticsWorkerMessage = parseTextStatisticsWorkerMessage(value);
        return message.type === 'result'
          ? { jobId: message.jobId, type: 'result', result: message.result }
          : message;
      },
      resolveResult: result => result,
      createError: (code, message, elapsedMs) => new BoundedTextTaskError(code, message, elapsedMs),
      protocolError: (_error, elapsedMs) => new BoundedTextTaskError('worker', 'The text statistics worker returned an invalid message.', elapsedMs),
    });
  }

  run(task: TextStatisticsTask): Promise<WorkerTaskResult<TextStatistics>> {
    this.cancel();
    try {
      return this.runner.run(parseTextStatisticsTask(task));
    }
    catch (error) {
      return Promise.reject(error);
    }
  }

  cancel(message = 'Text analysis cancelled.'): void {
    this.runner.cancel(message);
  }

  dispose(): void {
    this.cancel('Text analysis cancelled because the tool was closed.');
  }
}
