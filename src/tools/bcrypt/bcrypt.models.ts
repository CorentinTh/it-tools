export type Update<Result> =
  | {
    kind: 'progress'
    progress: number
  }
  | {
    kind: 'success'
    value: Result
    timeTakenMs: number
  }
  | {
    kind: 'error'
    message: string
  };

export class TimedOutError extends Error {
  name = 'TimedOutError';
}
export class InvalidatedError extends Error {
  name = 'InvalidatedError';
}

// generic type for the callback versions of bcryptjs's `hash` and `compare`
export type BcryptFn<Param, Result> = (
  arg1: string,
  arg2: Param,
  callback: (err: Error | null, hash: Result) => void,
  progressCallback: (percent: number) => void,
) => void;

interface BcryptWithProgressOptions {
  controller: AbortController
  timeoutMs: number
}

export async function* bcryptWithProgressUpdates<Param, Result>(
  fn: BcryptFn<Param, Result>,
  args: [string, Param],
  options?: Partial<BcryptWithProgressOptions>,
): AsyncGenerator<Update<Result>, undefined, undefined> {
  const { controller = new AbortController(), timeoutMs = 10_000 } = options ?? {};

  let res = (_: Update<Result>) => {};
  const nextPromise = () =>
    new Promise<Update<Result>>((resolve) => {
      res = resolve;
    });
  const promises = [nextPromise()];
  const nextValue = (value: Update<Result>) => {
    res(value);
    promises.push(nextPromise());
  };

  const start = Date.now();

  fn(
    args[0],
    args[1],
    (err, value) => {
      nextValue(
        err == null
          ? { kind: 'success', value, timeTakenMs: Date.now() - start }
          : { kind: 'error', message: err.message },
      );
    },
    (progress) => {
      if (controller.signal.aborted) {
        nextValue({ kind: 'progress', progress: 0 });
        if (controller.signal.reason instanceof TimedOutError) {
          nextValue({ kind: 'error', message: controller.signal.reason.message });
        }

        // throw inside callback to cancel execution of hashing/comparing
        throw controller.signal.reason;
      }
      else {
        nextValue({ kind: 'progress', progress });
      }
    },
  );

  setTimeout(() => {
    controller.abort(new TimedOutError(`Timed out after ${(timeoutMs / 1000).toLocaleString('en-US')}\xA0seconds`));
  }, timeoutMs);

  for await (const value of promises) {
    yield value;

    if (value.kind === 'success' || value.kind === 'error') {
      return;
    }
  }
}
