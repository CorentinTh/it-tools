/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

interface ImportMetaEnv {
  VITE_PLAUSIBLE_API_HOST: string;
  VITE_PLAUSIBLE_DOMAIN: string;
  PACKAGE_VERSION: string;
  FIGLET_FONT_PATH: string;
  FIGLET_FONT_CACHE_NAME: string;
  LAZY_ASSET_CACHE_NAME: string;
  STANDALONE: boolean;
  GIT_SHORT_SHA: string;
  PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare var __IT_TOOLS_STANDALONE_FONTS__: Record<string, string> | undefined;
declare const __IT_TOOLS_STANDALONE_GEOIP_DATASET_URLS__: Record<string, string> | undefined;
