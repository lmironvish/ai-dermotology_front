import type { CaseDto } from "../api/caseApi.types";

const SIMPLE_SUCCESS_STATUSES = new Set(["completed"]);
const SIMPLE_ERROR_STATUSES = new Set(["failed", "error"]);
const CASE_SUCCESS_STATUSES = new Set(["completed", "ready", "succeeded", "success"]);
const CASE_ERROR_STATUSES = new Set(["failed", "error", "cancelled"]);

export function normalizeStatus(status: string | null | undefined): string {
  return (status ?? "").trim().toLowerCase();
}

export function isSimpleAnalysisSuccess(status: string | null | undefined): boolean {
  return SIMPLE_SUCCESS_STATUSES.has(normalizeStatus(status));
}

export function isSimpleAnalysisFailure(status: string | null | undefined): boolean {
  return SIMPLE_ERROR_STATUSES.has(normalizeStatus(status));
}

export function isCaseAnalysisCompleted(caseData: CaseDto | null | undefined): boolean {
  const caseStatus = normalizeStatus(caseData?.status);
  const analysisStatus = normalizeStatus(caseData?.analysis?.status);

  return CASE_SUCCESS_STATUSES.has(caseStatus) || CASE_SUCCESS_STATUSES.has(analysisStatus);
}

export function isCaseAnalysisFailed(caseData: CaseDto | null | undefined): boolean {
  const caseStatus = normalizeStatus(caseData?.status);
  const analysisStatus = normalizeStatus(caseData?.analysis?.status);

  return CASE_ERROR_STATUSES.has(caseStatus) || CASE_ERROR_STATUSES.has(analysisStatus);
}

export function getCaseErrorMessage(caseData: CaseDto | null | undefined): string | null {
  if (!caseData?.error) {
    return null;
  }

  if (typeof caseData.error === "string") {
    return caseData.error;
  }

  return caseData.error.message ?? caseData.error.code ?? "Case processing failed.";
}
