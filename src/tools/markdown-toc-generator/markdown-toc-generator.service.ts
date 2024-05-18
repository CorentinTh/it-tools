function stripNonLatinCharacters(text: string) {
  return text.replace(/[^A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\u02BB\u02EE\uA78C\d\s_-]/g, '');
};

function transformInlineCode(text: string, transform: (s: string) => string) {
  return text.replace(/`(.*?)`/g, (_, p) => {
    return `\`${transform(p)}\``;
  });
};

function spacesToDash(text: string) {
  return text.replace(/\s/g, '-');
};

function stripHtmlTags(text: string) {
  return text.replace(/<.*?>/g, '');
};

function stripMarkdownLinks(text: string, replacement: string = '$1') {
  return text.replace(/\[([^\]]*)\]\([^\)]*\)/g, replacement);
};

function concatDashes(text: string) {
  return text.replace(/--+/g, '-');
};

function removeUnderscoreBoldAndItalics(text: string) {
  const underscoreBoldAndItalicsRegexes = ['__', '_'].map((it) => {
    return new RegExp(`\\b${it}([^_\\s]|[^_\\s].*?[^_\\s])${it}\\b`, 'g');
  });

  let result = text;

  underscoreBoldAndItalicsRegexes.forEach((regex) => {
    result = result.replace(regex, '$1');
  });
  return result;
};

function genericAnchorGenerator(text: string, concatSpaces: boolean) {
  let result = text;
  result = result.toLowerCase();
  result = transformInlineCode(result, (s: string) => {
    return stripNonLatinCharacters(s);
  });
  result = removeUnderscoreBoldAndItalics(result);
  result = stripHtmlTags(result);
  result = stripMarkdownLinks(result);
  result = result.trim();
  result = stripNonLatinCharacters(result);
  result = spacesToDash(result);
  if (concatSpaces) {
    result = concatDashes(result);
  }
  return result;
};

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

interface Title {
  level: number
  id: string
  name: string
  md: string
}

function getTitles(markdown: string, idGenerator: (titleMarkdownContent: string) => string) {
  const titles: Title[] = [];

  markdown = markdown.replace(/^```[\s\S]*?\n```/mg, () => {
    return '';
  });
  markdown = markdown.replace(/^~~~[\s\S]*?\n~~~/mg, () => {
    return '';
  });

  [...markdown.matchAll(/^(#+)(.*$)/mg)].forEach(
    ([match, levelString, titleContent]) => {
      const level = levelString.length;

      titles.push({
        md: match,
        level,
        id: idGenerator(titleContent),
        name: titleContent.trim(),
      });
    });

  return titles;
};

export function getTocMarkdown({
  markdown,
  generateAnchors = true,
  indentChars = '-*+',
  indentSpaces = 2,
  maxLevel = -1,
  anchorPrefix = '',
  concatSpaces = true,
  commentStyle = 'html',
}: {
  markdown: string
  generateAnchors?: boolean
  indentChars?: string
  indentSpaces?: number
  maxLevel?: number
  anchorPrefix?: string
  concatSpaces?: boolean
  commentStyle?: 'html' | 'liquid'
}) {
  const allIds: { [id: string]: number } = {};
  const getFinalId = (id: string) => {
    if (typeof allIds[id] === 'undefined') {
      allIds[id] = 0;
      return id;
    }
    else {
      allIds[id] += 1;
      return `${id}-${allIds[id]}`;
    }
  };
  const titles = getTitles(markdown, titleContent => getFinalId(genericAnchorGenerator(titleContent, concatSpaces)));

  const createLink = (linkText: string, url: string) => {
    return `[${linkText.replace('[', '\\[').replace(']', '\\]')}](${url.replace('(', '%28').replace(')', '%29')})`;
  };

  let markdownTOC = '';
  let resultMarkdown = markdown;
  const commentOpen = commentStyle === 'html' ? '<!--' : '{%- #';
  const commentClose = commentStyle === 'html' ? '-->' : '-%}';

  resultMarkdown = resultMarkdown.replace(
    new RegExp(`\n${commentOpen} TOC START.*?TOC END ${commentClose}\n`, 'smg'),
    '\n[TOC]\n',
  );
  resultMarkdown = resultMarkdown.replace(
    new RegExp(`^${commentOpen} TOC ANCHOR.*?\n`, 'mg'),
    '',
  );

  titles.forEach((title) => {
    if (title.level === 1) {
      return;
    }

    if (maxLevel > 0 && title.level > maxLevel) {
      return;
    }

    const level = title.level - 2;
    let offset = '';
    if (level) {
      offset = `${Array.from({ length: level * indentSpaces }).join(' ')} `;
    }
    const bulletChar = indentChars[level] ?? indentChars.slice(-1)[0];

    const anchorName = `${anchorPrefix}${title.id}`;

    markdownTOC += `${offset}${bulletChar} ${createLink(stripMarkdownLinks(title.name), `#${anchorName}`)}\n`;

    if (generateAnchors) {
      resultMarkdown = resultMarkdown.replace(
        new RegExp(`(?<!^${commentOpen} TOC ANCHOR.*\n)^${escapeRegExp(title.md)}`, 'm'),
          `${commentOpen} TOC ANCHOR ${commentClose}<a name="${title.id}"></a>\n${title.md}`,
      );
    }
  });

  resultMarkdown = resultMarkdown.replace(
    /^\[TOC\]\n/mg,
    `${commentOpen} TOC START ${commentClose}\n${markdownTOC}${commentOpen} TOC END ${commentClose}\n`,
  );

  return resultMarkdown;
}
