export function defineTool(toolDefinition: {
  slug: string;
  entryFile: string;
  currentDirUrl: string;
  icon: string;
  createdAt: Date;
}) {
  const entryFile = new URL(toolDefinition.entryFile, toolDefinition.currentDirUrl).pathname;
  const baseGithubUrlPath = entryFile.match(/(\/tools\/.*)$/)?.[1];
  const entryFileGithubUrl = `https://github.com/CorentinTh/crucials-tools/blob/main${baseGithubUrlPath}`;

  return {
    ...toolDefinition,
    key: toolDefinition.slug,
    entryFile,
    entryFileGithubUrl,
  };
}
