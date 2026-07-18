import { describe, expect, it } from 'vitest';
import {
  REGEX_MAX_INPUT_BYTES,
  REGEX_MAX_MATCHES,
  REGEX_MAX_PATTERN_BYTES,
  REGEX_MAX_SAMPLE_CHARACTERS,
  RegexTaskError,
  getUtf8ByteLength,
  parseRegexTask,
  parseRegexWorkerMessage,
  parseRegexWorkerRequest,
} from './regex-tester.worker.protocol';

function expectErrorCode(action: () => unknown, code: RegexTaskError['code']): void {
  try {
    action();
    throw new Error('Expected task validation to fail.');
  }
  catch (error) {
    expect(error).toBeInstanceOf(RegexTaskError);
    expect((error as RegexTaskError).code).toBe(code);
  }
}

describe('regex worker protocol', () => {
  it('parses bounded match and sample tasks', () => {
    expect(parseRegexTask({ operation: 'match', pattern: '(?<x>a)?b', text: 'b', flags: 'dgu' })).toEqual({
      operation: 'match',
      pattern: '(?<x>a)?b',
      text: 'b',
      flags: 'dgu',
    });
    expect(parseRegexTask({ operation: 'sample', pattern: '[a-z]+', flags: 'di' })).toEqual({
      operation: 'sample',
      pattern: '[a-z]+',
      flags: 'di',
    });
  });

  it('measures UTF-8 limits rather than JavaScript code units', () => {
    expect(getUtf8ByteLength('😀')).toBe(4);
    expectErrorCode(
      () => parseRegexTask({ operation: 'sample', pattern: '😀'.repeat(REGEX_MAX_PATTERN_BYTES / 4 + 1), flags: '' }),
      'limit',
    );
    expectErrorCode(
      () => parseRegexTask({ operation: 'match', pattern: '.', text: '😀'.repeat(REGEX_MAX_INPUT_BYTES / 4 + 1), flags: '' }),
      'limit',
    );
  });

  it('rejects malformed patterns and unsupported or conflicting flags', () => {
    expectErrorCode(() => parseRegexTask({ operation: 'sample', pattern: '(', flags: '' }), 'syntax');
    expectErrorCode(() => parseRegexTask({ operation: 'sample', pattern: 'a', flags: 'gg' }), 'validation');
    expectErrorCode(() => parseRegexTask({ operation: 'sample', pattern: 'a', flags: 'uv' }), 'validation');
    expectErrorCode(() => parseRegexTask({ operation: 'sample', pattern: 'a', flags: 'x' }), 'validation');
  });

  it('requires a positive safe job identifier', () => {
    expect(parseRegexWorkerRequest({
      jobId: 7,
      task: { operation: 'sample', pattern: 'a', flags: '' },
    })).toMatchObject({ jobId: 7 });
    expectErrorCode(
      () => parseRegexWorkerRequest({ jobId: 0, task: { operation: 'sample', pattern: 'a', flags: '' } }),
      'validation',
    );
  });

  it('preserves optional-capture undefined metadata in a worker result', () => {
    const message = parseRegexWorkerMessage({
      jobId: 4,
      type: 'result',
      operation: 'match',
      value: {
        matches: [
          {
            index: 0,
            value: 'b',
            captures: [{ name: '1', value: undefined, start: undefined, end: undefined }],
            groups: [{ name: 'x', value: undefined, start: undefined, end: undefined }],
          },
        ],
        truncated: false,
      },
    });

    expect(message).toMatchObject({
      operation: 'match',
      value: {
        matches: [{ captures: [{ value: undefined }], groups: [{ value: undefined }] }],
      },
    });
  });

  it('rejects oversized or malformed worker output', () => {
    expectErrorCode(
      () => parseRegexWorkerMessage({
        jobId: 1,
        type: 'result',
        operation: 'sample',
        value: 'x'.repeat(REGEX_MAX_SAMPLE_CHARACTERS + 1),
      }),
      'worker',
    );
    expectErrorCode(
      () => parseRegexWorkerMessage({
        jobId: 1,
        type: 'result',
        operation: 'match',
        value: {
          matches: Array.from({ length: REGEX_MAX_MATCHES + 1 }, () => ({
            index: 0,
            value: 'a',
            captures: [],
            groups: [],
          })),
          truncated: true,
        },
      }),
      'worker',
    );
    expectErrorCode(() => parseRegexWorkerMessage({ jobId: 1, type: 'unknown' }), 'worker');
  });

  it('accepts only bounded, user-safe error messages', () => {
    expect(parseRegexWorkerMessage({
      jobId: 2,
      type: 'error',
      code: 'limit',
      message: 'Input is too large.',
    })).toEqual({ jobId: 2, type: 'error', code: 'limit', message: 'Input is too large.' });
    expectErrorCode(
      () => parseRegexWorkerMessage({ jobId: 2, type: 'error', code: 'worker', message: 'bad' }),
      'worker',
    );
  });
});
