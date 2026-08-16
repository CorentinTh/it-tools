export type DeveloperTextOperation = 'stack-trace' | 'smart-replace' | 'folder-tree' | 'markdown-toc';

export interface DeveloperTextTask {
  operation: DeveloperTextOperation
  source: string
  find: string
  replacement: string
  regex: boolean
  caseSensitive: boolean
}

const MAX_REPLACEMENTS = 100_000;
const MAX_PATHS = 20_000;
const MAX_PATH_DEPTH = 64;
const MAX_HEADINGS = 10_000;

function formatStackTrace(source: string): string {
  const lines = source.replace(/\r\n?/gu, '\n').split('\n');
  const output: string[] = [];
  let previousBlank = true;
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      if (!previousBlank && output.length > 0) {
        output.push('');
      }
      previousBlank = true;
      continue;
    }
    const isFrame = /^(?:at\s|File\s|\.\.\.\s|Caused by:|Suppressed:|\^)/u.test(line);
    output.push(isFrame && !/^(?:Caused by:|Suppressed:)/u.test(line) ? `  ${line}` : line);
    previousBlank = false;
  }
  return output.join('\n').trim();
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}

function smartReplace(task: DeveloperTextTask): string {
  if (!task.find) {
    throw new Error('Enter text or a regular expression to find.');
  }
  let expression: RegExp;
  try {
    expression = new RegExp(task.regex ? task.find : escapeRegex(task.find), `gu${task.caseSensitive ? '' : 'i'}`);
  }
  catch {
    throw new Error('The regular expression is invalid.');
  }
  let replacements = 0;
  return task.source.replace(expression, (...arguments_) => {
    replacements += 1;
    if (replacements > MAX_REPLACEMENTS) {
      throw new Error('The replacement limit was exceeded.');
    }
    if (!task.regex) {
      return task.replacement;
    }
    const match = arguments_[0] as string;
    const hasNamedGroups = typeof arguments_.at(-1) === 'object';
    const captures = arguments_.slice(1, hasNamedGroups ? -3 : -2) as Array<string | undefined>;
    return task.replacement.replace(/\$(\$|&|\d{1,2})/gu, (_token, reference: string) => {
      if (reference === '$') {
        return '$';
      }
      if (reference === '&') {
        return match;
      }
      return captures[Number(reference) - 1] ?? '';
    });
  });
}

interface TreeNode { children: Map<string, TreeNode> }

function renderFolderTree(source: string): string {
  const paths = source.replace(/\r\n?/gu, '\n').split('\n').map(line => line.trim()).filter(Boolean);
  if (paths.length > MAX_PATHS) {
    throw new Error(`Folder trees are limited to ${MAX_PATHS.toLocaleString('en-US')} paths.`);
  }
  const root: TreeNode = { children: new Map() };
  for (const path of paths) {
    const parts = path.replace(/\\/gu, '/').split('/').filter(part => part && part !== '.');
    if (parts.length === 0 || parts.length > MAX_PATH_DEPTH || parts.some(part => part === '..' || part.length > 255)) {
      throw new Error('Each path must contain 1–64 safe segments of at most 255 characters.');
    }
    let node = root;
    for (const part of parts) {
      let child = node.children.get(part);
      if (!child) {
        child = { children: new Map() };
        node.children.set(part, child);
      }
      node = child;
    }
  }
  const output: string[] = [];
  function visit(node: TreeNode, prefix: string): void {
    const entries = [...node.children.entries()].sort(([left], [right]) => left.localeCompare(right, 'en'));
    entries.forEach(([name, child], index) => {
      const last = index === entries.length - 1;
      output.push(`${prefix}${last ? '└── ' : '├── '}${name}${child.children.size > 0 ? '/' : ''}`);
      visit(child, `${prefix}${last ? '    ' : '│   '}`);
    });
  }
  visit(root, '');
  return output.join('\n');
}

function markdownSlug(title: string): string {
  return title.toLowerCase().trim()
    .replace(/<[^>]*>/gu, '')
    .replace(/[`*_~\[\]()]/gu, '')
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
    .replace(/\s+/gu, '-')
    .replace(/-+/gu, '-');
}

function createMarkdownToc(source: string): string {
  const output: string[] = [];
  const slugs = new Map<string, number>();
  let fenced = false;
  for (const line of source.replace(/\r\n?/gu, '\n').split('\n')) {
    if (/^\s*(```|~~~)/u.test(line)) {
      fenced = !fenced;
      continue;
    }
    if (fenced) {
      continue;
    }
    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/u.exec(line);
    if (!match) {
      continue;
    }
    if (output.length >= MAX_HEADINGS) {
      throw new Error(`Markdown TOCs are limited to ${MAX_HEADINGS.toLocaleString('en-US')} headings.`);
    }
    const title = match[2].replace(/\[([^\]]+)\]\([^)]*\)/gu, '$1').trim();
    const base = markdownSlug(title) || 'section';
    const duplicate = slugs.get(base) ?? 0;
    slugs.set(base, duplicate + 1);
    const slug = duplicate === 0 ? base : `${base}-${duplicate}`;
    output.push(`${'  '.repeat(match[1].length - 1)}- [${title.replace(/\]/gu, '\\]')}](#${slug})`);
  }
  return output.join('\n');
}

export function transformDeveloperText(task: DeveloperTextTask): string {
  switch (task.operation) {
    case 'stack-trace':
      return formatStackTrace(task.source);
    case 'smart-replace':
      return smartReplace(task);
    case 'folder-tree':
      return renderFolderTree(task.source);
    case 'markdown-toc':
      return createMarkdownToc(task.source);
  }
}
