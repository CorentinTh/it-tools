const MAX_OUI_PREFIX = 0xFF_FF_FF;
const VENDOR_ID_RADIX = 36;
const VENDOR_ID_WIDTH = 3;
const MAX_VENDOR_COUNT = VENDOR_ID_RADIX ** VENDOR_ID_WIDTH;
export const OUI_MAX_VENDOR_LENGTH = 1_000;

export interface OuiDataIndex {
  prefixes: Uint32Array
  vendorIds: Uint16Array
  vendors: readonly string[]
}

export class OuiDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OuiDataError';
  }
}

function fail(message: string): never {
  throw new OuiDataError(`The generated OUI database is invalid: ${message}`);
}

export function decodeCompactOuiData(value: unknown): OuiDataIndex {
  if (!Array.isArray(value) || value.length !== 3) {
    fail('expected one three-field compact tuple.');
  }

  const [rawPrefixDeltas, rawVendorIds, rawVendors] = value;
  if (!Array.isArray(rawPrefixDeltas) || rawPrefixDeltas.length === 0) {
    fail('the prefix-delta field must be a non-empty array.');
  }
  if (typeof rawVendorIds !== 'string') {
    fail('the vendor-id field must be a string.');
  }
  if (!Array.isArray(rawVendors) || rawVendors.length === 0 || rawVendors.length > MAX_VENDOR_COUNT) {
    fail(`the vendor dictionary must contain between 1 and ${MAX_VENDOR_COUNT} values.`);
  }

  const vendors: string[] = [];
  let previousVendor: string | undefined;
  for (const vendor of rawVendors) {
    if (typeof vendor !== 'string' || vendor.length === 0 || vendor.length > OUI_MAX_VENDOR_LENGTH) {
      fail(`every vendor must be a non-empty string of at most ${OUI_MAX_VENDOR_LENGTH} characters.`);
    }
    if (previousVendor !== undefined && vendor <= previousVendor) {
      fail('the vendor dictionary must be strictly sorted and unique.');
    }
    vendors.push(vendor);
    previousVendor = vendor;
  }

  if (rawVendorIds.length !== rawPrefixDeltas.length * VENDOR_ID_WIDTH) {
    fail('the vendor-id field length does not match the prefix count.');
  }

  const prefixes = new Uint32Array(rawPrefixDeltas.length);
  const vendorIds = new Uint16Array(rawPrefixDeltas.length);
  let prefix = 0;

  for (let index = 0; index < rawPrefixDeltas.length; index += 1) {
    const delta = rawPrefixDeltas[index];
    if (typeof delta !== 'number' || !Number.isSafeInteger(delta) || delta < 0 || (index > 0 && delta === 0)) {
      fail('prefix deltas must be safe non-negative integers and strictly advance after the first record.');
    }

    prefix += delta;
    if (!Number.isSafeInteger(prefix) || prefix > MAX_OUI_PREFIX) {
      fail('a decoded prefix exceeds the six-hex-digit OUI range.');
    }
    prefixes[index] = prefix;

    const encodedVendorId = rawVendorIds.slice(index * VENDOR_ID_WIDTH, (index + 1) * VENDOR_ID_WIDTH);
    if (!/^[0-9a-z]{3}$/.test(encodedVendorId)) {
      fail('vendor identifiers must use lower-case fixed-width base36 values.');
    }
    const vendorId = Number.parseInt(encodedVendorId, VENDOR_ID_RADIX);
    if (vendorId >= vendors.length) {
      fail('a vendor identifier points outside the vendor dictionary.');
    }
    vendorIds[index] = vendorId;
  }

  return { prefixes, vendorIds, vendors };
}

export function lookupOuiVendor(index: OuiDataIndex, prefix: string): string | undefined {
  if (!/^[0-9A-F]{6}$/.test(prefix)) {
    throw new OuiDataError('An OUI lookup prefix must contain exactly six upper-case hexadecimal characters.');
  }

  const numericPrefix = Number.parseInt(prefix, 16);
  let low = 0;
  let high = index.prefixes.length - 1;

  while (low <= high) {
    const middle = (low + high) >>> 1;
    const candidate = index.prefixes[middle];
    if (candidate === numericPrefix) {
      const vendor = index.vendors[index.vendorIds[middle]];
      if (vendor === undefined) {
        throw new OuiDataError('The OUI index references a missing vendor.');
      }
      return vendor;
    }
    if (candidate < numericPrefix) {
      low = middle + 1;
    }
    else {
      high = middle - 1;
    }
  }

  return undefined;
}
