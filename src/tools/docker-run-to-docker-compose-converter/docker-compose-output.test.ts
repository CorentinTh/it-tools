import { describe, expect, it } from 'vitest';
import { removeObsoleteComposeVersion } from './docker-compose-output';

describe('removeObsoleteComposeVersion', () => {
  it('removes the generated top-level Compose version field', () => {
    expect(removeObsoleteComposeVersion('version: \'3.9\'\nservices:\n  app:\n    image: nginx\n'))
      .toBe('services:\n  app:\n    image: nginx\n');
  });

  it('supports CRLF output and an optional byte-order mark', () => {
    expect(removeObsoleteComposeVersion('\uFEFFversion: "3.8"\r\nservices:\r\n'))
      .toBe('services:\r\n');
  });

  it('leaves documents without a top-level version field unchanged', () => {
    const composeYaml = 'services:\n  version:\n    image: example/version\n';

    expect(removeObsoleteComposeVersion(composeYaml)).toBe(composeYaml);
  });
});
