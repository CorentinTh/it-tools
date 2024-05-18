import { describe, expect, it } from 'vitest';
import {
  getTocMarkdown,
} from './markdown-toc-generator.service';

describe('markdown-toc-generator', () => {
  it('Generate TOC correctly', async () => {
    expect(getTocMarkdown({
      markdown: '',
    })).to.equal('');

    const sourceMarkdown = `# Some main title

[TOC]

## First Title

Some text 

## Second  Spaced  Title

Some text

### Title with Link [TOC](http://it-tools.tech)

\`\`\`
## some bash code
echo 'test';
\`\`\`

### Title with code \`var\`

Some text

## Last Title`;

    expect(getTocMarkdown({
      markdown: sourceMarkdown,
      anchorPrefix: 'h-',
    })).to.equal(`# Some main title

<!-- TOC START -->
- [First Title](#h-first-title)
- [Second  Spaced  Title](#h-second-spaced-title)
  * [Title with Link TOC](#h-title-with-link-toc)
  * [Title with code \`var\`](#h-title-with-code-var)
- [Last Title](#h-last-title)
<!-- TOC END -->

<!-- TOC ANCHOR --><a name="first-title"></a>
## First Title

Some text 

<!-- TOC ANCHOR --><a name="second-spaced-title"></a>
## Second  Spaced  Title

Some text

<!-- TOC ANCHOR --><a name="title-with-link-toc"></a>
### Title with Link [TOC](http://it-tools.tech)

\`\`\`
## some bash code
echo 'test';
\`\`\`

<!-- TOC ANCHOR --><a name="title-with-code-var"></a>
### Title with code \`var\`

Some text

<!-- TOC ANCHOR --><a name="last-title"></a>
## Last Title`);
    expect(getTocMarkdown({
      markdown: sourceMarkdown,
      maxLevel: 2,
    })).to.equal(`# Some main title

<!-- TOC START -->
- [First Title](#first-title)
- [Second  Spaced  Title](#second-spaced-title)
- [Last Title](#last-title)
<!-- TOC END -->

<!-- TOC ANCHOR --><a name="first-title"></a>
## First Title

Some text 

<!-- TOC ANCHOR --><a name="second-spaced-title"></a>
## Second  Spaced  Title

Some text

### Title with Link [TOC](http://it-tools.tech)

\`\`\`
## some bash code
echo 'test';
\`\`\`

### Title with code \`var\`

Some text

<!-- TOC ANCHOR --><a name="last-title"></a>
## Last Title`);
    expect(getTocMarkdown({
      markdown: sourceMarkdown,
      commentStyle: 'liquid',
    })).to.equal(`# Some main title

{%- # TOC START -%}
- [First Title](#first-title)
- [Second  Spaced  Title](#second-spaced-title)
  * [Title with Link TOC](#title-with-link-toc)
  * [Title with code \`var\`](#title-with-code-var)
- [Last Title](#last-title)
{%- # TOC END -%}

{%- # TOC ANCHOR -%}<a name="first-title"></a>
## First Title

Some text 

{%- # TOC ANCHOR -%}<a name="second-spaced-title"></a>
## Second  Spaced  Title

Some text

{%- # TOC ANCHOR -%}<a name="title-with-link-toc"></a>
### Title with Link [TOC](http://it-tools.tech)

\`\`\`
## some bash code
echo 'test';
\`\`\`

{%- # TOC ANCHOR -%}<a name="title-with-code-var"></a>
### Title with code \`var\`

Some text

{%- # TOC ANCHOR -%}<a name="last-title"></a>
## Last Title`);
    expect(getTocMarkdown({
      markdown: sourceMarkdown,
      generateAnchors: false,
    })).to.equal(`# Some main title

<!-- TOC START -->
- [First Title](#first-title)
- [Second  Spaced  Title](#second-spaced-title)
  * [Title with Link TOC](#title-with-link-toc)
  * [Title with code \`var\`](#title-with-code-var)
- [Last Title](#last-title)
<!-- TOC END -->

## First Title

Some text 

## Second  Spaced  Title

Some text

### Title with Link [TOC](http://it-tools.tech)

\`\`\`
## some bash code
echo 'test';
\`\`\`

### Title with code \`var\`

Some text

## Last Title`);
    expect(getTocMarkdown({
      markdown: sourceMarkdown,
      indentSpaces: 4,
      indentChars: '-',
      concatSpaces: false,
    })).to.equal(`# Some main title

<!-- TOC START -->
- [First Title](#first-title)
- [Second  Spaced  Title](#second--spaced--title)
    - [Title with Link TOC](#title-with-link-toc)
    - [Title with code \`var\`](#title-with-code-var)
- [Last Title](#last-title)
<!-- TOC END -->

<!-- TOC ANCHOR --><a name="first-title"></a>
## First Title

Some text 

<!-- TOC ANCHOR --><a name="second--spaced--title"></a>
## Second  Spaced  Title

Some text

<!-- TOC ANCHOR --><a name="title-with-link-toc"></a>
### Title with Link [TOC](http://it-tools.tech)

\`\`\`
## some bash code
echo 'test';
\`\`\`

<!-- TOC ANCHOR --><a name="title-with-code-var"></a>
### Title with code \`var\`

Some text

<!-- TOC ANCHOR --><a name="last-title"></a>
## Last Title`);
  });

  it('Regenerate TOC correctly', async () => {
    expect(getTocMarkdown({
      markdown: `# Some main title

<!-- TOC START -->
- [First Title](#first-title)
- [Second  Spaced  Title](#second--spaced--title)
    - [Title with Link TOC](#title-with-link-toc)
    - [Title with code \`var\`](#title-with-code-var)
- [Last Title](#last-title)
<!-- TOC END -->

<!-- TOC ANCHOR --><a name="first-title"></a>
## First Title

Some text

<!-- TOC ANCHOR --><a name="second--spaced--title"></a>
## Second  Spaced  Title

Some text

<!-- TOC ANCHOR --><a name="title-with-link-toc"></a>
### Title with Link [TOC](http://it-tools.tech)

\`\`\`
## some bash code
echo 'test';
\`\`\`

<!-- TOC ANCHOR --><a name="title-with-code-var"></a>
### Title with code \`var\`

Some text

<!-- TOC ANCHOR --><a name="last-title"></a>
## Last Title`,
      anchorPrefix: 'h-',
    })).to.equal(`# Some main title

<!-- TOC START -->
- [First Title](#h-first-title)
- [Second  Spaced  Title](#h-second-spaced-title)
  * [Title with Link TOC](#h-title-with-link-toc)
  * [Title with code \`var\`](#h-title-with-code-var)
- [Last Title](#h-last-title)
<!-- TOC END -->

<!-- TOC ANCHOR --><a name="first-title"></a>
## First Title

Some text

<!-- TOC ANCHOR --><a name="second-spaced-title"></a>
## Second  Spaced  Title

Some text

<!-- TOC ANCHOR --><a name="title-with-link-toc"></a>
### Title with Link [TOC](http://it-tools.tech)

\`\`\`
## some bash code
echo 'test';
\`\`\`

<!-- TOC ANCHOR --><a name="title-with-code-var"></a>
### Title with code \`var\`

Some text

<!-- TOC ANCHOR --><a name="last-title"></a>
## Last Title`);
  });

  it('Generate distinct TOC ids', async () => {
    expect(getTocMarkdown({
      markdown: `# Some main title

[TOC]

## Same Title 1

Some text

## Same Title 1

Some text

### Same title 1

Some text`,
      anchorPrefix: 'h-',
    })).to.equal(`# Some main title

<!-- TOC START -->
- [Same Title 1](#h-same-title-1)
- [Same Title 1](#h-same-title-1-1)
  * [Same title 1](#h-same-title-1-2)
<!-- TOC END -->

<!-- TOC ANCHOR --><a name="same-title-1"></a>
## Same Title 1

Some text

<!-- TOC ANCHOR --><a name="same-title-1-1"></a>
## Same Title 1

Some text

<!-- TOC ANCHOR --><a name="same-title-1-2"></a>
### Same title 1

Some text`);
  });

  it('Generate ids for non latin', async () => {
    expect(getTocMarkdown({
      markdown: `# Some main title

[TOC]

## Привет non-latin 你好

Some text

## 😄 emoji

Some text

### Other title 1

Some text`,
      anchorPrefix: 'h-',
    })).to.equal(`# Some main title

<!-- TOC START -->
- [Привет non-latin 你好](#h--non-latin-)
- [😄 emoji](#h--emoji)
  * [Other title 1](#h-other-title-1)
<!-- TOC END -->

<!-- TOC ANCHOR --><a name="-non-latin-"></a>
## Привет non-latin 你好

Some text

<!-- TOC ANCHOR --><a name="-emoji"></a>
## 😄 emoji

Some text

<!-- TOC ANCHOR --><a name="other-title-1"></a>
### Other title 1

Some text`);
  });
});
