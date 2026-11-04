/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

interface ImportMetaEnv {
  VITE_PLAUSIBLE_API_HOST: string;
  VITE_PLAUSIBLE_DOMAIN: string;
  PACKAGE_VERSION: string;
  VITE_APP_ENV: string;
  VITE_COMMIT_SHA: string;
  GIT_SHORT_SHA: string;
  PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
