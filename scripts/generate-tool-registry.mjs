import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const TOOL_CATEGORY_NAMES = [
  'Crypto',
  'Converter',
  'Web',
  'Images and videos',
  'Development',
  'Network',
  'Math',
  'Measurement',
  'Text',
  'Data',
];

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, '..');
const defaultToolsDirectory = resolve(repositoryRoot, 'src/tools');
const defaultOutputPath = resolve(defaultToolsDirectory, 'index.ts');

function readStringProperty(source, property) {
  const match = source.match(new RegExp(`\\n\\s*${property}:\\s*'([^']+)'`));
  return match?.[1];
}

function readIntegerProperty(source, property) {
  const match = source.match(new RegExp(`\\n\\s*${property}:\\s*(\\d+)`));
  return match ? Number(match[1]) : undefined;
}

function readLineExpression(source, property) {
  return source.match(new RegExp(`\\n\\s*${property}:\\s*(.+),\\s*$`, 'm'))?.[1];
}

function readArrayExpression(source, property) {
  const match = new RegExp(`\\n\\s*${property}:\\s*`).exec(source);
  if (!match) return undefined;
  const start = match.index + match[0].length;
  if (source[start] !== '[') return undefined;
  let quote;
  let escaped = false;
  let depth = 0;
  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === quote) quote = undefined;
      continue;
    }
    if (character === '\'' || character === '"') quote = character;
    else if (character === '[') depth += 1;
    else if (character === ']' && --depth === 0) return source.slice(start, index + 1);
  }
  return undefined;
}

function readIconImport(source, directoryName) {
  const icon = readLineExpression(source, 'icon');
  if (!icon || !/^[A-Za-z_$][\w$]*$/.test(icon)) {
    throw new Error(`${directoryName}/index.ts has an invalid or missing icon`);
  }

  const importPattern = /import\s+([^;]+?)\s+from\s+'([^']+)';/g;
  for (const match of source.matchAll(importPattern)) {
    const [, clause, sourcePath] = match;
    const defaultImport = clause.match(/^([A-Za-z_$][\w$]*)(?:\s*,|$)/)?.[1];
    if (defaultImport === icon) {
      return { imported: 'default', local: icon, source: sourcePath };
    }

    const namedImports = clause.match(/\{([^}]+)\}/)?.[1]
      .split(',')
      .map(value => value.trim())
      .filter(Boolean) ?? [];
    for (const namedImport of namedImports) {
      const parts = namedImport.split(/\s+as\s+/);
      const imported = parts[0]?.trim();
      const local = (parts[1] ?? parts[0])?.trim();
      if (local === icon && imported && /^[A-Za-z_$][\w$]*$/.test(imported)) {
        return { imported, local: icon, source: sourcePath };
      }
    }
  }

  throw new Error(`${directoryName}/index.ts icon ${icon} must be imported explicitly`);
}

function isSafeTranslatedOrLiteral(value) {
  return /^'(?:[^'\\]|\\.)*'$/.test(value)
    || /^translate\('tools\.[a-z0-9-]+\.(?:title|description)'\)$/.test(value);
}

function isSafeStringArray(value) {
  return /^\[\s*(?:'(?:[^'\\]|\\.)*'\s*,?\s*)*\]$/s.test(value);
}

function isHttpStatusKeywords(value, directoryName) {
  return directoryName === 'http-status-codes'
    && /^\[\s*'http',\s*'status',\s*'codes',\s*\.\.\.codesByCategories\.flatMap\(\(\{ codes \}\) => codes\.flatMap\(\(\{ code, name \}\) => \[String\(code\), name\]\)\),\s*\]$/s.test(value);
}

export function parseToolDescriptor(source, directoryName) {
  if (!/export const tool\s*=\s*defineTool\s*\(\s*\{/.test(source)) {
    throw new Error(`${directoryName}/index.ts must export one defineTool descriptor`);
  }
  if (!/export const registry\s*=\s*\{[\s\S]*?satisfies import\('\.\.\/tools\.types'\)\.ToolRegistryMetadata;/.test(source)) {
    throw new Error(`${directoryName}/index.ts must export typed registry metadata`);
  }

  const category = readStringProperty(source, 'category');
  const order = readIntegerProperty(source, 'order');
  const path = readStringProperty(source, 'path');
  const name = readLineExpression(source, 'name');
  const description = readLineExpression(source, 'description');
  const keywords = readArrayExpression(source, 'keywords');
  const componentPath = source.match(/\n\s*component:\s*\(\)\s*=>\s*import\('([^']+)'\),/)?.[1];
  const redirectFrom = readArrayExpression(source, 'redirectFrom');
  const createdAt = readLineExpression(source, 'createdAt');
  const icon = readIconImport(source, directoryName);

  if (!TOOL_CATEGORY_NAMES.includes(category)) {
    throw new Error(`${directoryName}/index.ts has an invalid or missing category`);
  }
  if (!Number.isSafeInteger(order) || order < 0) {
    throw new Error(`${directoryName}/index.ts has an invalid or missing order`);
  }
  if (!path?.startsWith('/') || path.length < 2) {
    throw new Error(`${directoryName}/index.ts has an invalid or missing path`);
  }

  if (!name || !isSafeTranslatedOrLiteral(name) || !description || !isSafeTranslatedOrLiteral(description)) {
    throw new Error(`${directoryName}/index.ts has an unsupported name or description expression`);
  }
  if (!keywords || (!isSafeStringArray(keywords) && !isHttpStatusKeywords(keywords, directoryName))) {
    throw new Error(`${directoryName}/index.ts has an unsupported keywords expression`);
  }
  if (!componentPath?.startsWith('./') || !componentPath.endsWith('.vue')) {
    throw new Error(`${directoryName}/index.ts has an invalid lazy component path`);
  }
  if (redirectFrom && !isSafeStringArray(redirectFrom)) {
    throw new Error(`${directoryName}/index.ts has an unsupported redirectFrom expression`);
  }
  if (createdAt && !/^new Date\('\d{4}-\d{2}-\d{2}'\)$/.test(createdAt)) {
    throw new Error(`${directoryName}/index.ts has an unsupported createdAt expression`);
  }

  return { category, componentPath, createdAt, description, directoryName, icon, keywords, name, order, path, redirectFrom };
}

export function validateToolDescriptors(descriptors) {
  const paths = new Set();
  const positions = new Set();

  for (const descriptor of descriptors) {
    if (paths.has(descriptor.path)) {
      throw new Error(`Duplicate tool path: ${descriptor.path}`);
    }
    paths.add(descriptor.path);

    const position = `${descriptor.category}:${descriptor.order}`;
    if (positions.has(position)) {
      throw new Error(`Duplicate tool order: ${position}`);
    }
    positions.add(position);
  }
}

export function renderToolRegistry(descriptors) {
  const sorted = [...descriptors].sort((left, right) => {
    const categoryDifference = TOOL_CATEGORY_NAMES.indexOf(left.category)
      - TOOL_CATEGORY_NAMES.indexOf(right.category);
    return categoryDifference || left.order - right.order || left.path.localeCompare(right.path, 'en');
  });
  const aliasByDirectory = new Map(sorted.map((descriptor, index) => [descriptor.directoryName, `tool${index}`]));
  const iconAliases = new Map();
  const iconImports = [];
  for (const descriptor of sorted) {
    const source = descriptor.icon.source.startsWith('./')
      ? `./${descriptor.directoryName}/${descriptor.icon.source.slice(2)}`
      : descriptor.icon.source;
    const key = `${descriptor.icon.imported}:${source}`;
    if (!iconAliases.has(key)) {
      const alias = `ToolIcon${iconAliases.size}`;
      iconAliases.set(key, alias);
      iconImports.push({ alias, imported: descriptor.icon.imported, source });
    }
  }
  const namedIconImports = new Map();
  const defaultIconImports = [];
  for (const iconImport of iconImports) {
    if (iconImport.imported === 'default') {
      defaultIconImports.push(`import ${iconImport.alias} from '${iconImport.source}';`);
      continue;
    }
    const imports = namedIconImports.get(iconImport.source) ?? [];
    imports.push({ alias: iconImport.alias, imported: iconImport.imported });
    namedIconImports.set(iconImport.source, imports);
  }
  const renderedIconImports = [
    ...[...namedIconImports].map(([source, imports]) => `import { ${imports
      .sort((left, right) => left.alias.localeCompare(right.alias, 'en'))
      .map(({ alias, imported }) => `${imported} as ${alias}`)
      .join(', ')} } from '${source}';`),
    ...defaultIconImports,
  ].join('\n');
  const toolDefinitions = sorted.map((descriptor) => {
    const optional = [
      descriptor.redirectFrom ? `  redirectFrom: ${descriptor.redirectFrom},` : undefined,
      descriptor.createdAt ? `  createdAt: ${descriptor.createdAt},` : undefined,
    ].filter(Boolean).join('\n');
    const componentPath = `./${descriptor.directoryName}/${descriptor.componentPath.slice(2)}`;
    const iconSource = descriptor.icon.source.startsWith('./')
      ? `./${descriptor.directoryName}/${descriptor.icon.source.slice(2)}`
      : descriptor.icon.source;
    const iconAlias = iconAliases.get(`${descriptor.icon.imported}:${iconSource}`);
    return `const ${aliasByDirectory.get(descriptor.directoryName)} = defineTool({
  name: ${descriptor.name},
  path: '${descriptor.path}',
  description: ${descriptor.description},
  keywords: ${descriptor.keywords},
  component: () => import('${componentPath}'),
  icon: ${iconAlias},${optional ? `\n${optional}` : ''}
});`;
  }).join('\n\n');
  const categoryRows = TOOL_CATEGORY_NAMES.map((category) => {
    const aliases = sorted
      .filter(descriptor => descriptor.category === category)
      .map(descriptor => aliasByDirectory.get(descriptor.directoryName));
    return `  { name: '${category}', components: [${aliases.join(', ')}] },`;
  }).join('\n');

  const httpStatusImport = sorted.some(descriptor => descriptor.directoryName === 'http-status-codes')
    ? "import { codesByCategories } from './http-status-codes/http-status-codes.constants';\n"
    : '';

  return `/* eslint-disable import/order -- generated imports mix packages, Vite virtual modules, and local SVGs */\n// This file is generated by scripts/generate-tool-registry.mjs. Do not edit manually.\n${renderedIconImports}\nimport { defineTool } from './tool';\nimport type { ToolCategory } from './tools.types';\n${httpStatusImport}import { translate } from '@/plugins/i18n.plugin';\n\n${toolDefinitions}\n\nexport const toolsByCategory: ToolCategory[] = [\n${categoryRows}\n];\n\nexport const tools = toolsByCategory.flatMap(({ components }) => components);\n`;
}

export async function discoverToolDescriptors(toolsDirectory = defaultToolsDirectory) {
  const entries = await readdir(toolsDirectory, { withFileTypes: true });
  const descriptors = [];

  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name, 'en'))) {
    if (!entry.isDirectory()) {
      continue;
    }

    const indexPath = resolve(toolsDirectory, entry.name, 'index.ts');
    let source;
    try {
      source = await readFile(indexPath, 'utf8');
    }
    catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
        continue;
      }
      throw error;
    }
    descriptors.push(parseToolDescriptor(source, entry.name));
  }

  validateToolDescriptors(descriptors);
  return descriptors;
}

export async function generateToolRegistry({ check = false, outputPath = defaultOutputPath, toolsDirectory = defaultToolsDirectory } = {}) {
  const descriptors = await discoverToolDescriptors(toolsDirectory);
  const output = renderToolRegistry(descriptors);

  if (check) {
    const current = await readFile(outputPath, 'utf8');
    if (current !== output) {
      throw new Error(`${relative(repositoryRoot, outputPath)} is stale; run pnpm generate:tool-registry`);
    }
  }
  else {
    await writeFile(outputPath, output);
  }

  return { count: descriptors.length, output };
}

const isMain = process.argv[1]
  && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isMain) {
  const result = await generateToolRegistry({ check: process.argv.includes('--check') });
  console.log(`${process.argv.includes('--check') ? 'Verified' : 'Generated'} ${result.count} tool descriptors.`);
}
