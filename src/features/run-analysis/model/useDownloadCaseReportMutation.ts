import { useMutation } from "@tanstack/react-query";
import { env } from "@/app/config/env";
import { ApiError } from "@/shared/api/http";
import { downloadCasePdf } from "../api/caseApi";
import { analysisQueryKeys } from "./queryKeys";

const RETRYABLE_PDF_STATUSES = new Set([404, 409, 423, 425]);

function sleep(delayMs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

export function useDownloadCaseReportMutation() {
  return useMutation({
    mutationKey: analysisQueryKeys.casePdf("download"),
    mutationFn: async (caseId: string) => {
      const startedAt = Date.now();

      while (Date.now() - startedAt < env.analysisPollTimeoutMs) {
        try {
          return await downloadCasePdf(caseId);
        } catch (error) {
          if (!(error instanceof ApiError) || !RETRYABLE_PDF_STATUSES.has(error.status)) {
            throw error;
          }
        }

        await sleep(env.analysisPollIntervalMs);
      }

      throw new Error("Timed out while waiting for the PDF report.");
    },
  });
}
