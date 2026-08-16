import { describe, expect, it } from 'vitest';
import { handleDeveloperTextRequest } from './developer-text-workspace.worker';

describe('developer text worker', () => {
  it('returns bounded transformed output', () => {
    const message = handleDeveloperTextRequest({
      jobId: 4,
      task: { operation: 'folder-tree', source: 'src/main.ts', find: '', replacement: '', regex: false, caseSensitive: true },
    });
    expect(message.type).toBe('result');
    if (message.type !== 'result') {
      throw new Error('Expected result');
    }
    expect(message.result.value).toBe('└── src/\n    └── main.ts');
  });

  it('returns static errors without echoing malformed content', () => {
    const message = handleDeveloperTextRequest({
      jobId: 5,
      task: { operation: 'unknown', source: 'secret-value', find: '', replacement: '', regex: false, caseSensitive: true },
    });
    expect(message).toEqual({ jobId: 5, type: 'error', code: 'validation', message: 'Enter bounded text and valid options for the selected operation.' });
    expect(JSON.stringify(message)).not.toContain('secret-value');
  });
});
