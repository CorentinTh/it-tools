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
  const payload = gzipSync(Buffer.from(source), { level: 9 }).toString('base64');
  const bootstrap = `const encoded='${payload}';const compressed=Uint8Array.from(atob(encoded),character=>character.charCodeAt(0));if(typeof DecompressionStream==='undefined')throw new Error('This browser does not support the standalone IT Tools bundle.');const stream=new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'));const source=await new Response(stream).text();const moduleUrl=URL.createObjectURL(new Blob([source],{type:'text/javascript'}));try{await import(moduleUrl)}finally{URL.revokeObjectURL(moduleUrl)}`;
  return html.replace(pattern, `<script type="module">${bootstrap}</script>`);
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

  const entryChunks = Object.values(bundle).filter(item => item.type === 'chunk' && item.isEntry);
  if (entryChunks.length !== 1) throw new Error(`Standalone build requires one JavaScript entry; found ${entryChunks.length}`);

  const [htmlKey, htmlAsset] = htmlEntries[0];
  const entryChunk = entryChunks[0];
  const embeddedAssets = new Map();

  for (const item of Object.values(bundle)) {
    if (item === htmlAsset || item === entryChunk) continue;
    if (item.type === 'chunk' || !item.fileName.endsWith('.css')) {
      const source = item.type === 'chunk' ? item.code : item.source;
      embeddedAssets.set(item.fileName, toDataUrl(item.fileName, source));
    }
  }
  const entryCode = replaceAssetReferences(entryChunk.code, embeddedAssets);

  const unresolvedWorker = entryCode.match(/[A-Za-z0-9._/-]*worker-[a-f\d]+\.js/i)?.[0];
  if (unresolvedWorker) throw new Error(`Standalone worker was not embedded: ${unresolvedWorker}`);

  let html = String(htmlAsset.source);
  for (const item of Object.values(bundle)) {
    if (item.type === 'asset' && item.fileName.endsWith('.css')) {
      html = inlineStylesheet(html, item.fileName, item.source);
    }
  }
  const fonts = readFigletFonts(fontsDirectory);
  const standaloneEntryCode = `globalThis.__IT_TOOLS_STANDALONE_FONTS__=${JSON.stringify(fonts)};\n${entryCode}`;
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
