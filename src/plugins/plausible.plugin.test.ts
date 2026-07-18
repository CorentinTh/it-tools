import Plausible from 'plausible-tracker';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPlausibleInstance, sanitizeAnalyticsUrl } from './plausible.plugin';

const mocks = vi.hoisted(() => ({
  trackEvent: vi.fn(),
  trackPageview: vi.fn(),
  afterEach: vi.fn(),
}));

vi.mock('plausible-tracker', () => ({
  default: vi.fn(() => ({
    trackEvent: mocks.trackEvent,
    trackPageview: mocks.trackPageview,
  })),
}));

vi.mock('@/router', () => ({
  default: {
    afterEach: mocks.afterEach,
  },
}));

const enabledConfig = {
  isTrackerEnabled: true,
  domain: 'tools.example.test',
  apiHost: 'https://analytics.example.test',
  trackLocalhost: true,
};

describe('Plausible privacy boundary', () => {
  beforeEach(() => {
    mocks.trackEvent.mockReset();
    mocks.trackPageview.mockReset();
    mocks.afterEach.mockReset();
    mocks.afterEach.mockReturnValue(vi.fn());
    vi.mocked(Plausible).mockClear();
    window.history.replaceState({}, '', '/');
  });

  it('removes credentials, query parameters, and fragments from telemetry URLs', () => {
    expect(sanitizeAnalyticsUrl('https://user:password@tools.example.test/regex?regex=secret#result'))
      .toBe('https://tools.example.test/regex');
    expect(sanitizeAnalyticsUrl('')).toBeNull();
    expect(sanitizeAnalyticsUrl('http://[')).toBeNull();
  });

  it('overrides page data for custom events even when a caller supplies an unsafe URL', () => {
    window.history.replaceState({}, '', '/regex-tester?regex=private-pattern#match');
    const client = createPlausibleInstance({ config: enabledConfig });

    client.trackEvent('Copy', undefined, {
      url: 'https://tools.example.test/should-not-win?token=secret',
      referrer: 'https://tools.example.test/from?document=secret',
    });

    expect(mocks.trackEvent).toHaveBeenCalledWith('Copy', undefined, {
      url: `${window.location.origin}/regex-tester`,
      referrer: null,
    });
  });

  it('tracks initial and client-side pageviews without query or hash content', () => {
    window.history.replaceState({}, '', '/regex-tester?regex=private-pattern#match');
    const client = createPlausibleInstance({ config: enabledConfig });
    client.enableAutoPageviews();

    expect(mocks.trackPageview).toHaveBeenNthCalledWith(1, {
      url: `${window.location.origin}/regex-tester`,
      referrer: null,
    });

    const routeHook = mocks.afterEach.mock.calls[0]?.[0];
    window.history.replaceState({}, '', '/token-generator?token=private#value');
    routeHook();

    expect(mocks.trackPageview).toHaveBeenNthCalledWith(2, {
      url: `${window.location.origin}/token-generator`,
      referrer: null,
    });
  });
});
