export interface TreeNode {
  name: string
  children: TreeNode[]
}

/** Build a tree from indented lines. Depth = indentation (tabs or a fixed
 *  number of spaces). Lines ending with '/' or equal to '.'/'..' style
 *  markers keep their name as-is. */
export function buildTree(input: string): TreeNode[] {
  const root: TreeNode = { name: '', children: [] };
  const stack: { node: TreeNode; depth: number }[] = [{ node: root, depth: -1 }];

  for (const rawLine of input.split('\n')) {
    const line = rawLine.replace(/\r$/, '').replace(/\t/g, '    ');
    if (!line.trim()) {
      continue;
    }

    const indent = line.length - line.trimStart().length;
    const name = line.trim();

    while (stack.length > 1 && stack[stack.length - 1]!.depth >= indent) {
      stack.pop();
    }
    const parent = stack[stack.length - 1]!.node;
    const node: TreeNode = { name, children: [] };
    parent.children.push(node);
    stack.push({ node, depth: indent });
  }

  return root.children;
}

/** Render as the classic `tree` box-drawing output. */
export function renderTree(nodes: TreeNode[]): string {
  const lines: string[] = [];

  const walk = (children: TreeNode[], prefixes: string[], isRoot = false) => {
    children.forEach((child, index) => {
      const isLast = index === children.length - 1;
      // root-level entries render without any tree prefix, matching the
      // reference tools and the `tree` command's own output style
      const branch = isRoot ? '' : (isLast ? '└── ' : '├── ');
      lines.push([...prefixes, branch].join('') + child.name);
      if (child.children.length > 0) {
        const childPrefixes = isRoot ? [] : [...prefixes, isLast ? '    ' : '│   '];
        walk(child.children, childPrefixes);
      }
    });
  };

  walk(nodes, [], true);
  return lines.join('\n');
}
