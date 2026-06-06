import { useMutation } from "@tanstack/react-query";
import { generateCasePdf } from "../api/caseApi";
import { analysisQueryKeys } from "./queryKeys";

export function useGenerateCasePdfMutation() {
  return useMutation({
    mutationKey: analysisQueryKeys.casePdf("generate"),
    mutationFn: generateCasePdf,
  });
}
