/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />

interface ImportMetaEnv {
    PACKAGE_VERSION: string;
    PROD: boolean;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  