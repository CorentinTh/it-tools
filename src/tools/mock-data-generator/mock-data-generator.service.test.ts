import { describe, expect, it, vi } from 'vitest';
import {
  MOCK_DATA_MAX_OUTPUT_BYTES,
  MockDataLimitError,
  generateMockData,
  parseMockRecordCount,
  validateMockDataOptions,
} from './mock-data-generator.service';

describe('mock data generation', () => {
  it('replays identical structured data for the same seed and changes it for another seed', () => {
    const options = { seed: 'release-42', count: 3, profile: 'full' as const, format: 'json' as const };
    const first = generateMockData(options);
    const replay = generateMockData(options);
    const changed = generateMockData({ ...options, seed: 'release-43' });

    expect(replay).toBe(first);
    expect(changed).not.toBe(first);
    const records = JSON.parse(first) as Array<Record<string, unknown>>;
    expect(records).toHaveLength(3);
    expect(records[0]).toMatchObject({
      row: 1,
      firstName: expect.any(String),
      streetAddress: expect.any(String),
      dateTime: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
      email: expect.stringContaining('@'),
      uuid: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/),
      ulid: expect.stringMatching(/^[0-9A-HJKMNP-TV-Z]{26}$/),
      nanoid: expect.stringMatching(/^[_\-0-9A-Za-z]{21}$/),
    });
  });

  it.each(['person', 'address', 'dates', 'internet', 'identifiers'] as const)(
    'generates a bounded %s profile',
    (profile) => {
      const output = generateMockData({ seed: 'profiles', count: 2, profile, format: 'json' });
      expect(JSON.parse(output)).toHaveLength(2);
      expect(new TextEncoder().encode(output).byteLength).toBeLessThan(MOCK_DATA_MAX_OUTPUT_BYTES);
    },
  );

  it('emits RFC-4180-compatible flat CSV with a stable header', () => {
    const output = generateMockData({ seed: 'csv', count: 2, profile: 'person', format: 'csv' });
    const lines = output.split('\n');
    expect(lines).toHaveLength(3);
    expect(lines[0]).toBe('firstName,lastName,fullName,jobTitle');
    expect(lines[1].split(',')).toHaveLength(4);
    expect(output.endsWith('\n')).toBe(false);
  });

  it('never uses Math.random', () => {
    const random = vi.spyOn(Math, 'random').mockImplementation(() => {
      throw new Error('Math.random is not deterministic.');
    });
    expect(() => generateMockData({ seed: 'safe', count: 10, profile: 'full', format: 'json' })).not.toThrow();
    expect(random).not.toHaveBeenCalled();
  });

  it('rejects malformed counts and invalid bounded options', () => {
    expect(parseMockRecordCount('5000')).toBe(5_000);
    expect(parseMockRecordCount('')).toBeNaN();
    expect(parseMockRecordCount('-1')).toBeNaN();
    expect(parseMockRecordCount('1.5')).toBeNaN();
    expect(parseMockRecordCount('9'.repeat(1_000_000))).toBeNaN();
    expect(validateMockDataOptions({ seed: '', count: 1, profile: 'person', format: 'json' }))
      .toContain('seed');
    expect(validateMockDataOptions({ seed: 'x', count: 5_001, profile: 'person', format: 'json' }))
      .toContain('between');
    expect(() => generateMockData({ seed: 'x', count: 0, profile: 'person', format: 'json' }))
      .toThrow(RangeError);
  });

  it('stops a maximum full-profile request at the output bound', () => {
    expect(() => generateMockData({ seed: 'large', count: 5_000, profile: 'full', format: 'json' }))
      .toThrow(MockDataLimitError);
  });
});
