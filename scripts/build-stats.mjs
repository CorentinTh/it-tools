#!/usr/bin/env node

import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, extname, posix, relative, resolve, sep } from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import { gzipSync, constants as zlibConstants } from 'node:zlib';

export const BUILD_STATS_SCHEMA = Object.freeze({
  id: 'it-tools.build-stats',
  version: 4,
});

export const BUILD_BUDGETS_SCHEMA = Object.freeze({
  id: 'it-tools.build-budgets',
  version: 1,
});

const DEFAULT_DIST_DIRECTORY = 'dist';
const DEFAULT_LARGEST_ASSET_COUNT = 20;
const VITE_MANIFEST_CANDIDATES = ['.vite/manifest.json', 'manifest.json'];
const JAVASCRIPT_ARTIFACT_EXTENSIONS = new Set(['.js', '.mjs', '.cjs']);
const MANDATORY_ASYNC_SHELL_SOURCES = new Set([
  'src/layouts/base.layout.vue',
  'src/modules/pwa/OfflineRouteUnavailable.vue',
  'src/pages/Home.page.vue',
]);
const WORKER_REFERENCE_PATTERNS = Object.freeze([
  {
    relativeToOwner: true,
    pattern: /\bnew\s+(?:Worker|SharedWorker)\s*\(\s*new\s+URL\s*\(\s*(?:"((?:\\.|[^"\\\r\n])*)"|'((?:\\.|[^'\\\r\n])*)'|`((?:\\.|[^`\\\r\n])*)`)/g,
  },
  {
    relativeToOwner: false,
    pattern: /\bnew\s+(?:Worker|SharedWorker)\s*\(\s*(?:"((?:\\.|[^"\\\r\n])*)"|'((?:\\.|[^'\\\r\n])*)'|`((?:\\.|[^`\\\r\n])*)`)/g,
  },
]);

function compareText(left, right) {
  if (left < right) {
    return -1;
  }

  if (left > right) {
    return 1;
  }

  return 0;
}

function toPosixPath(filePath) {
  return filePath.split(sep).join('/');
}

/**
 * Replace Vite-style content hashes without hiding the stable asset name.
 * Hashes are deliberately excluded from reports so equivalent rebuilds do not
 * produce a baseline diff only because an imported chunk changed its hash.
 */
export function normalizeHashedPath(filePath) {
  return filePath.replace(/-[a-f\d]{8,64}(?=\.[^/]+$)/gi, '-<hash>');
}

function extensionOf(filePath) {
  return extname(filePath).toLowerCase() || '(none)';
}

function gzipSize(contents) {
  return gzipSync(contents, {
    level: zlibConstants.Z_BEST_COMPRESSION,
  }).byteLength;
}

async function listFiles(rootDirectory, currentDirectory = rootDirectory) {
  const entries = await readdir(currentDirectory, { withFileTypes: true });
  entries.sort((left, right) => compareText(left.name, right.name));

  const paths = [];

  for (const entry of entries) {
    const absolutePath = resolve(currentDirectory, entry.name);

    if (entry.isDirectory()) {
      paths.push(...(await listFiles(rootDirectory, absolutePath)));
      continue;
    }

    if (entry.isSymbolicLink()) {
      throw new Error(`Build output must not contain symbolic links: ${absolutePath}`);
    }

    if (entry.isFile()) {
      paths.push(toPosixPath(relative(rootDirectory, absolutePath)));
    }
  }

  return paths;
}

function summarize(records) {
  return {
    fileCount: records.length,
    rawBytes: records.reduce((total, record) => total + record.rawBytes, 0),
    gzipBytes: records.reduce((total, record) => total + record.gzipBytes, 0),
  };
}

function summarizeByExtension(records) {
  const groups = new Map();

  for (const record of records) {
    const extension = extensionOf(record.actualPath);
    const group = groups.get(extension) ?? [];
    group.push(record);
    groups.set(extension, group);
  }

  return [...groups.entries()]
    .sort(([left], [right]) => compareText(left, right))
    .map(([extension, group]) => ({
      extension,
      ...summarize(group),
    }));
}

function readAttribute(tag, attributeName) {
  const pattern = new RegExp(`\\s${attributeName}\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s\"'<>]+))`, 'i');
  const match = pattern.exec(tag);
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null;
}

/**
 * Return only resources that participate in loading the application shell.
 * Icons, the web manifest, canonical URLs, and author links are intentionally
 * not treated as shell JS/CSS/preloads.
 */
export function extractShellReferences(html) {
  const references = [];
  const tags = html.match(/<(?:script|link)\b[^>]*>/gi) ?? [];

  for (const tag of tags) {
    if (/^<script\b/i.test(tag)) {
      const source = readAttribute(tag, 'src');
      if (source) {
        references.push({ kind: 'script', url: source });
      }
      continue;
    }

    const relation = readAttribute(tag, 'rel')?.toLowerCase().split(/\s+/) ?? [];
    const href = readAttribute(tag, 'href');

    if (!href) {
      continue;
    }

    if (relation.includes('stylesheet')) {
      references.push({ kind: 'stylesheet', url: href });
    }
    else if (relation.includes('modulepreload')) {
      references.push({ kind: 'modulepreload', url: href });
    }
    else if (relation.includes('preload')) {
      references.push({ kind: 'preload', url: href });
    }
  }

  return references;
}

function artifactPathFromUrl(url, { allowExternal = false } = {}) {
  const value = url.trim();

  if (!value || value.startsWith('#') || value.startsWith('data:')) {
    return null;
  }

  if (/^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(value)) {
    if (allowExternal) {
      return null;
    }

    throw new Error(`Expected a local build artifact URL, received: ${url}`);
  }

  let pathname;

  try {
    pathname = decodeURIComponent(value.split(/[?#]/, 1)[0]);
  }
  catch {
    throw new Error(`Build artifact URL is not valid percent-encoding: ${url}`);
  }

  const normalized = posix.normalize(pathname.replace(/^\/+/, ''));

  if (normalized === '.' || normalized === '..' || normalized.startsWith('../')) {
    throw new Error(`Build artifact URL resolves outside dist: ${url}`);
  }

  return normalized;
}

function knownArtifactPathFromUrl(url, recordsByActualPath, options) {
  const urlPath = artifactPathFromUrl(url, options);

  if (!urlPath || recordsByActualPath.has(urlPath)) {
    return urlPath;
  }

  const suffixMatches = [...recordsByActualPath.keys()]
    .filter(actualPath => urlPath.endsWith(`/${actualPath}`))
    .sort((left, right) => right.length - left.length || compareText(left, right));

  return suffixMatches[0] ?? urlPath;
}

function findClosingArray(source, openingIndex) {
  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let index = openingIndex; index < source.length; index += 1) {
    const character = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
      }
      else if (character === '\\') {
        escaped = true;
      }
      else if (character === quote) {
        quote = null;
      }

      continue;
    }

    if (character === '"' || character === '\'') {
      quote = character;
    }
    else if (character === '[') {
      depth += 1;
    }
    else if (character === ']') {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }

  throw new Error('Unable to find the end of the Workbox precache array');
}

/**
 * Extract the generated Workbox precache list without evaluating service-worker
 * code. Terser may remove quotes from object keys, so those keys are restored
 * before parsing the otherwise JSON-compatible generateSW array.
 */
function quoteJavascriptObjectKeys(source) {
  let result = '';
  let quote = null;
  let escaped = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];

    if (quote) {
      result += character;

      if (escaped) {
        escaped = false;
      }
      else if (character === '\\') {
        escaped = true;
      }
      else if (character === quote) {
        quote = null;
      }

      continue;
    }

    if (character === '"') {
      quote = character;
      result += character;
      continue;
    }

    if (character === '\'') {
      throw new Error('Workbox precache array contains unsupported single-quoted strings');
    }

    if (/[A-Za-z_$]/.test(character)) {
      const previousCharacter = result.trimEnd().at(-1);

      if (previousCharacter === '{' || previousCharacter === ',') {
        let identifierEnd = index + 1;
        while (/[\w$]/.test(source[identifierEnd] ?? '')) {
          identifierEnd += 1;
        }

        let colonIndex = identifierEnd;
        while (/\s/.test(source[colonIndex] ?? '')) {
          colonIndex += 1;
        }

        if (source[colonIndex] === ':') {
          result += `"${source.slice(index, identifierEnd)}"`;
          index = identifierEnd - 1;
          continue;
        }
      }
    }

    result += character;
  }

  return result;
}

export function extractWorkboxPrecacheUrls(serviceWorkerSource) {
  const markerIndex = serviceWorkerSource.indexOf('precacheAndRoute');

  if (markerIndex === -1) {
    throw new Error('sw.js does not contain a Workbox precacheAndRoute call');
  }

  const callIndex = serviceWorkerSource.indexOf('(', markerIndex);

  if (callIndex === -1) {
    throw new Error('Unable to parse the Workbox precacheAndRoute call');
  }

  let openingIndex = callIndex + 1;
  while (/\s/.test(serviceWorkerSource[openingIndex] ?? '')) {
    openingIndex += 1;
  }

  if (serviceWorkerSource[openingIndex] !== '[') {
    throw new Error('Workbox precache input is not an inline array; generateSW output is required');
  }

  const closingIndex = findClosingArray(serviceWorkerSource, openingIndex);
  let entries;

  try {
    const arraySource = serviceWorkerSource.slice(openingIndex, closingIndex + 1);
    entries = JSON.parse(quoteJavascriptObjectKeys(arraySource));
  }
  catch (error) {
    throw new Error(`Unable to parse the Workbox precache array: ${error.message}`);
  }

  if (!Array.isArray(entries)) {
    throw new TypeError('Workbox precache input must be an array');
  }

  return entries.map((entry, index) => {
    const url = typeof entry === 'string' ? entry : entry?.url;

    if (typeof url !== 'string' || !url) {
      throw new TypeError(`Workbox precache entry ${index} does not contain a URL`);
    }

    return url;
  });
}

function compareReportRecords(left, right) {
  return (
    compareText(left.path, right.path)
    || left.rawBytes - right.rawBytes
    || left.gzipBytes - right.gzipBytes
    || compareText(left.actualPath, right.actualPath)
  );
}

function toReportRecord(record) {
  return {
    path: record.path,
    rawBytes: record.rawBytes,
    gzipBytes: record.gzipBytes,
  };
}

async function collectFileRecords(distDirectory) {
  const paths = await listFiles(distDirectory);

  return Promise.all(
    paths.map(async (actualPath) => {
      const contents = await readFile(resolve(distDirectory, actualPath));

      return {
        actualPath,
        path: normalizeHashedPath(actualPath),
        sha256: createHash('sha256').update(contents).digest('hex'),
        rawBytes: contents.byteLength,
        gzipBytes: gzipSize(contents),
        contents,
      };
    }),
  );
}

function isJavaScriptArtifactPath(filePath) {
  return JAVASCRIPT_ARTIFACT_EXTENSIONS.has(extname(filePath).toLowerCase());
}

function extractWorkerReferences(source, ownerPath) {
  const references = [];

  for (const { pattern, relativeToOwner } of WORKER_REFERENCE_PATTERNS) {
    pattern.lastIndex = 0;
    let match;

    while ((match = pattern.exec(source)) !== null) {
      const url = match[1] ?? match[2] ?? match[3];

      if (url.includes('\\') || url.includes('${')) {
        throw new Error(
          `Vite manifest artifact "${ownerPath}" contains an unsupported escaped or interpolated worker URL`,
        );
      }

      references.push({
        index: match.index,
        relativeToOwner,
        url,
      });
    }
  }

  return references
    .sort((left, right) => left.index - right.index || compareText(left.url, right.url))
    .filter((reference, index, sortedReferences) => (
      index === 0
      || reference.index !== sortedReferences[index - 1].index
      || reference.url !== sortedReferences[index - 1].url
    ));
}

function normalizeWorkerReferencePath(url, ownerPath, relativeToOwner) {
  const value = url.trim();

  if (!value || value.startsWith('#') || value.startsWith('data:') || value.startsWith('blob:')) {
    return null;
  }

  if (/^[a-z][a-z\d+.-]*:/i.test(value) || value.startsWith('//')) {
    return null;
  }

  let pathname;

  try {
    pathname = decodeURIComponent(value.split(/[?#]/, 1)[0]);
  }
  catch {
    throw new Error(
      `Vite manifest artifact "${ownerPath}" contains an invalid percent-encoded worker URL: ${url}`,
    );
  }

  const isAbsolute = pathname.startsWith('/');
  const normalizedPath = relativeToOwner && !isAbsolute
    ? posix.normalize(posix.join(posix.dirname(ownerPath), pathname))
    : posix.normalize(pathname.replace(/^\/+/, ''));

  if (
    normalizedPath === '.'
    || normalizedPath === '..'
    || normalizedPath.startsWith('../')
    || posix.isAbsolute(normalizedPath)
  ) {
    throw new Error(
      `Vite manifest artifact "${ownerPath}" has a worker URL outside dist: ${url}`,
    );
  }

  return {
    allowBasePathSuffix: isAbsolute,
    path: normalizedPath,
  };
}

function resolveWorkerArtifactPath(reference, ownerPath, recordsByActualPath) {
  const normalizedReference = normalizeWorkerReferencePath(
    reference.url,
    ownerPath,
    reference.relativeToOwner,
  );

  if (!normalizedReference) {
    return null;
  }

  const directRecord = recordsByActualPath.get(normalizedReference.path);
  let actualPath = directRecord?.actualPath;

  if (!actualPath && normalizedReference.allowBasePathSuffix) {
    const suffixMatches = [...recordsByActualPath.keys()]
      .filter(candidate => normalizedReference.path.endsWith(`/${candidate}`))
      .sort((left, right) => right.length - left.length || compareText(left, right));

    if (suffixMatches.length > 0) {
      const longestLength = suffixMatches[0].length;
      const longestMatches = suffixMatches.filter(candidate => candidate.length === longestLength);

      if (longestMatches.length > 1) {
        throw new Error(
          `Vite manifest artifact "${ownerPath}" has an ambiguous worker URL: ${reference.url}`,
        );
      }

      [actualPath] = longestMatches;
    }
  }

  if (!actualPath) {
    throw new Error(
      `Vite manifest artifact "${ownerPath}" references a missing worker artifact: ${normalizedReference.path}`,
    );
  }

  if (!isJavaScriptArtifactPath(actualPath)) {
    throw new Error(
      `Vite manifest artifact "${ownerPath}" references a non-JavaScript worker artifact: ${actualPath}`,
    );
  }

  return actualPath;
}

function parseManifestStringArray(value, field, manifestKey) {
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value) || value.some(item => typeof item !== 'string' || !item)) {
    throw new TypeError(`Vite manifest entry "${manifestKey}" has an invalid ${field} array`);
  }

  return [...value];
}

function parseViteManifest(source, manifestPath) {
  let manifest;

  try {
    manifest = JSON.parse(source);
  }
  catch (error) {
    throw new Error(`Unable to parse ${manifestPath}: ${error.message}`);
  }

  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    throw new TypeError(`${manifestPath} must contain a JSON object`);
  }

  const records = Object.entries(manifest)
    .sort(([left], [right]) => compareText(left, right))
    .map(([key, value]) => {
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new TypeError(`Vite manifest entry "${key}" must be an object`);
      }

      if (typeof value.file !== 'string' || !value.file) {
        throw new TypeError(`Vite manifest entry "${key}" does not contain a file`);
      }

      if (value.src !== undefined && (typeof value.src !== 'string' || !value.src)) {
        throw new TypeError(`Vite manifest entry "${key}" has an invalid src`);
      }

      for (const flag of ['isEntry', 'isDynamicEntry']) {
        if (value[flag] !== undefined && typeof value[flag] !== 'boolean') {
          throw new TypeError(`Vite manifest entry "${key}" has an invalid ${flag} flag`);
        }
      }

      return {
        key,
        src: value.src ?? null,
        file: value.file,
        isEntry: value.isEntry === true,
        isDynamicEntry: value.isDynamicEntry === true,
        imports: parseManifestStringArray(value.imports, 'imports', key),
        dynamicImports: parseManifestStringArray(value.dynamicImports, 'dynamicImports', key),
        css: parseManifestStringArray(value.css, 'css', key),
        assets: parseManifestStringArray(value.assets, 'assets', key),
      };
    });
  const recordsByKey = new Map(records.map(record => [record.key, record]));

  for (const record of records) {
    for (const importedKey of [...record.imports, ...record.dynamicImports]) {
      if (!recordsByKey.has(importedKey)) {
        throw new Error(
          `Vite manifest entry "${record.key}" imports missing entry "${importedKey}"`,
        );
      }
    }
  }

  return { records, recordsByKey };
}

function discoverWorkerArtifactOwnership(records, recordsByActualPath) {
  const workerArtifactPathsByRecordKey = new Map();

  for (const record of records) {
    const ownerPath = artifactPathFromUrl(record.file);
    const ownerArtifact = recordsByActualPath.get(ownerPath);

    if (!ownerArtifact) {
      throw new Error(
        `Vite manifest entry "${record.key}" references a missing artifact: ${ownerPath}`,
      );
    }

    if (!isJavaScriptArtifactPath(ownerPath)) {
      continue;
    }

    const workerArtifactPaths = new Set();
    const source = ownerArtifact.contents.toString('utf8');

    for (const reference of extractWorkerReferences(source, ownerPath)) {
      const workerArtifactPath = resolveWorkerArtifactPath(
        reference,
        ownerPath,
        recordsByActualPath,
      );

      if (workerArtifactPath) {
        workerArtifactPaths.add(workerArtifactPath);
      }
    }

    if (workerArtifactPaths.size > 0) {
      workerArtifactPathsByRecordKey.set(
        record.key,
        [...workerArtifactPaths].sort(compareText),
      );
    }
  }

  return workerArtifactPathsByRecordKey;
}

function manifestArtifactRecords(
  records,
  recordsByActualPath,
  workerArtifactPathsByRecordKey,
) {
  const artifactPaths = new Set();

  for (const record of records) {
    const declaredArtifactUrls = [record.file, ...record.css, ...record.assets];

    for (const url of declaredArtifactUrls) {
      const actualPath = artifactPathFromUrl(url);

      if (!actualPath) {
        throw new Error(`Vite manifest entry "${record.key}" contains an empty artifact path`);
      }

      if (!recordsByActualPath.has(actualPath)) {
        throw new Error(
          `Vite manifest entry "${record.key}" references a missing artifact: ${actualPath}`,
        );
      }

      artifactPaths.add(actualPath);
    }

    for (const actualPath of workerArtifactPathsByRecordKey.get(record.key) ?? []) {
      if (!recordsByActualPath.has(actualPath)) {
        throw new Error(
          `Vite manifest entry "${record.key}" owns a missing worker artifact: ${actualPath}`,
        );
      }

      artifactPaths.add(actualPath);
    }
  }

  return [...artifactPaths]
    .map(actualPath => recordsByActualPath.get(actualPath))
    .sort(compareReportRecords);
}

function summarizeWorkerArtifacts(
  records,
  workerArtifactPathsByRecordKey,
  recordsByActualPath,
) {
  const ownersByWorkerPath = new Map();

  for (const record of records) {
    for (const workerPath of workerArtifactPathsByRecordKey.get(record.key) ?? []) {
      const owners = ownersByWorkerPath.get(workerPath) ?? [];
      owners.push({
        file: normalizeHashedPath(artifactPathFromUrl(record.file)),
        manifestId: manifestRecordIdentity(record, recordsByActualPath),
      });
      ownersByWorkerPath.set(workerPath, owners);
    }
  }

  const entries = [...ownersByWorkerPath]
    .map(([workerPath, owners]) => {
      const workerArtifact = recordsByActualPath.get(workerPath);

      if (!workerArtifact) {
        throw new Error(`Worker ownership references a missing artifact: ${workerPath}`);
      }

      return {
        ...toReportRecord(workerArtifact),
        owners: owners.sort((left, right) => (
          compareText(left.manifestId, right.manifestId)
          || compareText(left.file, right.file)
        )),
      };
    })
    .sort((left, right) => compareText(left.path, right.path));

  return {
    totals: summarize(entries),
    ownershipEdgeCount: entries.reduce((total, entry) => total + entry.owners.length, 0),
    entries,
  };
}

function artifactIdentity(record) {
  return `${record.path}@sha256:${record.sha256}`;
}

function manifestRecordIdentity(record, recordsByActualPath) {
  if (record.src) {
    return `source:${record.src.split('\\').join('/')}`;
  }

  const actualPath = artifactPathFromUrl(record.file);
  const fileRecord = recordsByActualPath.get(actualPath);
  return `generated:${normalizeHashedPath(record.key)}@sha256:${fileRecord.sha256}`;
}

function identitySetDigest(identities) {
  return createHash('sha256')
    .update(JSON.stringify([...identities].sort(compareText)))
    .digest('hex');
}

function summarizeManifestClosure(
  records,
  artifacts,
  recordsByActualPath,
  workerArtifactPaths,
) {
  const manifestIds = records
    .map(record => manifestRecordIdentity(record, recordsByActualPath))
    .sort(compareText);
  const artifactIdentities = artifacts
    .map(artifactIdentity)
    .sort(compareText);

  return {
    manifestRecordCount: records.length,
    workerArtifactCount: artifacts.filter(artifact => (
      workerArtifactPaths.has(artifact.actualPath)
    )).length,
    ...summarize(artifacts),
    membershipDigests: {
      manifestIdsSha256: identitySetDigest(manifestIds),
      artifactIdentitiesSha256: identitySetDigest(artifactIdentities),
    },
  };
}

function collectManifestRecordClosure(rootKey, recordsByKey, importFields) {
  const visitedKeys = new Set();
  const pendingKeys = [rootKey];

  while (pendingKeys.length > 0) {
    const key = pendingKeys.pop();

    if (visitedKeys.has(key)) {
      continue;
    }

    visitedKeys.add(key);
    const record = recordsByKey.get(key);
    const importedKeys = importFields
      .flatMap(field => record[field])
      .sort(compareText)
      .reverse();
    pendingKeys.push(...importedKeys);
  }

  return [...visitedKeys]
    .sort(compareText)
    .map(key => recordsByKey.get(key));
}

function collectManifestRecordClosures(rootKeys, recordsByKey, importFields) {
  const recordsByClosureKey = new Map();

  for (const rootKey of rootKeys) {
    for (const record of collectManifestRecordClosure(rootKey, recordsByKey, importFields)) {
      recordsByClosureKey.set(record.key, record);
    }
  }

  return [...recordsByClosureKey.values()].sort((left, right) => compareText(left.key, right.key));
}

function analyzeViteManifest(source, manifestPath, recordsByActualPath) {
  const { records, recordsByKey } = parseViteManifest(source, manifestPath);
  const workerArtifactPathsByRecordKey = discoverWorkerArtifactOwnership(
    records,
    recordsByActualPath,
  );
  const workerArtifacts = summarizeWorkerArtifacts(
    records,
    workerArtifactPathsByRecordKey,
    recordsByActualPath,
  );
  const actualWorkerArtifactPaths = new Set(
    [...workerArtifactPathsByRecordKey.values()].flat(),
  );
  const staticImportEdgeCount = records.reduce((total, record) => total + record.imports.length, 0);
  const dynamicImportEdgeCount = records.reduce(
    (total, record) => total + record.dynamicImports.length,
    0,
  );
  const artifactRecords = manifestArtifactRecords(
    records,
    recordsByActualPath,
    workerArtifactPathsByRecordKey,
  );
  const entryRecords = records.filter(record => record.isEntry || record.isDynamicEntry);
  const mandatoryAsyncShellRecords = records.filter(record => (
    typeof record.src === 'string' && MANDATORY_ASYNC_SHELL_SOURCES.has(record.src)
  ));
  const mainEntryInitialRecords = collectManifestRecordClosures(
    [
      ...records.filter(record => record.isEntry).map(record => record.key),
      ...mandatoryAsyncShellRecords.map(record => record.key),
    ],
    recordsByKey,
    ['imports'],
  );
  const mainEntryInitialArtifacts = manifestArtifactRecords(
    mainEntryInitialRecords,
    recordsByActualPath,
    workerArtifactPathsByRecordKey,
  );
  const mainEntryInitialRecordKeys = new Set(mainEntryInitialRecords.map(record => record.key));
  const mainEntryInitialArtifactPaths = new Set(
    mainEntryInitialArtifacts.map(record => record.actualPath),
  );

  return {
    closureDefinitions: {
      initialClosure: {
        importFields: ['imports'],
        artifactFields: ['file', 'css', 'assets', 'referencedWorkers'],
      },
      mandatoryAsyncShellSources: [...MANDATORY_ASYNC_SHELL_SOURCES].sort(compareText),
      reachableClosure: {
        importFields: ['imports', 'dynamicImports'],
        artifactFields: ['file', 'css', 'assets', 'referencedWorkers'],
      },
      referencedWorkers: {
        discovery: 'literal-local-url-in-Worker-or-SharedWorker-constructor',
        ownership: 'manifest-record-file',
        validation: 'target-must-be-an-existing-javascript-artifact',
      },
      additionalToMainEntryInitial: {
        source: 'initialClosure',
        subtract: 'mainEntryInitialClosure',
        differenceBy: {
          manifestRecords: 'manifest-key',
          artifacts: 'dist-path',
        },
      },
    },
    identityDefinition: {
      manifestId: 'source-path-or-normalized-generated-name-plus-output-sha256',
      artifactIdentity: 'normalized-dist-path-plus-content-sha256',
      closureMembershipDigest: 'sha256-of-json-encoded-sorted-identity-list',
    },
    totals: {
      recordCount: records.length,
      entryPointCount: entryRecords.length,
      entryCount: records.filter(record => record.isEntry).length,
      dynamicEntryCount: records.filter(record => record.isDynamicEntry).length,
      importEdgeCount: staticImportEdgeCount + dynamicImportEdgeCount,
      staticImportEdgeCount,
      dynamicImportEdgeCount,
      workerArtifactCount: workerArtifacts.entries.length,
      workerOwnershipEdgeCount: workerArtifacts.ownershipEdgeCount,
    },
    artifacts: {
      totals: summarize(artifactRecords),
      byExtension: summarizeByExtension(artifactRecords),
    },
    mainEntryInitialClosure: summarizeManifestClosure(
      mainEntryInitialRecords,
      mainEntryInitialArtifacts,
      recordsByActualPath,
      actualWorkerArtifactPaths,
    ),
    workerArtifacts,
    entryPoints: entryRecords
      .map((record) => {
        const initialClosureRecords = collectManifestRecordClosure(
          record.key,
          recordsByKey,
          ['imports'],
        );
        const reachableClosureRecords = collectManifestRecordClosure(
          record.key,
          recordsByKey,
          ['imports', 'dynamicImports'],
        );
        const initialClosureArtifacts = manifestArtifactRecords(
          initialClosureRecords,
          recordsByActualPath,
          workerArtifactPathsByRecordKey,
        );
        const reachableClosureArtifacts = manifestArtifactRecords(
          reachableClosureRecords,
          recordsByActualPath,
          workerArtifactPathsByRecordKey,
        );
        const additionalRecords = initialClosureRecords.filter(
          closureRecord => !mainEntryInitialRecordKeys.has(closureRecord.key),
        );
        const additionalArtifacts = initialClosureArtifacts.filter(
          artifact => !mainEntryInitialArtifactPaths.has(artifact.actualPath),
        );

        return {
          id: normalizeHashedPath(record.key),
          manifestId: manifestRecordIdentity(record, recordsByActualPath),
          file: normalizeHashedPath(artifactPathFromUrl(record.file)),
          isEntry: record.isEntry,
          isDynamicEntry: record.isDynamicEntry,
          initialClosure: summarizeManifestClosure(
            initialClosureRecords,
            initialClosureArtifacts,
            recordsByActualPath,
            actualWorkerArtifactPaths,
          ),
          reachableClosure: summarizeManifestClosure(
            reachableClosureRecords,
            reachableClosureArtifacts,
            recordsByActualPath,
            actualWorkerArtifactPaths,
          ),
          ...(record.isDynamicEntry
            ? {
                additionalToMainEntryInitial: summarizeManifestClosure(
                  additionalRecords,
                  additionalArtifacts,
                  recordsByActualPath,
                  actualWorkerArtifactPaths,
                ),
              }
            : {}),
        };
      })
      .sort((left, right) => compareText(left.id, right.id) || compareText(left.file, right.file)),
  };
}

function ensurePositiveInteger(value, label) {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new TypeError(`${label} must be a positive integer`);
  }
}

export async function collectBuildStats({
  distDirectory = DEFAULT_DIST_DIRECTORY,
  largestAssetCount = DEFAULT_LARGEST_ASSET_COUNT,
} = {}) {
  ensurePositiveInteger(largestAssetCount, 'largestAssetCount');

  const absoluteDistDirectory = resolve(distDirectory);
  const distInfo = await stat(absoluteDistDirectory).catch(() => null);

  if (!distInfo?.isDirectory()) {
    throw new Error(`Build output directory does not exist: ${absoluteDistDirectory}`);
  }

  const fileRecords = await collectFileRecords(absoluteDistDirectory);
  const recordsByActualPath = new Map(fileRecords.map(record => [record.actualPath, record]));
  const indexRecord = recordsByActualPath.get('index.html');
  const serviceWorkerRecord = recordsByActualPath.get('sw.js');
  const viteManifest = VITE_MANIFEST_CANDIDATES.find(candidate => recordsByActualPath.has(candidate));

  if (!indexRecord) {
    throw new Error('Build output is missing index.html');
  }

  if (!serviceWorkerRecord) {
    throw new Error('Build output is missing the generated Workbox sw.js');
  }

  if (!viteManifest) {
    throw new Error(
      `Build output is missing the Vite manifest (${VITE_MANIFEST_CANDIDATES.join(' or ')})`,
    );
  }

  const html = await readFile(resolve(absoluteDistDirectory, 'index.html'), 'utf8');
  const shellReferenceKinds = new Map();

  for (const reference of extractShellReferences(html)) {
    const actualPath = knownArtifactPathFromUrl(
      reference.url,
      recordsByActualPath,
      { allowExternal: true },
    );

    if (!actualPath) {
      continue;
    }

    if (!recordsByActualPath.has(actualPath)) {
      throw new Error(`index.html references a missing shell asset: ${actualPath}`);
    }

    const kinds = shellReferenceKinds.get(actualPath) ?? new Set();
    kinds.add(reference.kind);
    shellReferenceKinds.set(actualPath, kinds);
  }

  const shellRecords = [...shellReferenceKinds]
    .map(([actualPath, kinds]) => ({
      ...recordsByActualPath.get(actualPath),
      references: [...kinds].sort(compareText),
    }))
    .sort(compareReportRecords);

  const serviceWorkerSource = await readFile(resolve(absoluteDistDirectory, 'sw.js'), 'utf8');
  const viteManifestSource = await readFile(resolve(absoluteDistDirectory, viteManifest), 'utf8');
  const viteManifestStats = analyzeViteManifest(
    viteManifestSource,
    viteManifest,
    recordsByActualPath,
  );
  const precacheUrls = extractWorkboxPrecacheUrls(serviceWorkerSource);
  const seenPrecachePaths = new Set();
  const precacheRecords = precacheUrls
    .map((url) => {
      const actualPath = artifactPathFromUrl(url);

      if (seenPrecachePaths.has(actualPath)) {
        throw new Error(`Workbox precache contains a duplicate URL: ${actualPath}`);
      }
      seenPrecachePaths.add(actualPath);

      const record = recordsByActualPath.get(actualPath);
      if (!record) {
        throw new Error(`Workbox precache references a missing artifact: ${actualPath}`);
      }

      return record;
    })
    .sort(compareReportRecords);

  const assetRecords = fileRecords
    .filter(record => record.actualPath.startsWith('assets/'))
    .sort(compareReportRecords);
  const largestAssets = [...assetRecords]
    .sort(
      (left, right) =>
        right.rawBytes - left.rawBytes || right.gzipBytes - left.gzipBytes || compareReportRecords(left, right),
    )
    .slice(0, largestAssetCount)
    .map(toReportRecord);
  const shellWithDocument = [indexRecord, ...shellRecords];

  return {
    schema: BUILD_STATS_SCHEMA,
    compression: {
      format: 'gzip',
      level: zlibConstants.Z_BEST_COMPRESSION,
      scope: 'each-file',
    },
    artifactInputs: {
      viteManifest,
      workboxServiceWorker: 'sw.js',
    },
    files: {
      totals: summarize(fileRecords),
      byExtension: summarizeByExtension(fileRecords),
    },
    assets: {
      totals: summarize(assetRecords),
      byExtension: summarizeByExtension(assetRecords),
    },
    shell: {
      document: toReportRecord(indexRecord),
      assets: shellRecords.map(record => ({
        path: record.path,
        references: record.references,
        rawBytes: record.rawBytes,
        gzipBytes: record.gzipBytes,
      })),
      assetTotals: summarize(shellRecords),
      withDocumentTotals: summarize(shellWithDocument),
    },
    workboxPrecache: {
      totals: summarize(precacheRecords),
      byExtension: summarizeByExtension(precacheRecords),
      entries: precacheRecords.map(toReportRecord),
    },
    viteManifest: viteManifestStats,
    largestAssets,
  };
}

export function serializeBuildStats(stats) {
  return `${JSON.stringify(stats, null, 2)}\n`;
}

const GLOBAL_BUDGET_METRICS = Object.freeze({
  'shell.withDocument.rawBytes': stats => stats.shell.withDocumentTotals.rawBytes,
  'shell.withDocument.gzipBytes': stats => stats.shell.withDocumentTotals.gzipBytes,
  'workbox.fileCount': stats => stats.workboxPrecache.totals.fileCount,
  'workbox.rawBytes': stats => stats.workboxPrecache.totals.rawBytes,
  'workbox.gzipBytes': stats => stats.workboxPrecache.totals.gzipBytes,
});

const ROUTE_BUDGET_METRICS = ['rawBytes', 'gzipBytes'];

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validateMaximum(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new TypeError(`${label} must be a non-negative safe integer`);
  }
}

function validateRouteLimits(limits, label) {
  if (!isPlainObject(limits)) {
    throw new TypeError(`${label} must be an object`);
  }

  for (const metric of ROUTE_BUDGET_METRICS) {
    validateMaximum(limits[metric], `${label}.${metric}`);
  }

  const unknownMetrics = Object.keys(limits)
    .filter(metric => !ROUTE_BUDGET_METRICS.includes(metric) && metric !== 'rationale');
  if (unknownMetrics.length > 0) {
    throw new TypeError(`${label} contains unknown metrics: ${unknownMetrics.join(', ')}`);
  }
}

export function parseBuildBudgets(source, label = 'build budgets') {
  let budgets;

  try {
    budgets = typeof source === 'string' ? JSON.parse(source) : source;
  }
  catch (error) {
    throw new Error(`Unable to parse ${label}: ${error.message}`);
  }

  if (!isPlainObject(budgets)) {
    throw new TypeError(`${label} must contain a JSON object`);
  }

  if (
    budgets.schema?.id !== BUILD_BUDGETS_SCHEMA.id
    || budgets.schema?.version !== BUILD_BUDGETS_SCHEMA.version
  ) {
    throw new Error(
      `${label} must use ${BUILD_BUDGETS_SCHEMA.id} schema version ${BUILD_BUDGETS_SCHEMA.version}`,
    );
  }

  if (!isPlainObject(budgets.globalLimits)) {
    throw new TypeError(`${label}.globalLimits must be an object`);
  }

  const requiredWorkboxEntries = budgets.requiredWorkboxEntries ?? [];
  if (
    !Array.isArray(requiredWorkboxEntries)
    || requiredWorkboxEntries.some(entry => typeof entry !== 'string' || !entry.trim())
    || new Set(requiredWorkboxEntries).size !== requiredWorkboxEntries.length
  ) {
    throw new TypeError(`${label}.requiredWorkboxEntries must be an array of unique non-empty paths`);
  }

  for (const [metric, maximum] of Object.entries(budgets.globalLimits)) {
    if (!(metric in GLOBAL_BUDGET_METRICS)) {
      throw new TypeError(`${label}.globalLimits contains unknown metric: ${metric}`);
    }
    validateMaximum(maximum, `${label}.globalLimits.${metric}`);
  }

  if (!isPlainObject(budgets.dynamicEntryLimits)) {
    throw new TypeError(`${label}.dynamicEntryLimits must be an object`);
  }

  validateRouteLimits(budgets.dynamicEntryLimits.defaults, `${label}.dynamicEntryLimits.defaults`);

  const overrides = budgets.dynamicEntryLimits.overrides;
  if (!isPlainObject(overrides)) {
    throw new TypeError(`${label}.dynamicEntryLimits.overrides must be an object`);
  }

  for (const [entryId, limits] of Object.entries(overrides)) {
    if (!entryId) {
      throw new TypeError(`${label}.dynamicEntryLimits.overrides contains an empty entry id`);
    }
    validateRouteLimits(limits, `${label}.dynamicEntryLimits.overrides.${entryId}`);
    if (typeof limits.rationale !== 'string' || !limits.rationale.trim()) {
      throw new TypeError(
        `${label}.dynamicEntryLimits.overrides.${entryId}.rationale must explain the exception`,
      );
    }
  }

  const workerAssetLimits = budgets.workerAssetLimits ?? {};
  if (!isPlainObject(workerAssetLimits)) {
    throw new TypeError(`${label}.workerAssetLimits must be an object`);
  }
  for (const [workerPath, limits] of Object.entries(workerAssetLimits)) {
    if (!workerPath) {
      throw new TypeError(`${label}.workerAssetLimits contains an empty worker path`);
    }
    validateRouteLimits(limits, `${label}.workerAssetLimits.${workerPath}`);
    if (typeof limits.rationale !== 'string' || !limits.rationale.trim()) {
      throw new TypeError(
        `${label}.workerAssetLimits.${workerPath}.rationale must explain the reviewed worker ceiling`,
      );
    }
  }

  return { ...budgets, requiredWorkboxEntries, workerAssetLimits };
}

function addBudgetCheck(checks, name, actual, maximum) {
  checks.push({
    name,
    actual,
    maximum,
    passed: actual <= maximum,
  });
}

function addPresenceCheck(checks, name, present) {
  checks.push({
    name,
    actual: present ? 'present' : 'missing',
    expected: 'present',
    passed: present,
  });
}

export function evaluateBuildBudgets(stats, budgets) {
  if (
    stats.schema?.id !== BUILD_STATS_SCHEMA.id
    || stats.schema?.version !== BUILD_STATS_SCHEMA.version
  ) {
    throw new Error(
      `Build statistics must use ${BUILD_STATS_SCHEMA.id} schema version ${BUILD_STATS_SCHEMA.version}`,
    );
  }

  const checks = [];

  for (const [metric, maximum] of Object.entries(budgets.globalLimits)) {
    addBudgetCheck(checks, metric, GLOBAL_BUDGET_METRICS[metric](stats), maximum);
  }

  const workboxEntryPaths = new Set(stats.workboxPrecache.entries.map(entry => entry.path));
  const shellEntryPaths = [stats.shell.document.path, ...stats.shell.assets.map(entry => entry.path)];

  for (const entryPath of shellEntryPaths) {
    addPresenceCheck(
      checks,
      `workbox.shellEntry:${entryPath}`,
      workboxEntryPaths.has(entryPath),
    );
  }

  for (const entryPath of budgets.requiredWorkboxEntries) {
    addPresenceCheck(
      checks,
      `workbox.requiredEntry:${entryPath}`,
      workboxEntryPaths.has(entryPath),
    );
  }

  const dynamicEntries = stats.viteManifest.entryPoints
    .filter(entry => entry.isDynamicEntry && entry.additionalToMainEntryInitial);
  const dynamicEntriesById = new Map(dynamicEntries.map(entry => [entry.id, entry]));

  for (const entryId of Object.keys(budgets.dynamicEntryLimits.overrides)) {
    if (!dynamicEntriesById.has(entryId)) {
      throw new Error(`Build budget override references a missing dynamic entry: ${entryId}`);
    }
  }

  for (const entry of dynamicEntries) {
    const limits = budgets.dynamicEntryLimits.overrides[entry.id]
      ?? budgets.dynamicEntryLimits.defaults;

    for (const metric of ROUTE_BUDGET_METRICS) {
      addBudgetCheck(
        checks,
        `dynamicEntry:${entry.id}.additionalToMainEntryInitial.${metric}`,
        entry.additionalToMainEntryInitial[metric],
        limits[metric],
      );
    }
  }

  const workerAssetsByPath = new Map(
    stats.viteManifest.workerArtifacts.entries.map(worker => [worker.path, worker]),
  );
  for (const [workerPath, limits] of Object.entries(budgets.workerAssetLimits ?? {})) {
    const worker = workerAssetsByPath.get(workerPath);
    if (!worker) {
      throw new Error(`Build budget references a missing worker asset: ${workerPath}`);
    }
    for (const metric of ROUTE_BUDGET_METRICS) {
      addBudgetCheck(
        checks,
        `workerAsset:${workerPath}.${metric}`,
        worker[metric],
        limits[metric],
      );
    }
  }

  return {
    passed: checks.every(check => check.passed),
    checks,
    failures: checks.filter(check => !check.passed),
  };
}

function formatBudgetFailures(failures) {
  return failures
    .map(({ name, actual, maximum, expected }) => (
      expected === undefined
        ? `  - ${name}: ${actual} > ${maximum}`
        : `  - ${name}: ${actual}; expected ${expected}`
    ))
    .join('\n');
}

function usage() {
  return [
    'Usage: node scripts/build-stats.mjs [options]',
    '',
    'Options:',
    '  --dist <directory>  Existing build output (default: dist)',
    '  --output <file>     Write JSON to a file instead of stdout',
    '  --budgets <file>    Fail when the artifact exceeds reviewed build budgets',
    '  --top <count>       Number of largest assets (default: 20)',
    '  --help              Show this help',
  ].join('\n');
}

function takeOptionValue(args, index, option) {
  const value = args[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(`${option} requires a value`);
  }
  return value;
}

export function parseArguments(args) {
  const options = {
    distDirectory: DEFAULT_DIST_DIRECTORY,
    largestAssetCount: DEFAULT_LARGEST_ASSET_COUNT,
    outputFile: null,
    budgetsFile: null,
    help: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === '--help') {
      options.help = true;
    }
    else if (argument === '--dist') {
      options.distDirectory = takeOptionValue(args, index, argument);
      index += 1;
    }
    else if (argument === '--output') {
      options.outputFile = takeOptionValue(args, index, argument);
      index += 1;
    }
    else if (argument === '--budgets') {
      options.budgetsFile = takeOptionValue(args, index, argument);
      index += 1;
    }
    else if (argument === '--top') {
      options.largestAssetCount = Number(takeOptionValue(args, index, argument));
      index += 1;
    }
    else {
      throw new Error(`Unknown option: ${argument}`);
    }
  }

  ensurePositiveInteger(options.largestAssetCount, '--top');
  return options;
}

export async function main(args = process.argv.slice(2)) {
  const options = parseArguments(args);

  if (options.help) {
    process.stdout.write(`${usage()}\n`);
    return;
  }

  const stats = await collectBuildStats(options);
  const serialized = serializeBuildStats(stats);

  if (options.budgetsFile) {
    const budgetsPath = resolve(options.budgetsFile);
    const budgets = parseBuildBudgets(await readFile(budgetsPath, 'utf8'), budgetsPath);
    const evaluation = evaluateBuildBudgets(stats, budgets);

    if (!evaluation.passed) {
      throw new Error(`Build budgets exceeded:\n${formatBudgetFailures(evaluation.failures)}`);
    }

    process.stderr.write(`build-stats: ${evaluation.checks.length} build budget checks passed\n`);
  }

  if (options.outputFile) {
    const outputFile = resolve(options.outputFile);
    await mkdir(dirname(outputFile), { recursive: true });
    await writeFile(outputFile, serialized, 'utf8');
    return;
  }

  process.stdout.write(serialized);
}

const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMainModule) {
  main().catch((error) => {
    process.stderr.write(`build-stats: ${error.message}\n`);
    process.exitCode = 1;
  });
}
