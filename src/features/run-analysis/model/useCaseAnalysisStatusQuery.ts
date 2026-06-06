import { useQuery } from "@tanstack/react-query";
import { env } from "@/app/config/env";
import { getCase } from "../api/caseApi";
import { analysisQueryKeys } from "./queryKeys";
import { isCaseAnalysisCompleted, isCaseAnalysisFailed } from "./status";

interface UseCaseAnalysisStatusQueryOptions {
  enabled?: boolean;
  poll?: boolean;
  pollIntervalMs?: number;
}

export function useCaseAnalysisStatusQuery(
  caseId: string | null,
  options: UseCaseAnalysisStatusQueryOptions = {},
) {
  const { enabled = true, poll = false, pollIntervalMs = env.analysisPollIntervalMs } = options;

  return useQuery({
    queryKey: caseId
      ? analysisQueryKeys.caseStatus(caseId)
      : [...analysisQueryKeys.all, "case", "status", "unknown"],
    queryFn: () => {
      if (!caseId) {
        throw new Error("Case id is required to load case status.");
      }

      return getCase(caseId);
    },
    enabled: Boolean(caseId) && enabled,
    refetchInterval: (query) => {
      if (!poll) {
        return false;
      }

      if (isCaseAnalysisCompleted(query.state.data) || isCaseAnalysisFailed(query.state.data)) {
        return false;
      }

      return pollIntervalMs;
    },
  });
}
