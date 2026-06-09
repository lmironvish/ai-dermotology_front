import { useMutation } from "@tanstack/react-query";
import { createCase } from "../api/caseApi";
import type { CaseCreatePayload } from "../api/caseApi.types";
import { analysisQueryKeys } from "./queryKeys";

export function useCreateCaseMutation() {
  return useMutation({
    mutationKey: [...analysisQueryKeys.all, "case", "create"],
    mutationFn: (payload: CaseCreatePayload) => createCase(payload),
  });
}
