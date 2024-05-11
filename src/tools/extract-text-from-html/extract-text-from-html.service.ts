function validateHtml(value: string) {
  try {
    new DOMParser().parseFromString(value, 'text/html');
  } catch (error) {
    return false;
  }

  const regex = /<([a-z][a-z0-9]*)\b[^>]*>(.*?)<\/\1>|<([a-z][a-z0-9]*)\b[^\/]*\/>/gi;
  const matches = value.match(regex);

  return Boolean(matches !== null && matches.length);
}

function getTextFromHtml(value: string) {
  const element = document.createElement('div');
  element.innerHTML = value;
  const text = element?.innerText || element?.textContent || '';
  return text.replace(/\s+/g, ' ');
}

export { validateHtml, getTextFromHtml };
