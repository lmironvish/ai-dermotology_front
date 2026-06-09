import { useMutation } from "@tanstack/react-query";
import { env } from "@/app/config/env";
import { downloadReport } from "@/shared/api";
import { ApiError } from "@/shared/api/http";
import { downloadCasePdf } from "../api/caseApi";
import { analysisQueryKeys } from "./queryKeys";

const RETRYABLE_PDF_STATUSES = new Set([404, 409, 423, 425]);

interface DownloadAnalysisPdfParams {
  analysisId: string | null;
  reportUrl: string | null;
}

function sleep(delayMs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

async function downloadCasePdfWithRetry(caseId: string): Promise<Blob> {
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
}

async function downloadMockPdf(reportUrl: string | null): Promise<Blob> {
  if (!reportUrl) {
    throw new Error("Report is not available for download.");
  }

  const response = await fetch(reportUrl);
  if (!response.ok) {
    throw new Error("Unable to prepare the PDF report for download.");
  }

  return response.blob();
}

export function useDownloadAnalysisPdfMutation() {
  return useMutation({
    mutationKey: [...analysisQueryKeys.all, "pdf", "download"],
    mutationFn: async ({ analysisId, reportUrl }: DownloadAnalysisPdfParams) => {
      if (env.analysisApiMode === "mock") {
        return downloadMockPdf(reportUrl);
      }

      if (!analysisId) {
        throw new Error("Analysis id is required to download the PDF report.");
      }

      if (env.analysisApiBackend === "cases") {
        return downloadCasePdfWithRetry(analysisId);
      }

      const reportResponse = await downloadReport(analysisId);
      return reportResponse.blob;
    },
  });
}
