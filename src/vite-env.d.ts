/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ANALYSIS_API_MODE?: "mock" | "real";
  readonly VITE_ANALYSIS_API_BACKEND?: "cases" | "simple";
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_ANALYSIS_POLL_INTERVAL_MS?: string;
  readonly VITE_ANALYSIS_POLL_TIMEOUT_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
