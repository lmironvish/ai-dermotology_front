import { useQuery } from "@tanstack/react-query";
import { env } from "@/app/config/env";
import { getAnalysisStatus } from "@/shared/api";
import type { AnalysisStatus } from "@/shared/api";
import { analysisQueryKeys } from "./queryKeys";

const TERMINAL_ANALYSIS_STATUSES = new Set<AnalysisStatus>([
  "completed",
  "failed",
  "error",
]);

interface UseAnalysisStatusQueryOptions {
  enabled?: boolean;
  poll?: boolean;
  pollIntervalMs?: number;
}

function isTerminalStatus(status: AnalysisStatus | undefined): boolean {
  if (!status) {
    return false;
  }

  return TERMINAL_ANALYSIS_STATUSES.has(status);
}

export function useAnalysisStatusQuery(
  id: string | null,
  options: UseAnalysisStatusQueryOptions = {},
) {
  const { enabled = true, poll = false, pollIntervalMs = env.analysisPollIntervalMs } = options;

  return useQuery({
    queryKey: id
      ? analysisQueryKeys.simpleStatus(id)
      : [...analysisQueryKeys.all, "simple", "status", "unknown"],
    queryFn: () => {
      if (!id) {
        throw new Error("Analysis id is required to load analysis status.");
      }

      return getAnalysisStatus(id);
    },
    enabled: Boolean(id) && enabled,
    refetchInterval: (query) => {
      if (!poll) {
        return false;
      }

      return isTerminalStatus(query.state.data?.status) ? false : pollIntervalMs;
    },
  });
}
