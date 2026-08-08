export { isValidXML, parseXml };

function parseXml(rawXml: string): unknown {
  const trimmed = rawXml.trim();

  if (trimmed === '') {
    return undefined;
  }

  const doc = parseXmlDocument(trimmed);

  if (doc === undefined || doc.documentElement === null) {
    return undefined;
  }

  return elementToValue(doc.documentElement);
}

function isValidXML(rawXml: string): boolean {
  const trimmed = rawXml.trim();

  if (trimmed === '') {
    return true;
  }

  return parseXmlDocument(trimmed) !== undefined;
}

function parseXmlDocument(xml: string): Document | undefined {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');

  if (doc.getElementsByTagName('parsererror').length > 0) {
    return undefined;
  }

  return doc;
}

function elementToValue(element: Element): unknown {
  const attributes = Array.from(element.attributes);
  const childElements = Array.from(element.children);
  const text = getDirectText(element);

  if (attributes.length === 0 && childElements.length === 0) {
    return text;
  }

  const value: Record<string, unknown> = {};

  for (const attribute of attributes) {
    value[`@${attribute.name}`] = attribute.value;
  }

  const tags = [...new Set(childElements.map(child => child.tagName))];
  for (const tag of tags) {
    const sameTagChildren = childElements.filter(child => child.tagName === tag);
    value[tag] = sameTagChildren.length === 1
      ? elementToValue(sameTagChildren[0])
      : sameTagChildren.map(elementToValue);
  }

  if (text !== '') {
    value['#text'] = text;
  }

  return value;
}

function getDirectText(element: Element): string {
  return Array.from(element.childNodes)
    .filter(node => node.nodeType === Node.TEXT_NODE || node.nodeType === Node.CDATA_SECTION_NODE)
    .map(node => node.textContent ?? '')
    .join('')
    .trim();
}
