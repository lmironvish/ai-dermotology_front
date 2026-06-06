import { env } from "@/app/config/env";
import { ApiError } from "@/shared/api/http";
import {
  createCase,
  downloadCasePdf,
  extractCaseId,
  generateCasePdf,
  getCase,
  startCaseAnalysis,
  uploadCaseImage,
} from "./caseApi";
import type { CaseCreatePayload, CaseDto } from "./caseApi.types";
import type { AnalyzeImageResult } from "./types";

type Condition<TValue> = (value: TValue) => boolean;

const RETRYABLE_PDF_STATUSES = new Set([404, 409, 423, 425]);
const COMPLETED_STATUSES = new Set(["completed", "ready", "succeeded", "success"]);
const FAILED_STATUSES = new Set(["failed", "error", "cancelled"]);

function sleep(delayMs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

function buildCreateCasePayload(file: File): CaseCreatePayload {
  return {
    metadata: {
      file_name: file.name,
      mime_type: file.type,
      source: "web-app",
      uploaded_at: new Date().toISOString(),
    },
    consents: {
      personal_data_processing: true,
      ai_analysis: true,
    },
  };
}

function normalizeStatus(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

function getCaseErrorMessage(caseData: CaseDto): string | null {
  if (!caseData.error) {
    return null;
  }

  if (typeof caseData.error === "string") {
    return caseData.error;
  }

  return caseData.error.message ?? caseData.error.code ?? "Case processing failed.";
}

function isAnalysisCompleted(caseData: CaseDto): boolean {
  const caseStatus = normalizeStatus(caseData.status);
  const analysisStatus = normalizeStatus(caseData.analysis?.status);

  return COMPLETED_STATUSES.has(caseStatus) || COMPLETED_STATUSES.has(analysisStatus);
}

function isAnalysisFailed(caseData: CaseDto): boolean {
  const caseStatus = normalizeStatus(caseData.status);
  const analysisStatus = normalizeStatus(caseData.analysis?.status);

  return FAILED_STATUSES.has(caseStatus) || FAILED_STATUSES.has(analysisStatus);
}

async function pollCaseUntil(
  caseId: string,
  condition: Condition<CaseDto>,
  timeoutMs: number,
  pollIntervalMs: number,
): Promise<CaseDto> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const caseData = await getCase(caseId);

    if (condition(caseData)) {
      return caseData;
    }

    await sleep(pollIntervalMs);
  }

  throw new Error("Timed out while waiting for the case to finish processing.");
}

async function waitForAnalysisCompletion(caseId: string): Promise<CaseDto> {
  return pollCaseUntil(
    caseId,
    (caseData) => {
      if (isAnalysisFailed(caseData)) {
        throw new Error(getCaseErrorMessage(caseData) ?? "Image analysis failed.");
      }

      return isAnalysisCompleted(caseData);
    },
    env.analysisPollTimeoutMs,
    env.analysisPollIntervalMs,
  );
}

async function waitForPdfBlob(caseId: string): Promise<Blob> {
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

export async function fetchAnalyzeImage(file: File): Promise<AnalyzeImageResult> {
  const caseData = await createCase(buildCreateCasePayload(file));
  const caseId = extractCaseId(caseData);

  await uploadCaseImage(caseId, file);
  await startCaseAnalysis(caseId);
  await waitForAnalysisCompletion(caseId);
  await generateCasePdf(caseId);

  const reportBlob = await waitForPdfBlob(caseId);
  const reportUrl = URL.createObjectURL(reportBlob);

  return {
    caseId,
    reportUrl,
  };
}
