import { describe, expect, it } from 'vitest';
import {
  OuiLookupError,
  parseOuiLookupTask,
  parseOuiWorkerMessage,
  parseOuiWorkerRequest,
} from './mac-address-lookup.worker.protocol';

describe('OUI worker protocol', () => {
  it('accepts strict lookup requests and nullable results', () => {
    const task = { operation: 'lookup' as const, prefix: '203706' };
    expect(parseOuiLookupTask(task)).toEqual(task);
    expect(parseOuiWorkerRequest({ jobId: 7, task })).toEqual({ jobId: 7, task });
    expect(parseOuiWorkerMessage({ jobId: 7, type: 'result', operation: 'lookup', value: 'Cisco' }))
      .toEqual({ jobId: 7, type: 'result', operation: 'lookup', value: 'Cisco' });
    expect(parseOuiWorkerMessage({ jobId: 8, type: 'result', operation: 'lookup', value: null }))
      .toEqual({ jobId: 8, type: 'result', operation: 'lookup', value: null });
  });

  it.each([
    { jobId: 0, task: { operation: 'lookup', prefix: '203706' } },
    { jobId: 1, task: { operation: 'lookup', prefix: '20370' } },
    { jobId: 1, task: { operation: 'lookup', prefix: '20370a' } },
    { jobId: 1, task: { operation: 'other', prefix: '203706' } },
  ])('rejects malformed requests %#', (request) => {
    expect(() => parseOuiWorkerRequest(request)).toThrow();
  });

  it.each([
    { jobId: 1, type: 'result', operation: 'lookup' },
    { jobId: 1, type: 'result', operation: 'lookup', value: '' },
    { jobId: 1, type: 'result', operation: 'lookup', value: 'x'.repeat(1_001) },
    { jobId: 1, type: 'error', code: 'unknown', message: 'Failure' },
    { jobId: 1, type: 'error', code: 'operation', message: '' },
    { jobId: 1, type: 'error', code: 'operation', message: 'x'.repeat(1_001) },
  ])('rejects malformed worker messages %#', (message) => {
    expect(() => parseOuiWorkerMessage(message)).toThrow();
  });

  it.each([
    { type: 'result', operation: 'lookup', value: 'Cisco' },
    { jobId: 0, type: 'result', operation: 'lookup', value: 'Cisco' },
    { jobId: '1', type: 'result', operation: 'lookup', value: 'Cisco' },
  ])('classifies an invalid response job identifier as a worker protocol failure %#', (message) => {
    try {
      parseOuiWorkerMessage(message);
      throw new Error('Expected the response to be rejected.');
    }
    catch (error) {
      expect(error).toBeInstanceOf(OuiLookupError);
      expect((error as OuiLookupError).code).toBe('worker');
    }
  });
});
