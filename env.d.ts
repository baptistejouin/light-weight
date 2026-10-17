/// <reference types="vite/client" />

interface ImportMetaEnv {
  DB_URL: string;
  DB_MIGRATIONS_URL: string;
  SITE_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
