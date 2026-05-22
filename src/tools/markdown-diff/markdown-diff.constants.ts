export const originalMarkdown = `# Release notes

## Added

- JSON export for reports
- Keyboard shortcuts for navigation
- Markdown table previews

## Fixed

- Preserve whitespace in code blocks

## Plugin support

| user | host | plugin |
| --- | --- | --- |
| mysql.infoschema | localhost | caching_sha2_password |
| mysql.session | localhost | caching_sha2_password |
| mysql.sys | localhost | caching_sha2_password |

\`inline code\` stays readable in preview mode.
`;

export const modifiedMarkdown = `# Release notes

## Added

- JSON and CSV export for reports
- Keyboard shortcuts for navigation
- Dark mode support for charts
- Markdown table previews

## Fixed

- Preserve whitespace in fenced code blocks

## Plugin support

| user | host | plugin |
| --- | --- | --- |
| mysql.session | localhost | caching_sha2_password |
| mysql.sys | localhost | caching_sha2_password |

\`\`\`sql
select user, host, plugin
from mysql.user;
\`\`\`
`;
