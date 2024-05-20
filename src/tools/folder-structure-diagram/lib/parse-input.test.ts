import { describe, expect, it } from 'vitest';
import type { FileStructure } from './FileStructure';
import { mockInput } from './mock-input';
import { parseInput, splitInput } from './parse-input';

describe('parse-input', () => {
  it('parses plain text input into a FileStructure object', () => {
    const actual = parseInput(mockInput);

    const root: FileStructure = {
      name: '.',
      children: [],
      indentCount: -1,
      parent: null,
    };

    const myApp: FileStructure = {
      name: 'my-app',
      children: [],
      indentCount: 0,
      parent: root,
    };
    root.children.push(myApp);

    const src: FileStructure = {
      name: 'src',
      children: [],
      indentCount: 2,
      parent: myApp,
    };
    myApp.children.push(src);

    const srcIndexHtml: FileStructure = {
      name: 'index.html',
      children: [],
      indentCount: 4,
      parent: src,
    };
    src.children.push(srcIndexHtml);

    const mainTs: FileStructure = {
      name: 'main.ts',
      children: [],
      indentCount: 4,
      parent: src,
    };
    src.children.push(mainTs);

    const mainScss: FileStructure = {
      name: 'main.scss',
      children: [],
      indentCount: 3,
      parent: src,
    };
    src.children.push(mainScss);

    const build: FileStructure = {
      name: 'build',
      children: [],
      indentCount: 2,
      parent: myApp,
    };
    myApp.children.push(build);

    const buildIndexHtml: FileStructure = {
      name: 'index.html',
      children: [],
      indentCount: 4,
      parent: build,
    };
    build.children.push(buildIndexHtml);

    const mainJs: FileStructure = {
      name: 'main.js',
      children: [],
      indentCount: 4,
      parent: build,
    };
    build.children.push(mainJs);

    const mainCss: FileStructure = {
      name: 'main.css',
      children: [],
      indentCount: 4,
      parent: build,
    };
    build.children.push(mainCss);

    const prettierRcJson: FileStructure = {
      name: '.prettierrc.json',
      children: [],
      indentCount: 2,
      parent: myApp,
    };
    myApp.children.push(prettierRcJson);

    const gitlabCiYml: FileStructure = {
      name: '.gitlab-ci.yml',
      children: [],
      indentCount: 2,
      parent: myApp,
    };
    myApp.children.push(gitlabCiYml);

    const readmeMd: FileStructure = {
      name: 'README.md',
      children: [],
      indentCount: 2,
      parent: myApp,
    };
    myApp.children.push(readmeMd);

    const emptyDir: FileStructure = {
      name: 'empty dir',
      children: [],
      indentCount: 0,
      parent: root,
    };
    root.children.push(emptyDir);

    expect(actual).toEqual(root);
  });
});

describe('splitInput', () => {
  it('splits plain text into an array of File Structure objects', () => {
    const actual = splitInput(mockInput);

    const expected = [
      { name: 'my-app', children: [], indentCount: 0, parent: null },
      { name: 'src', children: [], indentCount: 2, parent: null },
      { name: 'index.html', children: [], indentCount: 4, parent: null },
      { name: 'main.ts', children: [], indentCount: 4, parent: null },
      { name: 'main.scss', children: [], indentCount: 3, parent: null },
      { name: 'build', children: [], indentCount: 2, parent: null },
      { name: 'index.html', children: [], indentCount: 4, parent: null },
      { name: 'main.js', children: [], indentCount: 4, parent: null },
      { name: 'main.css', children: [], indentCount: 4, parent: null },
      { name: '.prettierrc.json', children: [], indentCount: 2, parent: null },
      { name: '.gitlab-ci.yml', children: [], indentCount: 2, parent: null },
      { name: 'README.md', children: [], indentCount: 2, parent: null },
      { name: 'empty dir', children: [], indentCount: 0, parent: null },
    ];

    expect(actual).toEqual(expected);
  });
});
