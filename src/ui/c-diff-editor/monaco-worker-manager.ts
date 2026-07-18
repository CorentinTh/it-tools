import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

let ownerCount = 0;
let previousEnvironment: Window['MonacoEnvironment'];
const workers = new Set<Worker>();

const managedEnvironment: NonNullable<Window['MonacoEnvironment']> = {
  getWorker() {
    if (ownerCount === 0) {
      throw new Error('The Monaco editor worker environment is no longer active.');
    }

    const worker = new EditorWorker();
    workers.add(worker);

    return worker;
  },
};

function terminateManagedWorkers() {
  let firstError: unknown;
  let terminationFailed = false;

  for (const worker of workers) {
    try {
      worker.terminate();
    }
    catch (error) {
      terminationFailed = true;
      firstError ??= error;
    }
  }
  workers.clear();

  if (terminationFailed) {
    throw firstError;
  }
}

function restorePreviousEnvironment() {
  if (window.MonacoEnvironment === managedEnvironment) {
    if (previousEnvironment) {
      window.MonacoEnvironment = previousEnvironment;
    }
    else {
      delete window.MonacoEnvironment;
    }
  }

  previousEnvironment = undefined;
}

/**
 * Monaco exposes one global worker factory. Keep it alive while at least one
 * diff editor owns it, then terminate every worker and restore the previous
 * environment without leaving an instance closure on window.
 */
export function acquireMonacoWorkerEnvironment() {
  if (ownerCount === 0) {
    previousEnvironment = window.MonacoEnvironment;
    window.MonacoEnvironment = managedEnvironment;
  }

  ownerCount++;
  let released = false;

  return () => {
    if (released) {
      return;
    }

    released = true;
    ownerCount--;

    if (ownerCount > 0) {
      return;
    }

    try {
      terminateManagedWorkers();
    }
    finally {
      restorePreviousEnvironment();
    }
  };
}
