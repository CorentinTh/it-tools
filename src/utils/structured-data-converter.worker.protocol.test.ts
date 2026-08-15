import { describe, expect, it } from 'vitest';
import {
  JSON_SOURCE_CONVERSIONS,
  STRUCTURED_CONVERTER_MAX_INPUT_BYTES,
  parseStructuredDataConversionTask,
} from './structured-data-converter.worker.protocol';
import { BoundedTextTaskError } from './bounded-text-task';

describe('structured data converter protocol', () => {
  it('accepts an exact task for the owning source family', () => {
    expect(parseStructuredDataConversionTask(
      { conversion: 'json-to-yaml', source: '{"ok":true}' },
      JSON_SOURCE_CONVERSIONS,
    )).toEqual({ conversion: 'json-to-yaml', source: '{"ok":true}' });
  });

  it.each([
    { conversion: 'yaml-to-json', source: 'ok: true' },
    { conversion: 'json-to-yaml', extra: true, source: '{"ok":true}' },
    { conversion: 'json-to-yaml', source: '   ' },
  ])('rejects an unsupported or non-exact task', (task) => {
    expect(() => parseStructuredDataConversionTask(task, JSON_SOURCE_CONVERSIONS)).toThrow(BoundedTextTaskError);
  });

  it('enforces the exact UTF-8 input ceiling', () => {
    const source = `"${'💩'.repeat(Math.floor(STRUCTURED_CONVERTER_MAX_INPUT_BYTES / 4))}"`;
    expect(() => parseStructuredDataConversionTask(
      { conversion: 'json-to-yaml', source },
      JSON_SOURCE_CONVERSIONS,
    )).toThrowError(/limited/);
  });
});
