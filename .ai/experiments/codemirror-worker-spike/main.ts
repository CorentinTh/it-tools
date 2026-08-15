import { Change, MergeView } from '@codemirror/merge';
import { EditorView, drawSelection, highlightActiveLine, keymap, lineNumbers } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';

interface SerializedChange {
  fromA: number
  toA: number
  fromB: number
  toB: number
}

interface SpikeApi {
  destroy: () => void
  getState: () => { modified: string; original: string; rebuilds: number; workerElapsedMs: number }
  replaceModified: (from: number, to: number, insert: string) => void
  setDocuments: (original: string, modified: string) => Promise<void>
}

declare global {
  interface Window {
    __codeMirrorWorkerSpike: SpikeApi
  }
}

const parent = document.querySelector('#editor');
const status = document.querySelector('#status');
if (!(parent instanceof HTMLElement) || !(status instanceof HTMLElement)) {
  throw new Error('The spike host is incomplete.');
}

let mergeView: MergeView | undefined;
let worker: Worker | undefined;
let jobId = 0;
let rebuilds = 0;
let workerElapsedMs = 0;
let buildingWith: readonly SerializedChange[] | undefined;
let settle: (() => void) | undefined;
let scheduleTimer: number | undefined;

function extensions() {
  return [
    lineNumbers(),
    history(),
    drawSelection(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of([...defaultKeymap, ...historyKeymap, ...searchKeymap]),
    EditorView.lineWrapping,
    EditorView.updateListener.of((update) => {
      if (update.docChanged && buildingWith === undefined) {
        queueDiff();
      }
    }),
  ];
}

function queueDiff(): void {
  if (scheduleTimer !== undefined) {
    window.clearTimeout(scheduleTimer);
  }
  scheduleTimer = window.setTimeout(() => {
    scheduleTimer = undefined;
    scheduleDiff();
  }, 150);
}

function rebuild(original: string, modified: string, changes: readonly SerializedChange[]): void {
  mergeView?.destroy();
  parent.replaceChildren();
  buildingWith = changes;
  mergeView = new MergeView({
    parent,
    a: { doc: original, extensions: extensions() },
    b: { doc: modified, extensions: extensions() },
    diffConfig: {
      override: () => (buildingWith ?? []).map(change => new Change(
        change.fromA,
        change.toA,
        change.fromB,
        change.toB,
      )),
    },
    gutter: true,
    highlightChanges: true,
  });
  buildingWith = undefined;
  rebuilds += 1;
}

function scheduleDiff(original = mergeView?.a.state.doc.toString() ?? '', modified = mergeView?.b.state.doc.toString() ?? ''): void {
  worker?.terminate();
  const currentJobId = ++jobId;
  status.textContent = 'Computing in worker…';
  worker = new Worker(new URL('./diff.worker.ts', import.meta.url), { type: 'module' });
  worker.onmessage = (event: MessageEvent<unknown>) => {
    if (currentJobId !== jobId || typeof event.data !== 'object' || event.data === null) {
      return;
    }
    const response = event.data as { type?: unknown; changes?: unknown; elapsedMs?: unknown };
    if (response.type !== 'result' || !Array.isArray(response.changes) || typeof response.elapsedMs !== 'number') {
      status.textContent = 'Worker rejected the documents.';
      worker?.terminate();
      worker = undefined;
      settle?.();
      settle = undefined;
      return;
    }
    workerElapsedMs = response.elapsedMs;
    rebuild(original, modified, response.changes as SerializedChange[]);
    status.textContent = `Ready (${response.changes.length} changes, ${response.elapsedMs.toFixed(1)} ms worker)`;
    worker?.terminate();
    worker = undefined;
    settle?.();
    settle = undefined;
  };
  worker.onerror = () => {
    status.textContent = 'Worker failed.';
    worker?.terminate();
    worker = undefined;
    settle?.();
    settle = undefined;
  };
  worker.postMessage({ jobId: currentJobId, original, modified });
}

window.__codeMirrorWorkerSpike = {
  setDocuments(original, modified) {
    return new Promise<void>((resolve) => {
      settle = resolve;
      scheduleDiff(original, modified);
    });
  },
  replaceModified(from, to, insert) {
    mergeView?.b.dispatch({ changes: { from, to, insert } });
  },
  getState() {
    return {
      original: mergeView?.a.state.doc.toString() ?? '',
      modified: mergeView?.b.state.doc.toString() ?? '',
      rebuilds,
      workerElapsedMs,
    };
  },
  destroy() {
    ++jobId;
    if (scheduleTimer !== undefined) {
      window.clearTimeout(scheduleTimer);
      scheduleTimer = undefined;
    }
    worker?.terminate();
    worker = undefined;
    mergeView?.destroy();
    mergeView = undefined;
    parent.replaceChildren();
  },
};

void window.__codeMirrorWorkerSpike.setDocuments('original text', 'modified text');
