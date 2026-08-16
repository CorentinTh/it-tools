import { readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import process from 'node:process';

import { build as bundleWithEsbuild } from 'esbuild';
import { build as buildWithVite } from 'vite';
import { generateStandaloneToolRegistry } from './standalone-build-config.mjs';
import { inlineStandaloneBundle } from './standalone-build-plugin.mjs';

const MAX_STANDALONE_BYTES = 10 * 1024 * 1024;
const outputDirectory = resolve('dist-standalone');
const intermediateDirectory = resolve(outputDirectory, '.intermediate');
const outputFileName = 'it-tools.html';

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  }));
  return files.flat();
}

function normalizePath(path) {
  return path.replaceAll('\\', '/');
}

function findEntryFileName(html) {
  const matches = [...html.matchAll(/<script\b[^>]*\bsrc=["'](?:\.\/)?([^"']+)["'][^>]*><\/script>/gi)];
  if (matches.length !== 1) {
    throw new Error(`Standalone intermediate HTML requires one entry script; found ${matches.length}`);
  }
  return matches[0][1];
}

async function createSingleFileBundle() {
  const htmlPath = resolve(intermediateDirectory, 'index.html');
  const html = await readFile(htmlPath, 'utf8');
  const entryFileName = findEntryFileName(html);
  const entryPath = resolve(intermediateDirectory, entryFileName);
  const esbuildResult = await bundleWithEsbuild({
    bundle: true,
    entryPoints: [entryPath],
    format: 'esm',
    legalComments: 'none',
    metafile: true,
    minify: true,
    platform: 'browser',
    sourcemap: false,
    target: 'es2022',
    write: false,
  });
  const bundledJavaScript = esbuildResult.outputFiles.find(file => file.path.endsWith('.js'));
  if (!bundledJavaScript) throw new Error('esbuild did not produce a standalone JavaScript bundle.');

  const bundledInputs = new Set(Object.keys(esbuildResult.metafile.inputs)
    .map(path => normalizePath(resolve(path))));
  const bundle = {
    'index.html': {
      fileName: 'index.html',
      source: html,
      type: 'asset',
    },
    [entryFileName]: {
      code: bundledJavaScript.text,
      fileName: entryFileName,
      isEntry: true,
      type: 'chunk',
    },
  };

  for (const path of await listFiles(intermediateDirectory)) {
    const fileName = normalizePath(relative(intermediateDirectory, path));
    if (fileName === 'index.html' || fileName === 'manifest.json' || bundledInputs.has(normalizePath(path))) {
      continue;
    }
    bundle[fileName] = {
      fileName,
      source: await readFile(path),
      type: 'asset',
    };
  }

  inlineStandaloneBundle(bundle, {
    fontsDirectory: resolve('node_modules/figlet/fonts'),
    outputFileName,
    publicDirectory: resolve('public'),
  });
  const output = bundle[outputFileName];
  if (!output || output.type !== 'asset') throw new Error('Standalone packager did not produce an HTML asset.');
  return output.source;
}

process.env.IT_TOOLS_BUILD_MODE = 'standalone';

const registry = await generateStandaloneToolRegistry();
console.log(`Generated ${registry.count} standalone tool descriptors.`);

await buildWithVite({
  configFile: resolve('vite.config.ts'),
});

console.log('Bundling the filtered route graph into one browser module.');
const html = await createSingleFileBundle();
await rm(intermediateDirectory, { recursive: true, force: true });
const outputPath = resolve(outputDirectory, outputFileName);
await writeFile(outputPath, html);
const { size } = await stat(outputPath);
console.log(`Standalone artifact: ${relative(process.cwd(), outputPath)} (${(size / 1024 / 1024).toFixed(2)} MiB).`);
if (size > MAX_STANDALONE_BYTES) {
  throw new Error(`Standalone artifact exceeds the strict 10 MiB limit: ${size} bytes.`);
}
