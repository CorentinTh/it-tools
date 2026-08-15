import {
  HTML_FORMAT_TASK_TIMEOUT_MS,
  type HtmlFormatTask,
  HtmlFormatTaskError,
  type HtmlFormatWorkerErrorCode,
  type HtmlFormatWorkerMessage,
  type HtmlFormatWorkerRequest,
  parseHtmlFormatTask,
  parseHtmlFormatWorkerMessage,
  toHtmlFormatTaskError,
} from './html-wysiwyg-editor.worker.protocol';
import {
  TerminateAndReplaceWorkerTask,
  type WorkerTaskEvent,
  type WorkerTaskHandle,
  type WorkerTaskResult,
} from '@/utils/worker-task';

export type HtmlFormatWorkerHandle = WorkerTaskHandle<HtmlFormatWorkerRequest>;
export type HtmlFormatWorkerFactory = () => HtmlFormatWorkerHandle;
export type HtmlFormatTaskResult = WorkerTaskResult<string>;

function createWorker(): HtmlFormatWorkerHandle {
  return new Worker(new URL('./html-wysiwyg-editor.worker.ts', import.meta.url), {
    type: 'module',
    name: 'it-tools-html-formatter',
  });
}

function decodeWorkerMessage(value: unknown): WorkerTaskEvent<string, HtmlFormatWorkerErrorCode> {
  const message: HtmlFormatWorkerMessage = parseHtmlFormatWorkerMessage(value);
  return message.type === 'result'
    ? { jobId: message.jobId, type: 'result', result: message.result.html }
    : message;
}

export class HtmlFormatWorkerClient {
  private readonly taskRunner: TerminateAndReplaceWorkerTask<
    HtmlFormatTask,
    string,
    string,
    HtmlFormatWorkerErrorCode,
    HtmlFormatTaskError
  >;

  private disposed = false;

  constructor(
    workerFactory: HtmlFormatWorkerFactory = createWorker,
    timeoutMs = HTML_FORMAT_TASK_TIMEOUT_MS,
  ) {
    this.taskRunner = new TerminateAndReplaceWorkerTask({
      workerFactory,
      timeoutMs,
      messages: {
        replacement: 'A newer HTML document replaced this formatting task.',
        unavailable: 'HTML formatting workers are not available in this browser.',
        timeout: (_task, deadlineMs) => `HTML formatting exceeded the ${deadlineMs / 1000}-second time limit.`,
        crash: 'The HTML formatting worker stopped unexpectedly.',
        postMessageFailure: 'HTML formatting could not be started.',
      },
      decodeMessage: decodeWorkerMessage,
      resolveResult: result => result,
      createError: (code, message, elapsedMs) => new HtmlFormatTaskError(code, message, elapsedMs),
      protocolError: (error, elapsedMs) => {
        const taskError = toHtmlFormatTaskError(error, 'worker');
        return new HtmlFormatTaskError('worker', taskError.message, elapsedMs);
      },
    });
  }

  run(task: HtmlFormatTask): Promise<HtmlFormatTaskResult> {
    if (this.disposed) {
      return Promise.reject(new HtmlFormatTaskError(
        'unavailable',
        'The HTML formatter has already been closed.',
      ));
    }

    let validatedTask: HtmlFormatTask;
    try {
      validatedTask = parseHtmlFormatTask(task);
    }
    catch (error) {
      return Promise.reject(toHtmlFormatTaskError(error, 'validation'));
    }
    return this.taskRunner.run(validatedTask);
  }

  cancel(message = 'HTML formatting cancelled.'): void {
    this.taskRunner.cancel(message);
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    this.cancel('HTML formatting cancelled because the tool was closed.');
  }
}
