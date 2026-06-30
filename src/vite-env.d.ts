/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API base path（默认 /api，开发期由 vite proxy 转发到 janus-server）。 */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
