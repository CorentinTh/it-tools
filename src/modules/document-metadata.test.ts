import type { RouteLocationNormalized } from 'vue-router';
import { describe, expect, it } from 'vitest';
import { DEFAULT_DOCUMENT_DESCRIPTION, DEFAULT_DOCUMENT_TITLE, applyRouteDocumentMetadata } from './document-metadata';

function route(overrides: Partial<RouteLocationNormalized>): RouteLocationNormalized {
  return {
    fullPath: '/',
    hash: '',
    matched: [],
    meta: {},
    name: 'home',
    params: {},
    path: '/',
    query: {},
    redirectedFrom: undefined,
    ...overrides,
  };
}

describe('route document metadata', () => {
  it('publishes tool metadata and removes it on a normal page', () => {
    applyRouteDocumentMetadata(document, route({
      meta: { isTool: true, name: 'JSON prettify and format', description: 'Format JSON locally', keywords: ['json', 'format'] },
      name: 'json-prettify',
      path: '/json-prettify',
    }));

    expect(document.title).toBe('JSON prettify and format - IT Tools');
    expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('Format JSON locally');
    expect(document.head.querySelector('meta[name="keywords"]')?.getAttribute('content')).toBe('json,format');

    applyRouteDocumentMetadata(document, route({ name: 'home' }));
    expect(document.title).toBe(DEFAULT_DOCUMENT_TITLE);
    expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(DEFAULT_DOCUMENT_DESCRIPTION);
    expect(document.head.querySelector('meta[name="keywords"]')).toBeNull();
  });

  it('uses explicit titles for About and not-found pages', () => {
    applyRouteDocumentMetadata(document, route({ name: 'about', path: '/about' }));
    expect(document.title).toBe('About - IT Tools');

    applyRouteDocumentMetadata(document, route({ name: 'NotFound', path: '/missing' }));
    expect(document.title).toBe('Page not found - IT Tools');
  });
});
