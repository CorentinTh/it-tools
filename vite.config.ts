import { readFileSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import process from 'node:process';
import { URL, fileURLToPath } from 'node:url';

import VueI18n from '@intlify/unplugin-vue-i18n/vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Unocss from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { type Plugin, defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import markdown from 'unplugin-vue-markdown/vite';
import svgLoader from 'vite-svg-loader';
import { configDefaults } from 'vitest/config';

const isStandaloneBuild = process.env.IT_TOOLS_BUILD_MODE === 'standalone';
const baseUrl = process.env.BASE_URL ?? '/';
const require = createRequire(import.meta.url);
const figletPackageJsonPath = require.resolve('figlet/package.json');
const figletPackageDirectory = dirname(figletPackageJsonPath);
const figletFontsDirectory = resolve(figletPackageDirectory, 'fonts');

function readPackageVersion(packageJsonPath: string) {
  const metadata: unknown = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

  if (!metadata || typeof metadata !== 'object' || !('version' in metadata)
    || typeof metadata.version !== 'string' || !metadata.version) {
    throw new TypeError(`Package metadata does not contain a version: ${packageJsonPath}`);
  }

  return metadata.version;
}

const figletVersion = readPackageVersion(figletPackageJsonPath);
const figletFontAssetDirectory = `assets/figlet-fonts-${figletVersion}`;
const lazyAssetCacheName = 'it-tools-lazy-assets-v1';
const figletFontCacheName = `figlet-fonts-${figletVersion}`;
const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
const figletFontPublicPath = `${normalizedBaseUrl}${figletFontAssetDirectory}`;
const geoIpPublicDirectory = resolve(__dirname, 'public/assets/geoip');
const standaloneGeoIpDatasetUrls = isStandaloneBuild
  ? Object.fromEntries(['user-country-ipv4.csv.gz', 'user-country-ipv6.csv.gz'].map(fileName => [
      fileName,
      `data:application/gzip;base64,${readFileSync(resolve(geoIpPublicDirectory, fileName)).toString('base64')}`,
    ]))
  : undefined;
const MAX_SHELL_PRECACHE_RAW_BYTES = 1_000_000;
export const WORKER_OPTIMIZED_DEPENDENCIES = [
  '@noble/hashes/blake3.js',
  '@noble/hashes/legacy.js',
  '@noble/hashes/sha2.js',
  '@noble/hashes/sha3.js',
  'ajv',
  'ajv/dist/2019.js',
  'ajv/dist/2020.js',
  'bcryptjs',
  'composerize-ts',
  'crypto-js',
  'fuse.js',
  'hash-wasm',
  'hyparquet',
  'iarna-toml-esm',
  'js-base64',
  'json5',
  'markdown-it',
  'mathjs/number',
  'pkijs',
  'prettier',
  'prettier/plugins/html',
  'randexp',
  'saxen',
  'sql-formatter',
  'xml-formatter',
  'xml-js',
  'yaml',
] as const;
export const LAZY_ROUTE_OPTIMIZED_DEPENDENCIES = [
  'jsonc-parser',
  'mermaid',
  'monaco-editor/esm/vs/editor/editor.api',
] as const;
export const WORKER_UNOPTIMIZED_DEPENDENCIES = ['emojilib', 'unicode-emoji-json'] as const;
const SHELL_STATIC_URLS = new Set([
  'index.html',
  'manifest.webmanifest',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png',
  'favicon-16x16.png',
  'favicon-32x32.png',
]);
// vite-plugin-pwa appends its generated manifest and configured icons after
// Workbox transforms. Only index.html is guaranteed to exist in this phase;
// the final generated inventory is enforced by build statistics and budgets.
const REQUIRED_TRANSFORM_INPUT_URLS = new Set(['index.html']);
export const MANDATORY_ASYNC_SHELL_SOURCES = new Set([
  'src/layouts/base.layout.vue',
  'src/modules/pwa/OfflineRouteUnavailable.vue',
  'src/pages/Home.page.vue',
]);

interface PrecacheManifestEntry {
  url: string
  revision: string | null
  size: number
}

function normalizePrecacheUrl(url: string) {
  return decodeURIComponent(url.split(/[?#]/, 1)[0]).replace(/^\/+/, '');
}

function extractShellResourcePaths(html: string) {
  const resourcePaths = new Set<string>();
  const tags = html.match(/<(?:script|link)\b[^>]*>/gi) ?? [];

  for (const tag of tags) {
    const source = /^<script\b/i.test(tag)
      ? tag.match(/\ssrc\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s"'<>]+))/i)
      : tag.match(/\shref\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s"'<>]+))/i);
    const url = source?.[1] ?? source?.[2] ?? source?.[3];

    if (!url || url.startsWith('data:')) {
      continue;
    }

    if (/^<link\b/i.test(tag)) {
      const relationMatch = tag.match(/\srel\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s"'<>]+))/i);
      const relations = (relationMatch?.[1] ?? relationMatch?.[2] ?? relationMatch?.[3] ?? '')
        .toLowerCase()
        .split(/\s+/);

      if (!relations.some(relation => ['stylesheet', 'modulepreload', 'preload'].includes(relation))) {
        continue;
      }
    }

    if (/^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(url)) {
      throw new Error(`PWA shell resources must be same-origin: ${url}`);
    }

    const pathname = new URL(url, 'https://it-tools.invalid').pathname;
    resourcePaths.add(decodeURIComponent(pathname).replace(/^\/+/, ''));
  }

  return resourcePaths;
}

export function filterShellPrecacheManifest(
  manifestEntries: PrecacheManifestEntry[],
  indexHtml: string,
  clientRuntimePaths: readonly string[] = [],
) {
  const entryPaths = new Map(
    manifestEntries.map(entry => [normalizePrecacheUrl(entry.url), entry]),
  );
  const allowedEntryPaths = new Set<string>();

  for (const staticUrl of SHELL_STATIC_URLS) {
    if (!entryPaths.has(staticUrl) && REQUIRED_TRANSFORM_INPUT_URLS.has(staticUrl)) {
      throw new Error(`Mandatory PWA shell file is missing from the Workbox manifest: ${staticUrl}`);
    }

    if (entryPaths.has(staticUrl)) {
      allowedEntryPaths.add(staticUrl);
    }
  }

  for (const resourcePath of extractShellResourcePaths(indexHtml)) {
    const matchingEntryPath = [...entryPaths.keys()]
      .find(entryPath => resourcePath === entryPath || resourcePath.endsWith(`/${entryPath}`));

    if (!matchingEntryPath) {
      throw new Error(`PWA shell resource is missing from the Workbox manifest: ${resourcePath}`);
    }

    allowedEntryPaths.add(matchingEntryPath);
  }

  for (const runtimePath of clientRuntimePaths) {
    const normalizedRuntimePath = normalizePrecacheUrl(runtimePath);

    if (!entryPaths.has(normalizedRuntimePath)) {
      throw new Error(`PWA client runtime is missing from the Workbox manifest: ${runtimePath}`);
    }

    allowedEntryPaths.add(normalizedRuntimePath);
  }

  const manifest = manifestEntries.filter(entry => (
    allowedEntryPaths.has(normalizePrecacheUrl(entry.url))
  ));
  const invalidSizeEntry = manifest.find(entry => !Number.isSafeInteger(entry.size) || entry.size < 0);

  if (invalidSizeEntry) {
    throw new Error(`PWA shell file has an invalid byte size: ${invalidSizeEntry.url}`);
  }

  const rawBytes = manifest.reduce((total, entry) => total + entry.size, 0);

  if (rawBytes > MAX_SHELL_PRECACHE_RAW_BYTES) {
    throw new Error(
      `PWA shell precache is ${rawBytes} bytes; limit is ${MAX_SHELL_PRECACHE_RAW_BYTES} bytes`,
    );
  }

  return { manifest, warnings: [] as string[] };
}

export function extractPwaClientRuntimePaths(viteManifestSource: string) {
  const viteManifest: unknown = JSON.parse(viteManifestSource);

  if (!viteManifest || typeof viteManifest !== 'object' || Array.isArray(viteManifest)) {
    throw new TypeError('Vite manifest must be an object');
  }

  const runtimePaths = Object.entries(viteManifest)
    .filter(([sourceId, chunk]) => {
      if (!chunk || typeof chunk !== 'object' || Array.isArray(chunk)) {
        return false;
      }

      const source = 'src' in chunk && typeof chunk.src === 'string' ? chunk.src : sourceId;
      return /\/node_modules\/workbox-window\/build\/workbox-window[^/]*\.[cm]?js$/.test(source);
    })
    .map(([sourceId, chunk]) => {
      if (!chunk || typeof chunk !== 'object' || !('file' in chunk) || typeof chunk.file !== 'string') {
        throw new TypeError(`Vite manifest entry has no output file: ${sourceId}`);
      }

      return normalizePrecacheUrl(chunk.file);
    });

  if (runtimePaths.length !== 1) {
    throw new Error(`Expected exactly one Workbox client runtime in the Vite manifest; found ${runtimePaths.length}`);
  }

  return runtimePaths;
}

export function extractMandatoryAsyncShellPaths(viteManifestSource: string) {
  const viteManifest: unknown = JSON.parse(viteManifestSource);

  if (!viteManifest || typeof viteManifest !== 'object' || Array.isArray(viteManifest)) {
    throw new TypeError('Vite manifest must be an object');
  }

  const entries = viteManifest as Record<string, {
    src?: unknown
    file?: unknown
    css?: unknown
    assets?: unknown
    imports?: unknown
  }>;
  const rootKeys = Object.entries(entries)
    .filter(([, entry]) => typeof entry.src === 'string' && MANDATORY_ASYNC_SHELL_SOURCES.has(entry.src))
    .map(([key]) => key);

  if (rootKeys.length !== MANDATORY_ASYNC_SHELL_SOURCES.size) {
    throw new Error(`Expected ${MANDATORY_ASYNC_SHELL_SOURCES.size} mandatory async shell entries; found ${rootKeys.length}`);
  }

  const paths = new Set<string>();
  const pending = [...rootKeys];
  const visited = new Set<string>();
  while (pending.length > 0) {
    const key = pending.pop();
    if (!key || visited.has(key)) continue;
    visited.add(key);
    const entry = entries[key];
    if (!entry || typeof entry.file !== 'string') {
      throw new Error(`Mandatory async shell manifest entry is invalid: ${key}`);
    }
    paths.add(normalizePrecacheUrl(entry.file));
    for (const field of [entry.css, entry.assets]) {
      if (field === undefined) continue;
      if (!Array.isArray(field) || field.some(value => typeof value !== 'string')) {
        throw new Error(`Mandatory async shell manifest entry has an invalid asset list: ${key}`);
      }
      for (const path of field as string[]) paths.add(normalizePrecacheUrl(path));
    }
    if (entry.imports !== undefined) {
      if (!Array.isArray(entry.imports) || entry.imports.some(value => typeof value !== 'string')) {
        throw new Error(`Mandatory async shell manifest entry has an invalid imports list: ${key}`);
      }
      pending.push(...entry.imports as string[]);
    }
  }

  return [...paths].sort();
}

async function listFigletFontFiles() {
  const entries = await readdir(figletFontsDirectory, { withFileTypes: true });

  return entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.flf'))
    .map(entry => entry.name)
    .sort((left, right) => left.localeCompare(right, 'en'));
}

/**
 * Figlet's browser build fetches fonts at runtime. Keep those requests on the
 * application origin, version the URL for immutable caching, and avoid adding
 * every font to the install-time PWA precache.
 */
function localFigletFonts(): Plugin {
  const developmentPathPrefix = new URL(`${figletFontPublicPath}/`, 'http://localhost').pathname;

  return {
    name: 'it-tools-local-figlet-fonts',
    async generateBundle() {
      for (const fontFile of await listFigletFontFiles()) {
        this.emitFile({
          type: 'asset',
          fileName: `${figletFontAssetDirectory}/${fontFile}`,
          source: await readFile(resolve(figletFontsDirectory, fontFile)),
        });
      }
    },
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const requestPath = new URL(request.url ?? '/', 'http://localhost').pathname;

        if (!requestPath.startsWith(developmentPathPrefix)) {
          next();
          return;
        }

        let fontFile: string;
        try {
          fontFile = decodeURIComponent(requestPath.slice(developmentPathPrefix.length));
        }
        catch {
          response.statusCode = 400;
          response.end('Invalid font path');
          return;
        }

        if (!(await listFigletFontFiles()).includes(fontFile)) {
          response.statusCode = 404;
          response.end('Font not found');
          return;
        }

        try {
          response.statusCode = 200;
          response.setHeader('Content-Type', 'text/plain; charset=utf-8');
          response.setHeader('Cache-Control', 'no-cache');
          response.end(await readFile(resolve(figletFontsDirectory, fontFile)));
        }
        catch (error) {
          next(error);
        }
      });
    },
  };
}

function standalonePwaRegisterStub(): Plugin {
  const moduleId = '\0it-tools-standalone-pwa-register';

  return {
    name: 'it-tools-standalone-pwa-register-stub',
    resolveId(id) {
      return id === 'virtual:pwa-register' ? moduleId : undefined;
    },
    load(id) {
      return id === moduleId ? 'export const registerSW = () => undefined;' : undefined;
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    ...(!isStandaloneBuild ? [localFigletFonts()] : []),
    VueI18n({
      runtimeOnly: true,
      jitCompilation: true,
      compositionOnly: true,
      fullInstall: true,
      strictMessage: false,
      include: [
        resolve(__dirname, 'locales/**'),
      ],
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
        'vue-i18n',
        {
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
        },
      ],
      vueTemplate: true,
      eslintrc: {
        enabled: true,
      },
    }),
    Icons({ compiler: 'vue3' }),
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    vueJsx(),
    markdown({}),
    svgLoader(),
    ...(isStandaloneBuild ? [standalonePwaRegisterStub()] : [VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      includeAssets: [
        'android-chrome-192x192.png',
        'android-chrome-512x512.png',
        'favicon-16x16.png',
        'favicon-32x32.png',
      ],
      manifest: {
        name: 'IT Tools',
        description: 'Aggregated set of useful tools for developers.',
        display: 'standalone',
        lang: 'en',
        start_url: `${normalizedBaseUrl}?utm_source=pwa&utm_medium=pwa`,
        orientation: 'any',
        theme_color: '#7868f4',
        background_color: '#f7f7fb',
        icons: [
          {
            src: `${normalizedBaseUrl}favicon-16x16.png`,
            type: 'image/png',
            sizes: '16x16',
          },
          {
            src: `${normalizedBaseUrl}favicon-32x32.png`,
            type: 'image/png',
            sizes: '32x32',
          },
          {
            src: `${normalizedBaseUrl}android-chrome-192x192.png`,
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: `${normalizedBaseUrl}android-chrome-512x512.png`,
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globIgnores: [`${figletFontAssetDirectory}/**/*`],
        cleanupOutdatedCaches: true,
        manifestTransforms: [
          async (entries) => {
            const [indexHtml, viteManifest] = await Promise.all([
              readFile(resolve(__dirname, 'dist/index.html'), 'utf8'),
              readFile(resolve(__dirname, 'dist/manifest.json'), 'utf8'),
            ]);

            return filterShellPrecacheManifest(
              entries,
              indexHtml,
              [
                ...extractPwaClientRuntimePaths(viteManifest),
                ...extractMandatoryAsyncShellPaths(viteManifest),
              ],
            );
          },
        ],
        runtimeCaching: [
          {
            urlPattern: /\/assets\/.+-[a-z\d_-]{8,}\.(?:css|js)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: lazyAssetCacheName,
              cacheableResponse: {
                statuses: [0, 200],
              },
              expiration: {
                maxEntries: 128,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
          {
            urlPattern: new RegExp(`/${figletFontAssetDirectory.replaceAll('.', '\\.')}\/[^/]+\\.flf$`),
            handler: 'CacheFirst',
            options: {
              cacheName: figletFontCacheName,
              expiration: {
                maxEntries: 32,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
    })]),
    Components({
      dirs: ['src/'],
      extensions: ['vue', 'md'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [NaiveUiResolver(), IconsResolver({ prefix: 'icon' })],
    }),
    Unocss(),
  ],
  base: isStandaloneBuild ? './' : baseUrl,
  resolve: {
    alias: [
      {
        find: '@tool-registry',
        replacement: resolve(__dirname, isStandaloneBuild
          ? 'src/tools/index.standalone.ts'
          : 'src/tools/index.ts'),
      },
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
    ],
  },
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(process.env.npm_package_version),
    'import.meta.env.FIGLET_FONT_PATH': JSON.stringify(figletFontPublicPath),
    'import.meta.env.LAZY_ASSET_CACHE_NAME': JSON.stringify(lazyAssetCacheName),
    'import.meta.env.FIGLET_FONT_CACHE_NAME': JSON.stringify(figletFontCacheName),
    'import.meta.env.STANDALONE': JSON.stringify(isStandaloneBuild),
    '__IT_TOOLS_STANDALONE_GEOIP_DATASET_URLS__': JSON.stringify(standaloneGeoIpDatasetUrls),
  },
  optimizeDeps: {
    // Vite 4 does not crawl route-owned workers or every lazy route during its
    // initial scan. Without these lists, a first visit can trigger a new
    // optimization pass and a full-page reload that abandons the active task.
    include: [...WORKER_OPTIMIZED_DEPENDENCIES, ...LAZY_ROUTE_OPTIMIZED_DEPENDENCIES],
    // These packages expose JSON/module data that Vite cannot prebundle as an
    // optimizeDeps entry. Excluding them keeps them native and prevents a
    // later discovery pass from restarting the dev page.
    exclude: [...WORKER_UNOPTIMIZED_DEPENDENCIES],
  },
  server: {
    headers: {
      'Cache-Control': 'no-store',
      'X-IT-Tools-Mode': 'development',
    },
    host: '127.0.0.1',
    port: 8091,
    strictPort: true,
  },
  preview: {
    headers: {
      'X-IT-Tools-Mode': 'preview',
    },
    host: '127.0.0.1',
    port: 5050,
    strictPort: true,
  },
  test: {
    exclude: [...configDefaults.exclude, '**/*.e2e.spec.ts', 'scripts/**/*.test.mjs'],
    server: {
      deps: {
        // iarna-toml-esm ships ESM syntax from a package without an ESM package
        // marker. Vite handles it in the browser build; Vitest must transform it.
        inline: ['iarna-toml-esm'],
      },
    },
  },
  build: {
    // Vite 4 emits this as dist/manifest.json. The build-stats reader also
    // accepts Vite's newer dist/.vite/manifest.json location.
    manifest: true,
    target: 'esnext',
    ...(isStandaloneBuild
      ? {
          assetsDir: '',
          assetsInlineLimit: Number.MAX_SAFE_INTEGER,
          chunkSizeWarningLimit: 100_000,
          copyPublicDir: false,
          cssCodeSplit: false,
          minify: false,
          outDir: 'dist-standalone/.intermediate',
          rollupOptions: {
            output: {
              format: 'amd',
            },
          },
        }
      : {}),
  },
});
