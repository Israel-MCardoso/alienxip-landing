/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NEXT_PUBLIC_DIAGNOSTIC_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
