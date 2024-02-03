import { existsSync, writeFileSync } from 'node:fs';
import { Glob } from 'bun';
import _ from 'lodash';

async function getPathsFromGlobs({ patterns, onlyFiles = true }) {
  const filePaths = [];

  for (const pattern of patterns) {
    const glob = new Glob(pattern);

    for await (const filePath of glob.scan({ onlyFiles, cwd: '.' })) {
      filePaths.push(filePath);
    }
  }

  return { filePaths };
}

function getLocaleKey({ filePath }) {
  const fileName = filePath.split('/').pop();
  return fileName.replace(/\.yml$/, '');
}

async function createMissingLocaleFile({ localeKey }) {
  const fileName = `${localeKey}.yml`;

  const { filePaths: localesDirs } = await getPathsFromGlobs({
    patterns: [
      'locales',
      'src/tools/*/locales',
    ],
    onlyFiles: false,
  });

  for (const localesDir of localesDirs) {
    const filePath = `${localesDir}/${fileName}`;

    if (existsSync(filePath)) {
      console.log(`Locale file already exists: ${filePath}`);
      continue;
    }

    console.log(`Creating missing locale file: ${filePath}`);
    writeFileSync(filePath, '', 'utf8');
  }
}

const { filePaths } = await getPathsFromGlobs({
  patterns: [
    'locales/*.yml',
    'src/tools/*/locales/*.yml',
  ],
});

await Promise.all(
  _.chain(filePaths)
    .map(filePath => getLocaleKey({ filePath }))
    .uniq()
    .map(localeKey => createMissingLocaleFile({ localeKey }))
    .value(),
);
