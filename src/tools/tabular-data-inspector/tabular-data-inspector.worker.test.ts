import { describe, expect, it } from 'vitest';
import { handleTabularDataRequest } from './tabular-data-inspector.worker';

describe('tabular data worker', () => {
  it('processes a strict task and returns static errors for malformed requests', () => {
    const task = { source: 'a,b\n1,2', delimiter: 'comma', firstRowHeader: true, trimCells: false, outputFormat: 'json-strings', emptyCellMode: 'empty-string', protectSpreadsheetFormulas: true };
    expect(handleTabularDataRequest({ jobId: 4, task })).toEqual(expect.objectContaining({ jobId: 4, type: 'result' }));
    expect(handleTabularDataRequest({ jobId: 5, task: { ...task, extra: true } })).toEqual(expect.objectContaining({ jobId: 5, type: 'error', code: 'validation' }));
  });
});
