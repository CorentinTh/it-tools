# Conventional Commits Cheatsheet

## Structure

A conventional commit message follows this structure:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

## Elements

### Type (Required)
The type describes the kind of change being made. Common types include:

- **feat**: A new feature for the user
- **fix**: A bug fix for the user
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code changes that neither fix a bug nor add a feature
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependency updates, build changes
- **perf**: Performance improvements
- **ci**: Changes to CI/CD configuration
- **build**: Changes to build system or external dependencies
- **revert**: Reverting a previous commit

### Scope (Optional)
The scope provides additional context about what part of the codebase is affected:

```
feat(auth): add OAuth2 integration
fix(api): resolve timeout issues
docs(readme): update installation instructions
```

### Description (Required)
A brief description of the change:

- Use imperative mood ("add" not "added" or "adds")
- Keep it concise (50 characters or less recommended)
- Don't capitalize the first letter
- Don't end with a period

### Body (Optional)
Provides more detailed explanation of the change:

- Separate from description with a blank line
- Explain the motivation and contrast with previous behavior
- Use imperative mood

### Footer (Optional)
Contains metadata about the commit:

- **Breaking changes**: Start with `BREAKING CHANGE:`
- **Issue references**: `Closes #123`, `Fixes #456`
- **Co-authors**: `Co-authored-by: Name <email>`

## Examples

### Simple commit
```
feat: add user authentication
```

### With scope
```
fix(parser): handle edge case in JSON parsing
```

### With body
```
feat: add email notifications

Users can now receive email notifications for important events.
This includes account changes, security alerts, and system updates.
```

### With footer
```
fix: prevent racing of requests

Introduce a request id and a reference to latest request. Dismiss
incoming responses other than from latest request.

Closes #123
```

### Breaking change
```
feat!: send an email to the customer when a product is shipped

BREAKING CHANGE: The shipping service now requires an email address
```

### Full example
```
feat(shopping cart): add ability to remove items

Users can now remove items from their shopping cart by clicking
the remove button next to each item. This improves the user
experience by allowing corrections without starting over.

Closes #456
Co-authored-by: Jane Doe <jane@example.com>
```

## Common Tools

### Commitizen
Interactive tool for creating conventional commits:

```shell
npm install -g commitizen
npm install -g cz-conventional-changelog
echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc
```

Usage:
```shell
git cz
```

### Commitlint
Lints commit messages to ensure they follow conventional format:

```shell
npm install --save-dev @commitlint/config-conventional @commitlint/cli
```

Configuration in `.commitlintrc.json`:
```json
{
  "extends": ["@commitlint/config-conventional"]
}
```

### Husky
Git hooks to enforce commit message format:

```shell
npm install --save-dev husky
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit ${1}'
```

### Semantic Release
Automatically generates releases based on conventional commits:

```shell
npm install --save-dev semantic-release
```

### Conventional Changelog
Generates changelogs from conventional commits:

```shell
npm install -g conventional-changelog-cli
conventional-changelog -p angular -i CHANGELOG.md -s
```
