export const MOCK_DATASET_VERSION = 'it-tools-en-v1';
export const MOCK_DATA_MAX_RECORDS = 5_000;
export const MOCK_DATA_MAX_SEED_BYTES = 128;
export const MOCK_DATA_MAX_OUTPUT_BYTES = 2 * 1024 * 1024;

export const MOCK_DATA_PROFILES = ['full', 'person', 'address', 'dates', 'internet', 'identifiers'] as const;
export const MOCK_DATA_FORMATS = ['json', 'csv'] as const;

export type MockDataProfile = typeof MOCK_DATA_PROFILES[number];
export type MockDataFormat = typeof MOCK_DATA_FORMATS[number];

export interface MockDataOptions {
  seed: string
  count: number
  profile: MockDataProfile
  format: MockDataFormat
}

type MockRecord = Record<string, string | number>;
type RandomSource = () => number;

const FIRST_NAMES = ['Ada', 'Aisha', 'Alex', 'Amelia', 'Ana', 'Benjamin', 'Chloe', 'Daniel', 'Elena', 'Ethan', 'Grace', 'Hugo', 'Iris', 'James', 'Jordan', 'Kai', 'Leah', 'Liam', 'Maya', 'Mia', 'Noah', 'Nora', 'Olivia', 'Oscar', 'Priya', 'Ravi', 'Sam', 'Sofia', 'Theo', 'Victoria', 'Yuki', 'Zoe'];
const LAST_NAMES = ['Anderson', 'Brown', 'Chen', 'Davis', 'Garcia', 'Green', 'Hall', 'Ivanov', 'Johnson', 'Khan', 'Kim', 'Lee', 'Martin', 'Miller', 'Moore', 'Nguyen', 'Patel', 'Perez', 'Robinson', 'Smith', 'Taylor', 'Thomas', 'Walker', 'Wilson', 'Young'];
const JOB_TITLES = ['Backend Engineer', 'Data Analyst', 'Designer', 'DevOps Engineer', 'Engineering Manager', 'Frontend Engineer', 'Product Manager', 'QA Engineer', 'Security Engineer', 'Support Specialist'];
const STREET_NAMES = ['Cedar', 'Church', 'Elm', 'Garden', 'Highland', 'Lake', 'Main', 'Maple', 'Market', 'Oak', 'Park', 'Pine', 'River', 'Sunset', 'Washington'];
const STREET_TYPES = ['Avenue', 'Boulevard', 'Drive', 'Lane', 'Road', 'Street', 'Way'];
const CITIES = ['Austin', 'Boston', 'Chicago', 'Denver', 'London', 'Melbourne', 'New York', 'Portland', 'Seattle', 'Singapore', 'Toronto', 'Vancouver'];
const STATES = ['California', 'Colorado', 'Florida', 'Illinois', 'Massachusetts', 'New York', 'Oregon', 'Texas', 'Washington'];
const COUNTRY_BY_CITY: Readonly<Record<string, string>> = {
  London: 'United Kingdom',
  Melbourne: 'Australia',
  Singapore: 'Singapore',
  Toronto: 'Canada',
  Vancouver: 'Canada',
};
const DOMAIN_WORDS = ['acme', 'atlas', 'bright', 'cloud', 'ember', 'forge', 'harbor', 'lumen', 'northstar', 'orbit', 'pixel', 'summit', 'vertex', 'willow'];
const TLDS = ['com', 'dev', 'io', 'net', 'org'];
const CROCKFORD32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const NANOID_ALPHABET = '_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DATE_START_MS = Date.UTC(1980, 0, 1);
const DATE_END_MS = Date.UTC(2025, 11, 31, 23, 59, 59, 999);

export class MockDataLimitError extends Error {
  override readonly name = 'MockDataLimitError';
}

export function parseMockRecordCount(value: string): number {
  if (value.length === 0 || value.length > String(MOCK_DATA_MAX_RECORDS).length || !/^\d+$/.test(value)) {
    return Number.NaN;
  }
  return Number(value);
}

export function validateMockDataOptions(options: MockDataOptions): string | undefined {
  if (!MOCK_DATA_PROFILES.includes(options.profile)) {
    return 'Select a supported data profile.';
  }
  if (!MOCK_DATA_FORMATS.includes(options.format)) {
    return 'Select JSON or CSV output.';
  }
  if (!Number.isSafeInteger(options.count) || options.count < 1 || options.count > MOCK_DATA_MAX_RECORDS) {
    return `Record count must be a whole number between 1 and ${MOCK_DATA_MAX_RECORDS.toLocaleString('en-US')}.`;
  }
  if (options.seed.trim() === '') {
    return 'Enter a seed so this dataset can be reproduced.';
  }
  if (new TextEncoder().encode(options.seed).byteLength > MOCK_DATA_MAX_SEED_BYTES) {
    return `Seed is limited to ${MOCK_DATA_MAX_SEED_BYTES} UTF-8 bytes.`;
  }
  return undefined;
}

function createSeed(seed: string): number {
  let state = 0x811C9DC5;
  for (const byte of new TextEncoder().encode(`${MOCK_DATASET_VERSION}\0${seed}`)) {
    state ^= byte;
    state = Math.imul(state, 0x01000193);
  }
  return state >>> 0;
}

function createRandom(seed: string): RandomSource {
  let state = createSeed(seed);
  return () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function pick<T>(random: RandomSource, values: readonly T[]): T {
  return values[Math.floor(random() * values.length)];
}

function integer(random: RandomSource, minimum: number, maximum: number): number {
  return minimum + Math.floor(random() * (maximum - minimum + 1));
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '');
}

function randomHex(random: RandomSource, length: number): string {
  return Array.from({ length }, () => Math.floor(random() * 16).toString(16)).join('');
}

function uuid(random: RandomSource): string {
  const hex = randomHex(random, 32).split('');
  hex[12] = '4';
  hex[16] = (8 + Math.floor(random() * 4)).toString(16);
  return `${hex.slice(0, 8).join('')}-${hex.slice(8, 12).join('')}-${hex.slice(12, 16).join('')}-${hex.slice(16, 20).join('')}-${hex.slice(20).join('')}`;
}

function nanoid(random: RandomSource, length = 21): string {
  return Array.from({ length }, () => NANOID_ALPHABET[Math.floor(random() * NANOID_ALPHABET.length)]).join('');
}

function encodeCrockford(value: bigint, length: number): string {
  let remaining = value;
  let encoded = '';
  for (let index = 0; index < length; index++) {
    encoded = CROCKFORD32[Number(remaining & 31n)] + encoded;
    remaining >>= 5n;
  }
  return encoded;
}

function ulid(random: RandomSource, timestamp: number): string {
  let randomness = 0n;
  for (let index = 0; index < 10; index++) {
    randomness = (randomness << 8n) | BigInt(integer(random, 0, 255));
  }
  return encodeCrockford(BigInt(timestamp), 10) + encodeCrockford(randomness, 16);
}

function randomDate(random: RandomSource): Date {
  return new Date(Math.floor(DATE_START_MS + random() * (DATE_END_MS - DATE_START_MS + 1)));
}

function personRecord(random: RandomSource): MockRecord {
  const firstName = pick(random, FIRST_NAMES);
  const lastName = pick(random, LAST_NAMES);
  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    jobTitle: pick(random, JOB_TITLES),
  };
}

function addressRecord(random: RandomSource): MockRecord {
  const city = pick(random, CITIES);
  return {
    streetAddress: `${integer(random, 1, 9999)} ${pick(random, STREET_NAMES)} ${pick(random, STREET_TYPES)}`,
    city,
    state: COUNTRY_BY_CITY[city] ? '' : pick(random, STATES),
    postalCode: String(integer(random, 10000, 99999)),
    country: COUNTRY_BY_CITY[city] ?? 'United States',
  };
}

function datesRecord(random: RandomSource): MockRecord {
  const date = randomDate(random);
  return {
    date: date.toISOString().slice(0, 10),
    dateTime: date.toISOString(),
    unixTimestamp: Math.floor(date.getTime() / 1000),
  };
}

function internetRecord(random: RandomSource, person?: MockRecord): MockRecord {
  const firstName = String(person?.firstName ?? pick(random, FIRST_NAMES));
  const lastName = String(person?.lastName ?? pick(random, LAST_NAMES));
  const username = `${slug(firstName)}.${slug(lastName)}${integer(random, 1, 999)}`;
  const domain = `${pick(random, DOMAIN_WORDS)}-${pick(random, DOMAIN_WORDS)}.${pick(random, TLDS)}`;
  const ipv4 = `${integer(random, 1, 223)}.${integer(random, 0, 255)}.${integer(random, 0, 255)}.${integer(random, 1, 254)}`;
  return {
    username,
    email: `${username}@${domain}`,
    domain,
    url: `https://${domain}/${slug(firstName)}-${slug(lastName)}`,
    ipv4,
  };
}

function identifiersRecord(random: RandomSource): MockRecord {
  const timestamp = randomDate(random).getTime();
  return {
    uuid: uuid(random),
    ulid: ulid(random, timestamp),
    nanoid: nanoid(random),
  };
}

export function createMockRecord(random: RandomSource, profile: MockDataProfile, index: number): MockRecord {
  if (profile === 'person') {
    return personRecord(random);
  }
  if (profile === 'address') {
    return addressRecord(random);
  }
  if (profile === 'dates') {
    return datesRecord(random);
  }
  if (profile === 'internet') {
    return internetRecord(random);
  }
  if (profile === 'identifiers') {
    return identifiersRecord(random);
  }

  const person = personRecord(random);
  return {
    row: index + 1,
    ...person,
    ...addressRecord(random),
    ...datesRecord(random),
    ...internetRecord(random, person),
    ...identifiersRecord(random),
  };
}

function csvCell(value: string | number): string {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function appendBounded(parts: string[], value: string, byteLength: number): number {
  const nextByteLength = byteLength + value.length;
  if (nextByteLength > MOCK_DATA_MAX_OUTPUT_BYTES) {
    throw new MockDataLimitError(`Generated output exceeds ${MOCK_DATA_MAX_OUTPUT_BYTES} bytes.`);
  }
  parts.push(value);
  return nextByteLength;
}

export function generateMockData(options: MockDataOptions): string {
  const validationMessage = validateMockDataOptions(options);
  if (validationMessage) {
    throw new RangeError(validationMessage);
  }

  const random = createRandom(options.seed);
  const firstRecord = createMockRecord(random, options.profile, 0);
  const columns = Object.keys(firstRecord);
  const parts: string[] = [];
  let byteLength = 0;

  if (options.format === 'csv') {
    byteLength = appendBounded(parts, `${columns.join(',')}\n`, byteLength);
    const appendRecord = (record: MockRecord, index: number) => {
      const line = columns.map(column => csvCell(record[column])).join(',');
      byteLength = appendBounded(parts, `${index === options.count - 1 ? line : `${line}\n`}`, byteLength);
    };
    appendRecord(firstRecord, 0);
    for (let index = 1; index < options.count; index++) {
      appendRecord(createMockRecord(random, options.profile, index), index);
    }
    return parts.join('');
  }

  byteLength = appendBounded(parts, '[\n', byteLength);
  const appendRecord = (record: MockRecord, index: number) => {
    const json = JSON.stringify(record, null, 2).split('\n').map(line => `  ${line}`).join('\n');
    byteLength = appendBounded(parts, `${json}${index === options.count - 1 ? '\n' : ',\n'}`, byteLength);
  };
  appendRecord(firstRecord, 0);
  for (let index = 1; index < options.count; index++) {
    appendRecord(createMockRecord(random, options.profile, index), index);
  }
  appendBounded(parts, ']', byteLength);
  return parts.join('');
}
