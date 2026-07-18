import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

export const OUI_DATA_FORMAT_VERSION = 2;
export const OUI_DATA_FILE = 'oui-data.compact.json';
export const OUI_MAX_VENDOR_LENGTH = 1_000;
export const OUI_VENDOR_ID_RADIX = 36;
export const OUI_VENDOR_ID_WIDTH = 3;

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(scriptDirectory, '..');
const sourcePath = resolve(projectDirectory, 'node_modules/oui-data/index.json');
const packagePath = resolve(projectDirectory, 'node_modules/oui-data/package.json');
const dataDirectory = resolve(projectDirectory, 'src/tools/mac-address-lookup/data');
const legacyBucketDirectory = resolve(dataDirectory, 'buckets');
const metadataPath = resolve(dataDirectory, 'metadata.json');
const compactDataPath = resolve(dataDirectory, OUI_DATA_FILE);

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function compareStrings(left, right) {
  if (left < right) {
    return -1;
  }

  return left > right ? 1 : 0;
}

function sha256(contents) {
  return createHash('sha256').update(contents).digest('hex');
}

export function parseOuiSource(rawSource) {
  const value = JSON.parse(rawSource);

  if (!isRecord(value)) {
    throw new TypeError('The oui-data source must contain an object.');
  }

  const entries = Object.entries(value);
  if (entries.length === 0) {
    throw new TypeError('The oui-data source must contain at least one OUI record.');
  }

  for (const [prefix, vendor] of entries) {
    if (!/^[0-9A-F]{6}$/.test(prefix)) {
      throw new TypeError(`Invalid OUI prefix in source data: ${JSON.stringify(prefix)}.`);
    }

    if (typeof vendor !== 'string' || vendor.length === 0 || vendor.length > OUI_MAX_VENDOR_LENGTH) {
      throw new TypeError(`Invalid vendor value for OUI prefix ${prefix}.`);
    }
  }

  return entries.sort(([left], [right]) => compareStrings(left, right));
}

export function buildCompactOuiData(entries) {
  const vendors = [...new Set(entries.map(([, vendor]) => vendor))].sort(compareStrings);
  const maximumVendorCount = OUI_VENDOR_ID_RADIX ** OUI_VENDOR_ID_WIDTH;
  if (vendors.length > maximumVendorCount) {
    throw new RangeError(
      `The OUI vendor dictionary has ${vendors.length} values; the compact format supports at most ${maximumVendorCount}.`,
    );
  }

  const vendorIds = new Map(vendors.map((vendor, index) => [vendor, index]));
  const prefixDeltas = [];
  const encodedVendorIds = [];
  let previousPrefix = 0;

  for (const [prefix, vendor] of entries) {
    const numericPrefix = Number.parseInt(prefix, 16);
    prefixDeltas.push(numericPrefix - previousPrefix);
    previousPrefix = numericPrefix;

    const vendorId = vendorIds.get(vendor);
    if (vendorId === undefined) {
      throw new TypeError(`The OUI vendor dictionary is missing ${JSON.stringify(vendor)}.`);
    }
    encodedVendorIds.push(
      vendorId.toString(OUI_VENDOR_ID_RADIX).padStart(OUI_VENDOR_ID_WIDTH, '0'),
    );
  }

  return [prefixDeltas, encodedVendorIds.join(''), vendors];
}

export function buildOuiArtifacts({ rawSource, packageMetadata }) {
  const entries = parseOuiSource(rawSource);
  const compactData = buildCompactOuiData(entries);
  const compactContents = `${JSON.stringify(compactData)}\n`;
  const artifacts = new Map();
  artifacts.set(OUI_DATA_FILE, compactContents);

  const metadata = {
    schema: {
      id: 'it-tools.oui-compact',
      version: OUI_DATA_FORMAT_VERSION,
    },
    source: {
      package: 'oui-data',
      version: packageMetadata.version,
      license: packageMetadata.license,
      repository: packageMetadata.repository,
      sha256: sha256(rawSource),
    },
    records: entries.length,
    uniqueVendors: compactData[2].length,
    encoding: {
      prefixes: 'sorted-uint24-delta-decimal-array',
      vendorIds: `base${OUI_VENDOR_ID_RADIX}-fixed-width-string`,
      vendorIdWidth: OUI_VENDOR_ID_WIDTH,
      vendors: 'unicode-code-unit-sorted-unique-string-array',
      maxVendorLength: OUI_MAX_VENDOR_LENGTH,
    },
    artifact: {
      file: OUI_DATA_FILE,
      rawBytes: Buffer.byteLength(compactContents),
      sha256: sha256(compactContents),
    },
  };
  artifacts.set('metadata.json', `${JSON.stringify(metadata, null, 2)}\n`);

  return artifacts;
}

async function readGeneratedArtifact(relativePath) {
  const path = relativePath === 'metadata.json' ? metadataPath : compactDataPath;

  try {
    return await readFile(path, 'utf8');
  }
  catch (error) {
    if (error && typeof error === 'object' && error.code === 'ENOENT') {
      return undefined;
    }

    throw error;
  }
}

async function listGeneratedDirectoryEntries() {
  try {
    return (await readdir(dataDirectory, { withFileTypes: true }))
      .map(entry => `${entry.name}${entry.isDirectory() ? '/' : ''}`)
      .sort(compareStrings);
  }
  catch (error) {
    if (error && typeof error === 'object' && error.code === 'ENOENT') {
      return [];
    }

    throw error;
  }
}

export async function generateOuiData({ check = false } = {}) {
  const [rawSource, rawPackageMetadata] = await Promise.all([
    readFile(sourcePath, 'utf8'),
    readFile(packagePath, 'utf8'),
  ]);
  const packageMetadata = JSON.parse(rawPackageMetadata);
  const artifacts = buildOuiArtifacts({ rawSource, packageMetadata });
  const expectedEntries = [...artifacts.keys()].sort(compareStrings);

  if (check) {
    const mismatches = [];
    for (const [relativePath, expected] of artifacts) {
      if (await readGeneratedArtifact(relativePath) !== expected) {
        mismatches.push(relativePath);
      }
    }

    const actualEntries = await listGeneratedDirectoryEntries();
    const unexpected = actualEntries.filter(entry => !expectedEntries.includes(entry));
    if (mismatches.length > 0 || unexpected.length > 0) {
      throw new Error(
        `Generated OUI data is stale. Mismatched: ${mismatches.join(', ') || 'none'}; unexpected: ${unexpected.join(', ') || 'none'}. Run pnpm generate:oui-data.`,
      );
    }
  }
  else {
    await mkdir(dataDirectory, { recursive: true });
    await Promise.all([...artifacts.entries()].map(([relativePath, contents]) => {
      return writeFile(resolve(dataDirectory, relativePath), contents, 'utf8');
    }));
    await rm(legacyBucketDirectory, { recursive: true, force: true });
  }

  return JSON.parse(artifacts.get('metadata.json'));
}

const isMainModule = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMainModule) {
  const unknownArguments = process.argv.slice(2).filter(argument => argument !== '--check');
  if (unknownArguments.length > 0) {
    throw new Error(`Unknown arguments: ${unknownArguments.join(', ')}.`);
  }

  const metadata = await generateOuiData({ check: process.argv.includes('--check') });
  process.stdout.write(
    `OUI data ${process.argv.includes('--check') ? 'verified' : 'generated'}: ${metadata.records} records, ${metadata.uniqueVendors} vendors, ${metadata.artifact.rawBytes} raw bytes.\n`,
  );
}
