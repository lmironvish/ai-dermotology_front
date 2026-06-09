import { useMutation } from "@tanstack/react-query";
import { startCaseAnalysis } from "../api/caseApi";
import { analysisQueryKeys } from "./queryKeys";

export function useStartCaseAnalysisMutation() {
  return useMutation({
    mutationKey: analysisQueryKeys.caseStart(),
    mutationFn: (caseId: string) => startCaseAnalysis(caseId),
  });
}
