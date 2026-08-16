import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { mkdir, mkdtemp, rename, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import {
  BUILD_BUDGETS_SCHEMA,
  BUILD_STATS_SCHEMA,
  collectBuildStats,
  evaluateBuildBudgets,
  parseArguments,
  parseBuildBudgets,
  serializeBuildStats,
} from './build-stats.mjs';

const LAZY_WORKER_PATH = 'assets/lazy.worker-44556677.js';
const NESTED_WORKER_PATH = 'assets/nested.worker-77889900.js';
const UNRELATED_WORKER_PATH = 'assets/unrelated.worker-99aabbcc.js';

async function createFixture(t, { basePath = '/' } = {}) {
  const fixtureRoot = await mkdtemp(join(tmpdir(), 'it-tools-build-stats-'));
  const distDirectory = join(fixtureRoot, 'dist');
  const assetsDirectory = join(distDirectory, 'assets');
  const normalizedBasePath = basePath.endsWith('/') ? basePath : `${basePath}/`;

  t.after(async () => {
    await rm(fixtureRoot, { recursive: true, force: true });
  });

  await mkdir(assetsDirectory, { recursive: true });
  const viteManifest = {
    '_shared-feedface.js': {
      file: 'assets/shared-feedface.js',
      assets: ['assets/icon.png'],
    },
    'src/lazy.ts': {
      file: 'assets/lazy-00112233.js',
      src: 'src/lazy.ts',
      isDynamicEntry: true,
      imports: ['_shared-feedface.js'],
      dynamicImports: ['src/nested.ts'],
    },
    'src/main.ts': {
      file: 'assets/index-deadbeef.js',
      src: 'src/main.ts',
      isEntry: true,
      imports: ['_shared-feedface.js'],
      dynamicImports: ['src/lazy.ts'],
      css: ['assets/index-cafebabe.css'],
    },
    'src/nested.ts': {
      file: 'assets/index-aabbccdd.js',
      src: 'src/nested.ts',
      isDynamicEntry: true,
    },
  };
  await Promise.all([
    writeFile(
      join(distDirectory, 'index.html'),
      `<!doctype html>
<html>
  <head>
    <link rel="stylesheet" href="${normalizedBasePath}assets/index-cafebabe.css">
    <link rel="icon" href="${normalizedBasePath}assets/icon.png">
    <script src="https://example.test/external.js"></script>
  </head>
  <body>
    <script type="module" src="${normalizedBasePath}assets/index-deadbeef.js"></script>
  </body>
</html>
`,
    ),
    writeFile(join(assetsDirectory, 'index-deadbeef.js'), 'console.log("fixture");\n'),
    writeFile(join(assetsDirectory, 'index-cafebabe.css'), 'body { color: rebeccapurple; }\n'),
    writeFile(
      join(assetsDirectory, 'lazy-00112233.js'),
      `export const lazy = () => new Worker(new URL("${normalizedBasePath}${LAZY_WORKER_PATH}", self.location), { type: "module" });\n`,
    ),
    writeFile(
      join(assetsDirectory, 'index-aabbccdd.js'),
      `export const nested = () => new SharedWorker("${normalizedBasePath}${NESTED_WORKER_PATH}");\n`,
    ),
    writeFile(join(assetsDirectory, 'shared-feedface.js'), 'export const shared = true;\n'),
    writeFile(join(distDirectory, LAZY_WORKER_PATH), 'self.postMessage("lazy worker");\n'),
    writeFile(join(distDirectory, NESTED_WORKER_PATH), 'self.postMessage("nested worker");\n'),
    writeFile(join(distDirectory, UNRELATED_WORKER_PATH), 'self.postMessage("unrelated");\n'),
    writeFile(join(assetsDirectory, 'icon.png'), Buffer.from([0x89, 0x50, 0x4E, 0x47])),
    writeFile(join(distDirectory, 'manifest.json'), `${JSON.stringify(viteManifest, null, 2)}\n`),
    writeFile(
      join(distDirectory, 'sw.js'),
      `self.precacheAndRoute([
  {url:"assets/index-deadbeef.js",revision:null},
  {url:"assets/index-cafebabe.css",revision:null},
  {url:"assets/icon.png?bracket=]",revision:"abcdef0123456789"},
  {url:"index.html",revision:"0123456789abcdef"}
], {});\n`,
    ),
  ]);

  return distDirectory;
}

test('collectBuildStats emits deterministic, hash-normalized artifact metrics', async (t) => {
  const distDirectory = await createFixture(t);
  const first = await collectBuildStats({ distDirectory, largestAssetCount: 2 });
  const second = await collectBuildStats({ distDirectory, largestAssetCount: 2 });

  assert.deepEqual(first, second);
  assert.deepEqual(first.schema, BUILD_STATS_SCHEMA);
  assert.deepEqual(first.artifactInputs, {
    viteManifest: 'manifest.json',
    workboxServiceWorker: 'sw.js',
  });
  assert.equal(first.files.totals.fileCount, 12);
  assert.equal(first.assets.totals.fileCount, 9);
  assert.equal(first.shell.assetTotals.fileCount, 2);
  assert.equal(first.shell.withDocumentTotals.fileCount, 3);
  assert.deepEqual(
    first.shell.assets.map(asset => asset.path),
    ['assets/index-<hash>.css', 'assets/index-<hash>.js'],
  );
  assert.equal(first.workboxPrecache.totals.fileCount, 4);
  assert.equal(
    first.workboxPrecache.entries.some(entry => entry.path === 'assets/icon.png'),
    true,
  );
  assert.equal(first.largestAssets.length, 2);
  assert.deepEqual(first.viteManifest.totals, {
    recordCount: 4,
    entryPointCount: 3,
    entryCount: 1,
    dynamicEntryCount: 2,
    importEdgeCount: 4,
    staticImportEdgeCount: 2,
    dynamicImportEdgeCount: 2,
    workerArtifactCount: 2,
    workerOwnershipEdgeCount: 2,
  });
  assert.deepEqual(first.viteManifest.closureDefinitions, {
    initialClosure: {
      importFields: ['imports'],
      artifactFields: ['file', 'css', 'assets', 'referencedWorkers'],
    },
    mandatoryAsyncShellSources: [
      'src/layouts/base.layout.vue',
      'src/modules/pwa/OfflineRouteUnavailable.vue',
      'src/pages/Home.page.vue',
    ],
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
  });
  assert.deepEqual(first.viteManifest.identityDefinition, {
    manifestId: 'source-path-or-normalized-generated-name-plus-output-sha256',
    artifactIdentity: 'normalized-dist-path-plus-content-sha256',
    closureMembershipDigest: 'sha256-of-json-encoded-sorted-identity-list',
  });
  assert.equal(first.viteManifest.artifacts.totals.fileCount, 8);
  assert.deepEqual(
    first.viteManifest.workerArtifacts.entries.map(entry => ({
      path: entry.path,
      owners: entry.owners,
    })),
    [
      {
        path: 'assets/lazy.worker-<hash>.js',
        owners: [{
          file: 'assets/lazy-<hash>.js',
          manifestId: 'source:src/lazy.ts',
        }],
      },
      {
        path: 'assets/nested.worker-<hash>.js',
        owners: [{
          file: 'assets/index-<hash>.js',
          manifestId: 'source:src/nested.ts',
        }],
      },
    ],
  );
  assert.equal(
    first.viteManifest.workerArtifacts.entries.some(entry => (
      entry.path === 'assets/unrelated.worker-<hash>.js'
    )),
    false,
  );
  assert.deepEqual(
    first.viteManifest.entryPoints.map(entry => ({
      id: entry.id,
      file: entry.file,
      initialFileCount: entry.initialClosure.fileCount,
      initialRecordCount: entry.initialClosure.manifestRecordCount,
      reachableFileCount: entry.reachableClosure.fileCount,
      reachableRecordCount: entry.reachableClosure.manifestRecordCount,
      initialWorkerCount: entry.initialClosure.workerArtifactCount,
      reachableWorkerCount: entry.reachableClosure.workerArtifactCount,
    })),
    [
      {
        id: 'src/lazy.ts',
        file: 'assets/lazy-<hash>.js',
        initialFileCount: 4,
        initialRecordCount: 2,
        reachableFileCount: 6,
        reachableRecordCount: 3,
        initialWorkerCount: 1,
        reachableWorkerCount: 2,
      },
      {
        id: 'src/main.ts',
        file: 'assets/index-<hash>.js',
        initialFileCount: 4,
        initialRecordCount: 2,
        reachableFileCount: 8,
        reachableRecordCount: 4,
        initialWorkerCount: 0,
        reachableWorkerCount: 2,
      },
      {
        id: 'src/nested.ts',
        file: 'assets/index-<hash>.js',
        initialFileCount: 2,
        initialRecordCount: 1,
        reachableFileCount: 2,
        reachableRecordCount: 1,
        initialWorkerCount: 1,
        reachableWorkerCount: 1,
      },
    ],
  );
  const mainEntry = first.viteManifest.entryPoints.find(entry => entry.id === 'src/main.ts');
  assert.equal(mainEntry.reachableClosure.rawBytes, first.viteManifest.artifacts.totals.rawBytes);
  assert.equal(mainEntry.reachableClosure.gzipBytes, first.viteManifest.artifacts.totals.gzipBytes);
  assert.ok(mainEntry.initialClosure.rawBytes < mainEntry.reachableClosure.rawBytes);
  assert.ok(mainEntry.initialClosure.gzipBytes < mainEntry.reachableClosure.gzipBytes);
  assert.deepEqual(first.viteManifest.mainEntryInitialClosure, mainEntry.initialClosure);
  assert.equal('additionalToMainEntryInitial' in mainEntry, false);

  const lazyEntry = first.viteManifest.entryPoints.find(entry => entry.id === 'src/lazy.ts');
  assert.deepEqual(
    {
      manifestRecordCount: lazyEntry.additionalToMainEntryInitial.manifestRecordCount,
      fileCount: lazyEntry.additionalToMainEntryInitial.fileCount,
    },
    { manifestRecordCount: 1, fileCount: 2 },
  );
  assert.match(
    lazyEntry.additionalToMainEntryInitial.membershipDigests.manifestIdsSha256,
    /^[a-f\d]{64}$/,
  );
  assert.match(
    lazyEntry.additionalToMainEntryInitial.membershipDigests.artifactIdentitiesSha256,
    /^[a-f\d]{64}$/,
  );
  assert.equal(
    lazyEntry.additionalToMainEntryInitial.rawBytes,
    Buffer.byteLength(`export const lazy = () => new Worker(new URL("/${LAZY_WORKER_PATH}", self.location), { type: "module" });\n`)
      + Buffer.byteLength('self.postMessage("lazy worker");\n'),
  );

  const nestedEntry = first.viteManifest.entryPoints.find(entry => entry.id === 'src/nested.ts');
  assert.equal(nestedEntry.additionalToMainEntryInitial.fileCount, 2);
  assert.notEqual(
    nestedEntry.additionalToMainEntryInitial.membershipDigests.artifactIdentitiesSha256,
    lazyEntry.additionalToMainEntryInitial.membershipDigests.artifactIdentitiesSha256,
  );

  assert.match(mainEntry.reachableClosure.membershipDigests.manifestIdsSha256, /^[a-f\d]{64}$/);
  assert.match(
    mainEntry.reachableClosure.membershipDigests.artifactIdentitiesSha256,
    /^[a-f\d]{64}$/,
  );

  const serialized = serializeBuildStats(first);
  assert.doesNotMatch(
    serialized,
    /deadbeef|cafebabe|00112233|44556677|77889900|99aabbcc|abcdef0123456789|0123456789abcdef/,
  );
  assert.match(serialized, /assets\/index-<hash>\.js/);
  assert.ok(serialized.length < 30_000);
  assert.equal(serialized.endsWith('\n'), true);
});

test('collectBuildStats rejects a missing Workbox artifact', async (t) => {
  const distDirectory = await createFixture(t);
  await writeFile(join(distDirectory, 'sw.js'), 'self.precacheAndRoute([{"url":"missing.js","revision":null}], {});\n');

  await assert.rejects(
    collectBuildStats({ distDirectory }),
    /Workbox precache references a missing artifact: missing\.js/,
  );
});

test('collectBuildStats accepts the newer nested Vite manifest location', async (t) => {
  const distDirectory = await createFixture(t);
  const nestedManifestDirectory = join(distDirectory, '.vite');
  await mkdir(nestedManifestDirectory);
  await rename(
    join(distDirectory, 'manifest.json'),
    join(nestedManifestDirectory, 'manifest.json'),
  );

  const stats = await collectBuildStats({ distDirectory });

  assert.equal(stats.artifactInputs.viteManifest, '.vite/manifest.json');
  assert.equal(stats.viteManifest.totals.entryPointCount, 3);
});

test('collectBuildStats resolves shell references below a non-root Vite base', async (t) => {
  const distDirectory = await createFixture(t, { basePath: '/internal/it-tools/' });

  const stats = await collectBuildStats({ distDirectory });

  assert.deepEqual(
    stats.shell.assets.map(asset => asset.path),
    ['assets/index-<hash>.css', 'assets/index-<hash>.js'],
  );
  assert.equal(stats.shell.assetTotals.fileCount, 2);
  const lazyEntry = stats.viteManifest.entryPoints.find(entry => entry.id === 'src/lazy.ts');
  assert.equal(lazyEntry.initialClosure.workerArtifactCount, 1);
  assert.equal(lazyEntry.additionalToMainEntryInitial.fileCount, 2);
});

test('collectBuildStats resolves a worker URL relative to its owning JavaScript artifact', async (t) => {
  const distDirectory = await createFixture(t);
  await writeFile(
    join(distDirectory, 'assets/lazy-00112233.js'),
    'export const lazy = () => new Worker(new URL("./lazy.worker-44556677.js", import.meta.url));\n',
  );

  const stats = await collectBuildStats({ distDirectory });
  const lazyEntry = stats.viteManifest.entryPoints.find(entry => entry.id === 'src/lazy.ts');

  assert.equal(lazyEntry.initialClosure.workerArtifactCount, 1);
  assert.equal(lazyEntry.additionalToMainEntryInitial.fileCount, 2);
  assert.deepEqual(
    stats.viteManifest.workerArtifacts.entries[0].owners,
    [{ file: 'assets/lazy-<hash>.js', manifestId: 'source:src/lazy.ts' }],
  );
});

test('collectBuildStats gives owned workers normalized content-sensitive closure identities', async (t) => {
  const distDirectory = await createFixture(t);
  const before = await collectBuildStats({ distDirectory });
  const beforeLazy = before.viteManifest.entryPoints.find(entry => entry.id === 'src/lazy.ts');

  await writeFile(
    join(distDirectory, LAZY_WORKER_PATH),
    'self.postMessage("updated lazy worker payload");\n',
  );

  const after = await collectBuildStats({ distDirectory });
  const afterLazy = after.viteManifest.entryPoints.find(entry => entry.id === 'src/lazy.ts');

  assert.equal(
    beforeLazy.initialClosure.membershipDigests.manifestIdsSha256,
    afterLazy.initialClosure.membershipDigests.manifestIdsSha256,
  );
  assert.notEqual(
    beforeLazy.initialClosure.membershipDigests.artifactIdentitiesSha256,
    afterLazy.initialClosure.membershipDigests.artifactIdentitiesSha256,
  );
  assert.equal(after.viteManifest.workerArtifacts.entries[0].path, 'assets/lazy.worker-<hash>.js');
  assert.ok(afterLazy.initialClosure.rawBytes > beforeLazy.initialClosure.rawBytes);
});

test('collectBuildStats does not attach an unrelated worker artifact to any route', async (t) => {
  const distDirectory = await createFixture(t);
  const before = await collectBuildStats({ distDirectory });

  await writeFile(
    join(distDirectory, UNRELATED_WORKER_PATH),
    'self.postMessage("a much larger unrelated worker payload that no route owns");\n',
  );

  const after = await collectBuildStats({ distDirectory });

  assert.deepEqual(after.viteManifest, before.viteManifest);
  assert.notEqual(after.assets.totals.rawBytes, before.assets.totals.rawBytes);
});

test('collectBuildStats fails closed for invalid local worker artifact references', async (t) => {
  const distDirectory = await createFixture(t);
  const lazyArtifactPath = join(distDirectory, 'assets/lazy-00112233.js');

  await writeFile(
    lazyArtifactPath,
    'new Worker(new URL("/assets/missing.worker-11223344.js", self.location));\n',
  );
  await assert.rejects(
    collectBuildStats({ distDirectory }),
    /references a missing worker artifact: assets\/missing\.worker-11223344\.js/,
  );

  await writeFile(lazyArtifactPath, 'new Worker("/assets/icon.png");\n');
  await assert.rejects(
    collectBuildStats({ distDirectory }),
    /references a non-JavaScript worker artifact: assets\/icon\.png/,
  );

  await writeFile(lazyArtifactPath, 'new Worker("/assets/invalid%ZZ.worker.js");\n');
  await assert.rejects(
    collectBuildStats({ distDirectory }),
    /contains an invalid percent-encoded worker URL/,
  );

  await writeFile(lazyArtifactPath, 'new Worker(new URL(`../../outside.worker.js`, import.meta.url));\n');
  await assert.rejects(
    collectBuildStats({ distDirectory }),
    /has a worker URL outside dist/,
  );
});

test('collectBuildStats requires a Vite 4 manifest and validates its graph', async (t) => {
  const distDirectory = await createFixture(t);
  const manifestPath = join(distDirectory, 'manifest.json');
  await rm(manifestPath);

  await assert.rejects(
    collectBuildStats({ distDirectory }),
    /missing the Vite manifest/,
  );

  await writeFile(
    manifestPath,
    JSON.stringify({
      'src/main.ts': {
        file: 'assets/index-deadbeef.js',
        isEntry: true,
        dynamicImports: ['src/missing.ts'],
      },
    }),
  );

  await assert.rejects(
    collectBuildStats({ distDirectory }),
    /imports missing entry "src\/missing\.ts"/,
  );
});

function createBudgets(stats, overrides = {}) {
  const dynamicEntries = stats.viteManifest.entryPoints
    .filter(entry => entry.isDynamicEntry && entry.additionalToMainEntryInitial);
  const maximumRawBytes = Math.max(...dynamicEntries.map(
    entry => entry.additionalToMainEntryInitial.rawBytes,
  ));
  const maximumGzipBytes = Math.max(...dynamicEntries.map(
    entry => entry.additionalToMainEntryInitial.gzipBytes,
  ));

  return parseBuildBudgets({
    schema: BUILD_BUDGETS_SCHEMA,
    globalLimits: {
      'shell.withDocument.rawBytes': stats.shell.withDocumentTotals.rawBytes,
      'shell.withDocument.gzipBytes': stats.shell.withDocumentTotals.gzipBytes,
      'workbox.fileCount': stats.workboxPrecache.totals.fileCount,
    },
    dynamicEntryLimits: {
      defaults: {
        rawBytes: maximumRawBytes,
        gzipBytes: maximumGzipBytes,
      },
      overrides,
    },
  });
}

test('evaluateBuildBudgets accepts an artifact at or below every reviewed ceiling', async (t) => {
  const stats = await collectBuildStats({ distDirectory: await createFixture(t) });
  const budgets = createBudgets(stats);
  const evaluation = evaluateBuildBudgets(stats, budgets);

  assert.equal(evaluation.passed, true);
  assert.equal(evaluation.failures.length, 0);
  assert.ok(evaluation.checks.length > 3);
});

test('evaluateBuildBudgets reports global and per-entry regressions together', async (t) => {
  const stats = await collectBuildStats({ distDirectory: await createFixture(t) });
  const budgets = createBudgets(stats);
  budgets.globalLimits['shell.withDocument.gzipBytes'] = 0;
  budgets.dynamicEntryLimits.defaults = { rawBytes: 0, gzipBytes: 0 };

  const evaluation = evaluateBuildBudgets(stats, budgets);

  assert.equal(evaluation.passed, false);
  assert.ok(evaluation.failures.some(
    failure => failure.name === 'shell.withDocument.gzipBytes',
  ));
  assert.ok(evaluation.failures.some(failure => failure.name.startsWith('dynamicEntry:')));
});

test('evaluateBuildBudgets requires shell and configured static Workbox entries', async (t) => {
  const stats = await collectBuildStats({ distDirectory: await createFixture(t) });
  const budgets = createBudgets(stats);
  budgets.requiredWorkboxEntries = ['manifest.webmanifest'];

  const missingStatic = evaluateBuildBudgets(stats, budgets);
  assert.equal(missingStatic.passed, false);
  assert.ok(missingStatic.failures.some(
    failure => failure.name === 'workbox.requiredEntry:manifest.webmanifest',
  ));

  const withoutShellScript = structuredClone(stats);
  withoutShellScript.workboxPrecache.entries = withoutShellScript.workboxPrecache.entries
    .filter(entry => entry.path !== 'assets/index-<hash>.js');
  const missingShell = evaluateBuildBudgets(withoutShellScript, createBudgets(stats));

  assert.equal(missingShell.passed, false);
  assert.ok(missingShell.failures.some(
    failure => failure.name === 'workbox.shellEntry:assets/index-<hash>.js',
  ));
});

test('build budget configuration is strict and requires rationales for route exceptions', async (t) => {
  const stats = await collectBuildStats({ distDirectory: await createFixture(t) });
  const dynamicEntry = stats.viteManifest.entryPoints.find(entry => entry.isDynamicEntry);
  const budgets = createBudgets(stats, {
    [dynamicEntry.id]: {
      rawBytes: dynamicEntry.additionalToMainEntryInitial.rawBytes,
      gzipBytes: dynamicEntry.additionalToMainEntryInitial.gzipBytes,
      rationale: 'Fixture exception',
    },
  });

  assert.equal(evaluateBuildBudgets(stats, budgets).passed, true);
  assert.throws(
    () => parseBuildBudgets({
      ...budgets,
      dynamicEntryLimits: {
        ...budgets.dynamicEntryLimits,
        overrides: {
          [dynamicEntry.id]: { rawBytes: 1, gzipBytes: 1 },
        },
      },
    }),
    /rationale/,
  );
  assert.throws(
    () => parseBuildBudgets({ ...budgets, requiredWorkboxEntries: ['index.html', 'index.html'] }),
    /unique non-empty paths/,
  );
});

test('evaluateBuildBudgets rejects stale dynamic-entry overrides', async (t) => {
  const stats = await collectBuildStats({ distDirectory: await createFixture(t) });
  const budgets = createBudgets(stats, {
    'src/removed-tool.vue': {
      rawBytes: 1,
      gzipBytes: 1,
      rationale: 'Intentional test fixture',
    },
  });

  assert.throws(
    () => evaluateBuildBudgets(stats, budgets),
    /missing dynamic entry: src\/removed-tool\.vue/,
  );
});

test('worker asset budgets require rationale, enforce size, and reject stale paths', async (t) => {
  const stats = await collectBuildStats({ distDirectory: await createFixture(t) });
  const worker = stats.viteManifest.workerArtifacts.entries[0];
  assert.ok(worker);
  const baseBudgets = createBudgets(stats);
  const budgets = parseBuildBudgets({
    ...baseBudgets,
    workerAssetLimits: {
      [worker.path]: {
        rawBytes: worker.rawBytes,
        gzipBytes: worker.gzipBytes,
        rationale: 'Reviewed fixture worker ceiling',
      },
    },
  });

  const accepted = evaluateBuildBudgets(stats, budgets);
  assert.equal(accepted.passed, true);
  assert.ok(accepted.checks.some(check => check.name === `workerAsset:${worker.path}.rawBytes`));

  budgets.workerAssetLimits[worker.path].gzipBytes = 0;
  assert.ok(evaluateBuildBudgets(stats, budgets).failures.some(
    failure => failure.name === `workerAsset:${worker.path}.gzipBytes`,
  ));
  assert.throws(
    () => parseBuildBudgets({
      ...baseBudgets,
      workerAssetLimits: { [worker.path]: { rawBytes: 1, gzipBytes: 1 } },
    }),
    /rationale/,
  );
  assert.throws(
    () => evaluateBuildBudgets(stats, parseBuildBudgets({
      ...baseBudgets,
      workerAssetLimits: {
        'assets/removed.worker-<hash>.js': {
          rawBytes: 1,
          gzipBytes: 1,
          rationale: 'Intentional stale fixture',
        },
      },
    })),
    /missing worker asset/,
  );
});

test('parseArguments accepts a build-budget file', () => {
  assert.deepEqual(
    parseArguments(['--dist', 'build', '--budgets', 'budgets.json', '--output', 'stats.json']),
    {
      distDirectory: 'build',
      largestAssetCount: 20,
      outputFile: 'stats.json',
      budgetsFile: 'budgets.json',
      help: false,
    },
  );
});
