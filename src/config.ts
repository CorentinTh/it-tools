import { defineConfig } from 'figue';
import * as v from 'valibot';

// Environment variables are strings: only a case-insensitive "true" enables a flag.
const booleanSchema = v.pipe(
  v.union([v.boolean(), v.string()]),
  v.transform(value => (typeof value === 'string' ? value.trim().toLowerCase() === 'true' : value)),
);

export const { config } = defineConfig(
  {
    app: {
      version: {
        doc: 'Application current version',
        schema: v.string(),
        default: '0.0.0',
        env: 'PACKAGE_VERSION',
      },
      lastCommitSha: {
        doc: 'Application last commit SHA version',
        schema: v.string(),
        default: '',
        env: 'VITE_COMMIT_SHA',
      },
      baseUrl: {
        doc: 'Application base url',
        schema: v.string(),
        default: '/',
        env: 'BASE_URL',
      },
      env: {
        doc: 'Application current env',
        schema: v.picklist(['production', 'development', 'preview', 'test']),
        default: 'development',
        env: 'VITE_APP_ENV',
      },
    },
    plausible: {
      isTrackerEnabled: {
        doc: 'Is the tracker enabled',
        schema: booleanSchema,
        default: false,
        env: 'VITE_TRACKER_ENABLED',
      },
      domain: {
        doc: 'Plausible current domain',
        schema: v.string(),
        default: '',
        env: 'VITE_PLAUSIBLE_DOMAIN',
      },
      apiHost: {
        doc: 'Plausible remote api host',
        schema: v.string(),
        default: '',
        env: 'VITE_PLAUSIBLE_API_HOST',
      },
      trackLocalhost: {
        doc: 'Enable or disable localhost tracking by plausible',
        schema: v.boolean(),
        default: false,
      },
    },
    showBanner: {
      doc: 'Show the banner',
      schema: booleanSchema,
      default: false,
      env: 'VITE_SHOW_BANNER',
    },
    showSponsorBanner: {
      doc: 'Show the sponsor banner',
      schema: booleanSchema,
      default: false,
      env: 'VITE_SHOW_SPONSOR_BANNER',
    },
  },
  {
    envSource: {
      ...import.meta.env,
      // Because these 'import.meta.env.*' strings are statically replaced during build time (see 'define' in vite.config.ts)
      PACKAGE_VERSION: import.meta.env.PACKAGE_VERSION,
      VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
      VITE_COMMIT_SHA: import.meta.env.VITE_COMMIT_SHA,
    },
  },
);
