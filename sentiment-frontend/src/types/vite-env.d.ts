/// <reference types="vite/client" />

type ImportMetaEnv = {
  readonly VITE_WEBSOCKET_URL: string;
  // Add other environment variables here if needed
}

type ImportMeta = {
  readonly env: ImportMetaEnv;
}