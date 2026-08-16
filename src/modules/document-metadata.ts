import type { RouteLocationNormalized } from 'vue-router';

export const DEFAULT_DOCUMENT_TITLE = 'IT Tools - Handy online tools for developers';
export const DEFAULT_DOCUMENT_DESCRIPTION = 'Collection of handy online tools for developers, with great UX. IT Tools is a free and open-source collection of handy online tools for developers & people working in IT.';

function setNamedMeta(document: Document, name: string, content: string): void {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.name = name;
    document.head.append(element);
  }
  element.content = content;
}

function removeNamedMeta(document: Document, name: string): void {
  document.head.querySelector(`meta[name="${name}"]`)?.remove();
}

export function applyRouteDocumentMetadata(document: Document, route: RouteLocationNormalized): void {
  if (route.meta.isTool) {
    document.title = `${String(route.meta.name)} - IT Tools`;
    setNamedMeta(document, 'description', String(route.meta.description ?? ''));
    const keywords = Array.isArray(route.meta.keywords)
      ? route.meta.keywords.filter((keyword): keyword is string => typeof keyword === 'string').join(',')
      : '';
    keywords ? setNamedMeta(document, 'keywords', keywords) : removeNamedMeta(document, 'keywords');
    return;
  }

  document.title = route.name === 'about'
    ? 'About - IT Tools'
    : route.name === 'NotFound'
      ? 'Page not found - IT Tools'
      : DEFAULT_DOCUMENT_TITLE;
  setNamedMeta(document, 'description', DEFAULT_DOCUMENT_DESCRIPTION);
  removeNamedMeta(document, 'keywords');
}
