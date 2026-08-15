import { describe, expect, it } from 'vitest';
import {
  HASH_TEXT_ALGORITHMS,
  HASH_TEXT_ERROR_MESSAGES,
  HASH_TEXT_MAX_INPUT_BYTES,
  parseHashTextDigestPayload,
  parseHashTextTask,
} from './hash-text.worker.protocol';

describe('Hash Text worker protocol', () => {
  it('accepts only an exact bounded task', () => {
    expect(parseHashTextTask({ encoding: 'Hex', source: '' })).toEqual({ encoding: 'Hex', source: '' });
    expect(() => parseHashTextTask({ encoding: 'Hex', source: 'secret', leaked: true })).toThrow(HASH_TEXT_ERROR_MESSAGES.validation);
    expect(() => parseHashTextTask({ encoding: 'ROT13', source: 'secret' })).toThrow(HASH_TEXT_ERROR_MESSAGES.validation);
    expect(() => parseHashTextTask({ encoding: 'Hex', source: 'x'.repeat(HASH_TEXT_MAX_INPUT_BYTES + 1) }))
      .toThrow(HASH_TEXT_ERROR_MESSAGES['input-limit']);
  });

  it('decodes only all eight bounded digest fields', () => {
    const values = Object.fromEntries(HASH_TEXT_ALGORITHMS.map(algorithm => [algorithm, `${algorithm}-digest`]));
    expect(parseHashTextDigestPayload(JSON.stringify(values))).toEqual(values);
    expect(parseHashTextDigestPayload(JSON.stringify({ ...values, source: 'do-not-accept' }))).toBeUndefined();
    expect(parseHashTextDigestPayload(JSON.stringify({ ...values, SHA256: '' }))).toBeUndefined();
    expect(parseHashTextDigestPayload('not-json')).toBeUndefined();
  });
});
