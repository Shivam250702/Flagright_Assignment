/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // add other environment variables here if you have them
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}