/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_SERVER_HOST: string;
  readonly VITE_SERVER_PORT: number;
  // more env variables...
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
