import { describe, expect, it } from 'vitest';
import {
  extractMandatoryAsyncShellPaths,
  extractPwaClientRuntimePaths,
  filterShellPrecacheManifest,
} from './vite.config';

const manifestEntries = [
  { url: 'index.html', revision: 'index', size: 2_000 },
  { url: 'manifest.webmanifest', revision: 'manifest', size: 500 },
  { url: 'android-chrome-192x192.png', revision: 'icon-192', size: 10_000 },
  { url: 'android-chrome-512x512.png', revision: 'icon-512', size: 20_000 },
  { url: 'favicon-16x16.png', revision: 'favicon-16', size: 1_000 },
  { url: 'favicon-32x32.png', revision: 'favicon-32', size: 2_000 },
  { url: 'assets/index-12345678.js', revision: null, size: 700_000 },
  { url: 'assets/index-abcdef12.css', revision: null, size: 30_000 },
  { url: 'assets/workbox-window.prod.es5-a7b12eab.js', revision: null, size: 6_000 },
  { url: 'assets/lazy-fedcba98.js', revision: null, size: 200_000 },
  { url: 'assets/figlet-fonts-1.7.0/Standard.flf', revision: 'font', size: 20_000 },
];

describe('PWA shell precache policy', () => {
  it('keeps only static PWA metadata and resources referenced by index.html', () => {
    const result = filterShellPrecacheManifest(
      manifestEntries,
      `<!doctype html>
        <link rel="stylesheet" href="/assets/index-abcdef12.css">
        <link rel="icon" href="/favicon.ico">
        <script type="module" src="/assets/index-12345678.js"></script>`,
    );

    expect(result.warnings).toEqual([]);
    expect(result.manifest.map(entry => entry.url)).toEqual([
      'index.html',
      'manifest.webmanifest',
      'android-chrome-192x192.png',
      'android-chrome-512x512.png',
      'favicon-16x16.png',
      'favicon-32x32.png',
      'assets/index-12345678.js',
      'assets/index-abcdef12.css',
    ]);
  });

  it('resolves shell resources under a configured base path', () => {
    const result = filterShellPrecacheManifest(
      manifestEntries,
      `<link rel="stylesheet" href="/internal/tools/assets/index-abcdef12.css">
       <script src="/internal/tools/assets/index-12345678.js"></script>`,
    );

    expect(result.manifest.some(entry => entry.url === 'assets/index-12345678.js')).toBe(true);
    expect(result.manifest.some(entry => entry.url === 'assets/index-abcdef12.css')).toBe(true);
  });

  it('includes the Workbox client runtime discovered from the Vite manifest', () => {
    const clientRuntimePaths = extractPwaClientRuntimePaths(JSON.stringify({
      'index.html': {
        file: 'assets/index-12345678.js',
        isEntry: true,
      },
      'node_modules/.pnpm/workbox-window@7.0.0/node_modules/workbox-window/build/workbox-window.prod.es5.mjs': {
        file: 'assets/workbox-window.prod.es5-a7b12eab.js',
        isDynamicEntry: true,
        src: 'node_modules/.pnpm/workbox-window@7.0.0/node_modules/workbox-window/build/workbox-window.prod.es5.mjs',
      },
    }));
    const result = filterShellPrecacheManifest(
      manifestEntries,
      '<script src="/assets/index-12345678.js"></script>',
      clientRuntimePaths,
    );

    expect(clientRuntimePaths).toEqual(['assets/workbox-window.prod.es5-a7b12eab.js']);
    expect(result.manifest.some(entry => entry.url === clientRuntimePaths[0])).toBe(true);
  });

  it('includes the mandatory async layout, offline recovery, Home, and their static imports', () => {
    const paths = extractMandatoryAsyncShellPaths(JSON.stringify({
      'index.html': { file: 'assets/index-12345678.js', isEntry: true },
      '_shared.js': { file: 'assets/shared-12345678.js' },
      'src/layouts/base.layout.vue': {
        src: 'src/layouts/base.layout.vue', file: 'assets/layout-12345678.js', imports: ['_shared.js'],
      },
      'src/modules/pwa/OfflineRouteUnavailable.vue': {
        src: 'src/modules/pwa/OfflineRouteUnavailable.vue', file: 'assets/offline-12345678.js', imports: ['_shared.js'],
      },
      'src/pages/Home.page.vue': {
        src: 'src/pages/Home.page.vue', file: 'assets/home-12345678.js', imports: ['_shared.js'],
      },
    }));

    expect(paths).toEqual([
      'assets/home-12345678.js',
      'assets/layout-12345678.js',
      'assets/offline-12345678.js',
      'assets/shared-12345678.js',
    ]);
  });

  it('fails closed when the Workbox client runtime cannot be identified', () => {
    expect(() => extractPwaClientRuntimePaths(JSON.stringify({
      'index.html': { file: 'assets/index-12345678.js', isEntry: true },
    }))).toThrow(/Expected exactly one Workbox client runtime/);
  });

  it('fails when an index shell resource is absent from the Workbox input', () => {
    expect(() => filterShellPrecacheManifest(
      manifestEntries,
      '<script src="/assets/missing-12345678.js"></script>',
    )).toThrow(/missing from the Workbox manifest/);
  });

  it('fails closed when the application shell gains an external dependency', () => {
    expect(() => filterShellPrecacheManifest(
      manifestEntries,
      '<script src="https://cdn.example.test/shell.js"></script>',
    )).toThrow(/must be same-origin/);
  });

  it('ignores external non-shell metadata links', () => {
    expect(() => filterShellPrecacheManifest(
      manifestEntries,
      '<link rel="canonical" href="https://it-tools.example.test/url">',
    )).not.toThrow();
  });

  it('allows generated manifest metadata and configured icons to be appended after transforms', () => {
    const result = filterShellPrecacheManifest(
      manifestEntries.filter(entry => !entry.url.endsWith('.png') && entry.url !== 'manifest.webmanifest'),
      '<script src="/assets/index-12345678.js"></script>',
    );

    expect(result.manifest.some(entry => entry.url === 'manifest.webmanifest')).toBe(false);
    expect(result.manifest.some(entry => entry.url.endsWith('.png'))).toBe(false);
  });

  it('fails when a mandatory transform-input shell file is absent', () => {
    expect(() => filterShellPrecacheManifest(
      manifestEntries.filter(entry => entry.url !== 'index.html'),
      '<script src="/assets/index-12345678.js"></script>',
    )).toThrow(/Mandatory PWA shell file.*index\.html/);
  });

  it('fails when the mandatory shell exceeds one megabyte raw', () => {
    expect(() => filterShellPrecacheManifest(
      manifestEntries.map(entry => (
        entry.url === 'assets/index-12345678.js' ? { ...entry, size: 970_000 } : entry
      )),
      `<link rel="stylesheet" href="/assets/index-abcdef12.css">
       <script src="/assets/index-12345678.js"></script>`,
    )).toThrow(/limit is 1000000 bytes/);
  });
});
