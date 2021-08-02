const slugify = (e: string) => encodeURIComponent(String(e).trim().toLowerCase().replace(/\s+/g, '-'))

function toc(content: string) {
  return content.split('\n').filter(s => s.startsWith('#')).map((s) => {
    const [_, hashtags, title] = s.match(/^(#+) (.*)/) ?? [undefined, 0, '']
    const level = Math.max((hashtags as string).length - 2, 0)

    return `${'    '.repeat(level)}- [${title}](#${slugify(title as string)})`
  })
}

export {
  toc
}
