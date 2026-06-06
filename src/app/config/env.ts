export type AnalysisApiMode = "mock" | "real";
export type AnalysisApiBackend = "cases" | "simple";

const DEFAULT_ANALYSIS_API_MODE: AnalysisApiMode = "mock";
const DEFAULT_ANALYSIS_API_BACKEND: AnalysisApiBackend = "cases";
const DEFAULT_ANALYSIS_POLL_INTERVAL_MS = 2000;
const DEFAULT_ANALYSIS_POLL_TIMEOUT_MS = 120000;

function resolveAnalysisApiMode(value?: string): AnalysisApiMode {
  return value === "real" ? "real" : DEFAULT_ANALYSIS_API_MODE;
}

function resolveAnalysisApiBackend(value?: string): AnalysisApiBackend {
  return value === "simple" ? "simple" : DEFAULT_ANALYSIS_API_BACKEND;
}

function resolveNumberEnv(value: string | undefined, fallback: number): number {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
}

export const env = {
  analysisApiMode: resolveAnalysisApiMode(import.meta.env.VITE_ANALYSIS_API_MODE),
  analysisApiBackend: resolveAnalysisApiBackend(import.meta.env.VITE_ANALYSIS_API_BACKEND),
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "",
  analysisPollIntervalMs: resolveNumberEnv(
    import.meta.env.VITE_ANALYSIS_POLL_INTERVAL_MS,
    DEFAULT_ANALYSIS_POLL_INTERVAL_MS,
  ),
  analysisPollTimeoutMs: resolveNumberEnv(
    import.meta.env.VITE_ANALYSIS_POLL_TIMEOUT_MS,
    DEFAULT_ANALYSIS_POLL_TIMEOUT_MS,
  ),
} as const;
