import { describe, expect, it } from 'vitest';
import { handleDockerConverterWorkerRequest } from './docker-converter.worker-handler';

describe('Docker converter worker handler', () => {
  it('preserves conversion semantics and removes the obsolete Compose version', () => {
    const response = handleDockerConverterWorkerRequest({
      jobId: 1,
      task: { direction: 'run-to-compose', source: 'docker run --rm --foo bar nginx' },
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
    expect(handleDockerConverterWorkerRequest({ jobId: 7, task: { direction: 'run-to-compose', source: '', secret: 'do-not-echo' } }))
      .toEqual({
        jobId: 7,
        type: 'error',
        code: 'validation',
        message: 'Enter a Docker run command to convert.',
      });
  });

  it('converts Compose environment, ports, volumes, and command in the same bounded worker', () => {
    const response = handleDockerConverterWorkerRequest({
      jobId: 9,
      task: {
        direction: 'compose-to-run',
        source: 'services:\n  web:\n    image: nginx:alpine\n    ports: ["8080:80"]\n    volumes: ["./site:/usr/share/nginx/html:ro"]\n    environment:\n      APP_MODE: "local dev"\n    command: ["nginx", "-g", "daemon off;"]\n',
      },
    });
    expect(response).toMatchObject({ jobId: 9, type: 'result' });
    if (response.type !== 'result') {
      throw new Error('Expected a Compose-to-run result.');
    }
    expect(response.result.yaml.value).toContain('-e \\\n  \'APP_MODE=local dev\'');
    expect(response.result.yaml.value).toContain('-p \\\n  8080:80');
    expect(response.result.yaml.value).toContain('-v \\\n  ./site:/usr/share/nginx/html:ro');
  });
});
