import { readFileSync, readdirSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const MIME_TYPES = {
  '.ico': 'image/x-icon',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain',
};

function asBuffer(source) {
  return Buffer.isBuffer(source) ? source : Buffer.from(source);
}

function toDataUrl(fileName, source) {
  const mimeType = MIME_TYPES[extname(fileName).toLowerCase()] ?? 'application/octet-stream';
  return `data:${mimeType};base64,${asBuffer(source).toString('base64')}`;
}

function replaceAssetReferences(source, replacements) {
  if (replacements.size === 0) return source;
  const pattern = new RegExp([...replacements.keys()]
    .sort((left, right) => right.length - left.length)
    .map(fileName => fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|'), 'g');
  return source.replace(pattern, fileName => replacements.get(fileName));
}

function inlineStylesheet(html, fileName, source) {
  const escaped = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<link([^>]*?)href=["'][^"']*${escaped}["']([^>]*)>`, 'i');
  if (!pattern.test(html)) {
    throw new Error(`Standalone stylesheet is not referenced by index.html: ${fileName}`);
  }
  return html.replace(pattern, `<style>${String(source).replace('@charset "UTF-8";', '')}</style>`);
}

function inlineEntryScript(html, fileName, source) {
  const escaped = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<script([^>]*?)src=["'][^"']*${escaped}["']([^>]*)><\\/script>`, 'i');
  if (!pattern.test(html)) {
    throw new Error(`Standalone entry script is not referenced by index.html: ${fileName}`);
  }
  const payload = gzipSync(Buffer.from(source), { level: 6 }).toString('base64');
  const bootstrap = `(()=>{const encoded='${payload}';const compressed=Uint8Array.from(atob(encoded),character=>character.charCodeAt(0));if(typeof DecompressionStream==='undefined')throw new Error('This browser does not support the standalone IT Tools bundle.');new Response(new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'))).text().then(source=>(0,eval)(source)).catch(error=>{console.error(error);document.body.textContent='The standalone IT Tools bundle could not be started.'})})()`;
  return html.replace(pattern, `<script>${bootstrap}</script>`);
}

function installInlineWorkerShim() {
  class InlineWorker {
    constructor(url) {
      this.onmessage = null;
      this.onmessageerror = null;
      this.onerror = null;
      this.terminated = false;
      this.mainListeners = new Map();
      this.workerListeners = new Map();

      const href = String(url);
      const match = href.match(/^data:text\/javascript;base64,([A-Za-z\d+/=]+)$/);
      if (!match) throw new Error('The standalone worker source is invalid.');
      const bytes = Uint8Array.from(atob(match[1]), character => character.charCodeAt(0));
      const source = new TextDecoder().decode(bytes);
      const scope = Object.create(globalThis);
      this.scope = scope;

      const addWorkerListener = (type, listener) => {
        const listeners = this.workerListeners.get(type) ?? new Set();
        listeners.add(listener);
        this.workerListeners.set(type, listeners);
      };
      const removeWorkerListener = (type, listener) => this.workerListeners.get(type)?.delete(listener);
      const postToMain = data => queueMicrotask(() => {
        if (this.terminated) return;
        this.dispatchMain('message', new MessageEvent('message', { data }));
      });
      const close = () => this.terminate();

      Object.defineProperties(scope, {
        addEventListener: { configurable: true, value: addWorkerListener, writable: true },
        close: { configurable: true, value: close, writable: true },
        onmessage: { configurable: true, value: null, writable: true },
        postMessage: { configurable: true, value: postToMain, writable: true },
        removeEventListener: { configurable: true, value: removeWorkerListener, writable: true },
      });

      try {
        const initialize = new Function(
          'globalThis',
          'self',
          'addEventListener',
          'removeEventListener',
          'postMessage',
          'close',
          'window',
          'document',
          source,
        );
        initialize(scope, scope, addWorkerListener, removeWorkerListener, postToMain, close, undefined, undefined);
      }
      catch (error) {
        queueMicrotask(() => this.dispatchError(error));
      }
    }

    addEventListener(type, listener) {
      const listeners = this.mainListeners.get(type) ?? new Set();
      listeners.add(listener);
      this.mainListeners.set(type, listeners);
    }

    removeEventListener(type, listener) {
      this.mainListeners.get(type)?.delete(listener);
    }

    dispatchMain(type, event) {
      const propertyListener = this[`on${type}`];
      if (typeof propertyListener === 'function') propertyListener.call(this, event);
      for (const listener of this.mainListeners.get(type) ?? []) listener.call(this, event);
    }

    dispatchError(error) {
      if (this.terminated) return;
      const event = {
        error,
        message: error instanceof Error ? error.message : String(error),
        preventDefault() {},
      };
      this.dispatchMain('error', event);
    }

    postMessage(data) {
      queueMicrotask(async () => {
        if (this.terminated) return;
        const event = new MessageEvent('message', { data });
        try {
          if (typeof this.scope.onmessage === 'function') await this.scope.onmessage(event);
          for (const listener of this.workerListeners.get('message') ?? []) await listener.call(this.scope, event);
        }
        catch (error) {
          this.dispatchError(error);
        }
      });
    }

    terminate() {
      this.terminated = true;
      this.mainListeners.clear();
      this.workerListeners.clear();
      this.onmessage = null;
      this.onmessageerror = null;
      this.onerror = null;
    }
  }

  Object.defineProperty(globalThis, 'Worker', {
    configurable: true,
    value: InlineWorker,
    writable: true,
  });
}

const INLINE_WORKER_SHIM_SOURCE = `(${installInlineWorkerShim.toString()})();`;

function installAmdRuntime() {
  const records = new Map();
  let currentId = '';

  function normalize(id, parentId = 'standalone:/') {
    if (id.startsWith('.')) return new URL(id, parentId).href;
    return id.includes(':') ? id : `standalone:/${id.replace(/^\//, '')}`;
  }

  function locate(requestedId, parentId) {
    const normalized = normalize(requestedId, parentId);
    if (records.has(normalized)) return normalized;
    if (records.has(`${normalized}.js`)) return `${normalized}.js`;
    return normalized;
  }

  function define(dependencies, factory) {
    if (!currentId) throw new Error('An anonymous standalone module was registered without an identifier.');
    records.set(currentId, {
      dependencies,
      exports: {},
      factory,
      promise: null,
      status: 'registered',
    });
  }
  define.amd = {};

  async function instantiate(requestedId, parentId) {
    const id = locate(requestedId, parentId);
    const record = records.get(id);
    if (!record) throw new Error(`Standalone module is missing: ${id}`);
    if (record.status === 'ready' || record.status === 'initializing') return record.exports;

    record.status = 'initializing';
    const localRequire = (dependencies, resolve, reject) => {
      if (typeof dependencies === 'string') {
        const dependency = records.get(locate(dependencies, id));
        if (!dependency || dependency.status !== 'ready') throw new Error(`Standalone module is not ready: ${dependencies}`);
        return dependency.exports;
      }
      Promise.all(dependencies.map(dependency => instantiate(dependency, id)))
        .then(values => resolve(...values), reject);
    };
    localRequire.toUrl = (requestedId) => {
      // Vite's AMD worker transform keeps a leading "./" when the emitted
      // worker asset is replaced with an embedded data URL.
      if (requestedId.startsWith('./data:')) return requestedId.slice(2);
      if (requestedId.startsWith('data:')) return requestedId;
      return locate(requestedId, id);
    };
    const values = await Promise.all(record.dependencies.map((dependency) => {
      if (dependency === 'exports') return record.exports;
      if (dependency === 'require') return localRequire;
      if (dependency === 'module') return { exports: record.exports, id, uri: id };
      return instantiate(dependency, id);
    }));
    const result = await record.factory(...values);
    if (result !== undefined) record.exports = result;
    record.status = 'ready';
    return record.exports;
  }

  function register(id, registration) {
    currentId = normalize(id);
    try {
      registration();
    }
    finally {
      currentId = '';
    }
  }

  function require(dependencies, resolve = () => undefined, reject = error => setTimeout(() => { throw error; })) {
    Promise.all(dependencies.map(dependency => instantiate(dependency)))
      .then(values => resolve(...values), reject);
  }
  require.toUrl = (requestedId) => {
    if (requestedId.startsWith('./data:')) return requestedId.slice(2);
    if (requestedId.startsWith('data:')) return requestedId;
    return normalize(requestedId);
  };

  Object.assign(globalThis, { define, require });
  return { register, require };
}

const AMD_RUNTIME_SOURCE = `const __IT_TOOLS_AMD__=globalThis.__IT_TOOLS_AMD__=(${installAmdRuntime.toString()})();`;

function renderAmdGraph(chunks) {
  const registrations = chunks.map(chunk => (
    `__IT_TOOLS_AMD__.register(${JSON.stringify(`standalone:/${chunk.fileName}`)},()=>{${chunk.code}\n});`
  )).join('\n');
  const entry = chunks.find(chunk => chunk.isEntry);
  if (!entry) throw new Error('Standalone AMD graph has no entry module.');
  return `${AMD_RUNTIME_SOURCE}\n${registrations}\n__IT_TOOLS_AMD__.require([${JSON.stringify(`standalone:/${entry.fileName}`)}]);`;
}

function inlinePublicIcons(html, publicDirectory) {
  return html.replace(/(<link\b[^>]*?href=["'])([^"']+)(["'][^>]*>)/gi, (match, before, href, after) => {
    if (/^(?:data:|https?:|#)/i.test(href)) return match;
    const normalized = href.replace(/^\.\//, '').replace(/^\//, '');
    if (!/\.(?:ico|png|svg)$/i.test(normalized)) return match;
    const path = resolve(publicDirectory, normalized);
    try {
      return `${before}${toDataUrl(normalized, readFileSync(path))}${after}`;
    }
    catch {
      throw new Error(`Standalone HTML references a missing public icon: ${normalized}`);
    }
  });
}

function readFigletFonts(fontsDirectory) {
  return Object.fromEntries(readdirSync(fontsDirectory)
    .filter(fileName => fileName.endsWith('.flf'))
    .sort((left, right) => left.localeCompare(right, 'en'))
    .map(fileName => [fileName.slice(0, -4), readFileSync(resolve(fontsDirectory, fileName), 'utf8')]));
}

export function inlineStandaloneBundle(bundle, {
  fontsDirectory,
  outputFileName = 'it-tools.html',
  publicDirectory,
} = {}) {
  const htmlEntries = Object.entries(bundle).filter(([, item]) => item.type === 'asset' && item.fileName.endsWith('.html'));
  if (htmlEntries.length === 0) return false;
  if (htmlEntries.length !== 1) throw new Error(`Standalone build requires one HTML entry; found ${htmlEntries.length}`);

  const chunks = Object.values(bundle).filter(item => item.type === 'chunk');
  const entryChunks = chunks.filter(item => item.isEntry);
  if (entryChunks.length !== 1) throw new Error(`Standalone build requires one JavaScript entry; found ${entryChunks.length}`);

  const [htmlKey, htmlAsset] = htmlEntries[0];
  const entryChunk = entryChunks[0];
  const embeddedAssets = new Map();

  for (const item of Object.values(bundle)) {
    if (item === htmlAsset || item.type === 'chunk' || item.fileName.endsWith('.css')) continue;
    embeddedAssets.set(item.fileName, toDataUrl(item.fileName, item.source));
  }
  const amdChunks = chunks.map(chunk => ({
    ...chunk,
    // Naive UI's AMD output loses the internal NMenu tooltip default in this
    // build format. Keep the standalone-only dependency shim null-safe.
    code: replaceAssetReferences(chunk.code, embeddedAssets)
      .replaceAll("internalExtraClass.concat('tooltip')", "(internalExtraClass || []).concat('tooltip')"),
  }));
  const entryCode = renderAmdGraph(amdChunks);

  const unresolvedWorker = entryCode.match(/worker-[a-f\d]+\.js/i)?.[0];
  if (unresolvedWorker) throw new Error(`Standalone worker was not embedded: ${unresolvedWorker}`);

  let html = String(htmlAsset.source);
  for (const item of Object.values(bundle)) {
    if (item.type === 'asset' && item.fileName.endsWith('.css')) {
      html = inlineStylesheet(html, item.fileName, item.source);
    }
  }
  const fonts = readFigletFonts(fontsDirectory);
  const standaloneEntryCode = `globalThis.__IT_TOOLS_STANDALONE_FONTS__=${JSON.stringify(fonts)};\n${INLINE_WORKER_SHIM_SOURCE}\n${entryCode}`;
  html = inlineEntryScript(html, entryChunk.fileName, standaloneEntryCode);
  html = html.replace(/<link\b[^>]*rel=["']modulepreload["'][^>]*>\s*/gi, '');
  html = inlinePublicIcons(html, publicDirectory);

  for (const key of Object.keys(bundle)) delete bundle[key];
  bundle[outputFileName] = {
    fileName: outputFileName,
    name: outputFileName,
    needsCodeReference: false,
    source: html,
    type: 'asset',
  };

  if (htmlKey === outputFileName) bundle[outputFileName].fileName = outputFileName;
  return true;
}
