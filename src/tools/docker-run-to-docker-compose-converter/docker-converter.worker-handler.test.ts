import { describe, expect, it } from 'vitest';
import { handleDockerConverterWorkerRequest } from './docker-converter.worker-handler';

describe('Docker converter worker handler', () => {
  it('preserves conversion semantics and removes the obsolete Compose version', () => {
    const response = handleDockerConverterWorkerRequest({
      jobId: 1,
      task: { source: 'docker run --rm --foo bar nginx' },
    });

    expect(response).toMatchObject({
      jobId: 1,
      type: 'result',
      result: {
        yaml: { value: expect.stringMatching(/^services:/) },
        messages: [
          { type: 'notTranslatable', value: expect.stringContaining('--rm') },
          { type: 'errorDuringConversion', value: 'Unknown option: foo' },
        ],
      },
    });
  });

  it('returns static validation errors without echoing malformed envelopes', () => {
    expect(handleDockerConverterWorkerRequest({ jobId: 7, task: { source: '', secret: 'do-not-echo' } }))
      .toEqual({
        jobId: 7,
        type: 'error',
        code: 'validation',
        message: 'Enter a Docker run command to convert.',
      });
  });
});
