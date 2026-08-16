import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync, gunzipSync } from 'node:zlib';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, '..');
const outputDirectory = resolve(repositoryRoot, 'public/assets/geoip');

export const GEOIP_DATASETS = [
  {
    family: 4,
    fileName: 'user-country-ipv4.csv.gz',
    lineCount: 283_655,
    sha256: '3dd562b9f02ebe76cbab4ef72579fb7aed1887a278e9d27be60bf26535b6b505',
  },
  {
    family: 6,
    fileName: 'user-country-ipv6.csv.gz',
    lineCount: 270_769,
    sha256: '114b80d6aa8301da1b795bce75a3ff4ad502a698501f744948d9164c0cb5a8c8',
  },
];

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function validateCsv(value, dataset) {
  if (sha256(value) !== dataset.sha256) {
    throw new Error(`GeoIP IPv${dataset.family} source checksum does not match the pinned release.`);
  }
  const text = value.toString('utf8');
  const lines = text.trimEnd().split('\n');
  if (lines.length !== dataset.lineCount) {
    throw new Error(`GeoIP IPv${dataset.family} row count is ${lines.length}; expected ${dataset.lineCount}.`);
  }
  const rowPattern = dataset.family === 4
    ? /^\d{1,3}(?:\.\d{1,3}){3},\d{1,3}(?:\.\d{1,3}){3},[A-Z]{2}$/
    : /^[0-9a-f:]+,[0-9a-f:]+,[A-Z]{2}$/;
  if (!lines.every(line => rowPattern.test(line))) {
    throw new Error(`GeoIP IPv${dataset.family} source contains an invalid row.`);
  }
}

async function checkGeneratedData() {
  for (const dataset of GEOIP_DATASETS) {
    const compressed = await readFile(resolve(outputDirectory, dataset.fileName));
    validateCsv(gunzipSync(compressed), dataset);
  }
}

async function generateData(sourceDirectory) {
  await mkdir(outputDirectory, { recursive: true });
  for (const dataset of GEOIP_DATASETS) {
    const sourcePath = resolve(sourceDirectory, dataset.fileName.replace(/\.gz$/, ''));
    const value = await readFile(sourcePath);
    validateCsv(value, dataset);
    await writeFile(resolve(outputDirectory, dataset.fileName), gzipSync(value, { level: 9 }));
  }
}

if (process.argv.includes('--check')) {
  await checkGeneratedData();
  console.log('Verified 2 pinned offline GeoIP datasets.');
}
else {
  const sourceDirectory = process.argv[2];
  if (!sourceDirectory) {
    throw new Error('Usage: node scripts/generate-geoip-data.mjs <directory-containing-user-country-csv-files>');
  }
  await generateData(resolve(sourceDirectory));
  console.log('Generated 2 pinned offline GeoIP datasets.');
}
