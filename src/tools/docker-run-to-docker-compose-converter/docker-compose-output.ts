const TOP_LEVEL_VERSION_LINE = /^\uFEFF?version:\s*(?:"[^"\r\n]*"|'[^'\r\n]*'|[^\r\n]*)\r?\n/;

export function removeObsoleteComposeVersion(composeYaml: string) {
  return composeYaml.replace(TOP_LEVEL_VERSION_LINE, '');
}
