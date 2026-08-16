export const CONVENTIONAL_COMMIT_TYPES = [
  { value: 'feat', label: 'feat — user-facing feature' },
  { value: 'fix', label: 'fix — user-facing bug fix' },
  { value: 'docs', label: 'docs — documentation only' },
  { value: 'style', label: 'style — formatting, no behavior change' },
  { value: 'refactor', label: 'refactor — code change without feature/fix' },
  { value: 'perf', label: 'perf — performance improvement' },
  { value: 'test', label: 'test — tests only' },
  { value: 'build', label: 'build — build system or dependency change' },
  { value: 'ci', label: 'ci — continuous integration change' },
  { value: 'chore', label: 'chore — maintenance' },
  { value: 'revert', label: 'revert — revert a previous change' },
] as const;

export interface ConventionalCommitInput {
  type: string
  scope: string
  description: string
  body: string
  footers: string
  breaking: boolean
  breakingDescription: string
}

export interface ConventionalCommitResult {
  message: string
  warnings: string[]
}

export function buildConventionalCommit(input: ConventionalCommitInput): ConventionalCommitResult {
  if (!CONVENTIONAL_COMMIT_TYPES.some(type => type.value === input.type)) {
    throw new TypeError('Select a supported Conventional Commit type.');
  }
  const scope = input.scope.trim();
  const description = input.description.trim();
  const body = input.body.trim();
  const footers = input.footers.trim();
  const breakingDescription = input.breakingDescription.trim();
  if (scope && (!/^[a-z0-9][a-z0-9._/-]{0,49}$/u.test(scope) || scope.endsWith('/'))) {
    throw new TypeError('Scope must be 1–50 lowercase letters, digits, dots, underscores, slashes, or hyphens.');
  }
  if (!description || description.length > 100 || /[\r\n]/u.test(description)) {
    throw new TypeError('Description must be one line between 1 and 100 characters.');
  }
  if (body.length > 4096 || footers.length > 2048 || breakingDescription.length > 500) {
    throw new RangeError('Body, footers, or breaking-change text exceeds its local limit.');
  }
  if (input.breaking && !breakingDescription) {
    throw new TypeError('Describe the breaking change when the breaking flag is enabled.');
  }
  const header = `${input.type}${scope ? `(${scope})` : ''}${input.breaking ? '!' : ''}: ${description}`;
  const sections = [header];
  if (body) {
    sections.push(body);
  }
  const footerLines = [];
  if (input.breaking) {
    footerLines.push(`BREAKING CHANGE: ${breakingDescription}`);
  }
  if (footers) {
    footerLines.push(footers);
  }
  if (footerLines.length) {
    sections.push(footerLines.join('\n'));
  }
  const warnings: string[] = [];
  if (/^[A-Z]/u.test(description)) {
    warnings.push('Many projects prefer a lowercase description after the colon.');
  }
  if (description.endsWith('.')) {
    warnings.push('Many projects omit the final period in the header.');
  }
  if (header.length > 100) {
    warnings.push(`Header length is ${header.length}; many projects use a 72–100 character limit.`);
  }
  return { message: sections.join('\n\n'), warnings };
}
