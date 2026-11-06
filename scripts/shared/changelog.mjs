import { readFile, writeFile } from 'fs/promises';

export { addToChangelog };

async function addToChangelog({ changelog, version, changelogPath = './CHANGELOG.md' }) {
  const changelogContent = await readFile(changelogPath, 'utf-8');
  const versionTitle = `## Version ${version}`;

  if (changelogContent.includes(versionTitle)) {
    throw new Error(`Version ${version} already exists in the changelog`);
  }

  const newChangeLogContent = changelogContent.replace('## ', `${versionTitle}\n\n${changelog}\n\n## `);
  await writeFile(changelogPath, newChangeLogContent, 'utf-8');
}
